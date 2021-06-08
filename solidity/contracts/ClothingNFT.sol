// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ClothingNFT is ERC721 {
    uint256 public tokenCounter;
    address public owner;
    uint256 clothingFee = 2500000000000000;

    // NFTtoken to token transactions
    mapping(uint256 => Transaction[]) public tokenTransactions;

    // address maps to user transactions
    mapping(address => Transaction[]) userTransactions;

    // address to user
    mapping(address => User) public users;

    enum transactionStatus {PENDING, COMPLETED, CANCELED, DECLINED}
    enum userCategory {USER, COMPANY, RECYCLER, OWNER}

    struct Transaction {
        transactionStatus status;
        address receiverAddress;
        address senderAddress;
        string reason;
        uint256 token;
    }

    struct User {
        userCategory category;
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only the owner of the contract can use this function"
        );
        _;
    }

    constructor() public ERC721("AMFI", "AMFI") {
        owner = msg.sender;
        users[msg.sender].category = userCategory.OWNER;
        tokenCounter = 0;
    }

    /*
        @notice startTransaction starts a transaction between the sender and the receiver.
        It approves the token for the receiver so the receiver can call the transferFrom function in the confirmTransaction function.
        @param _token The token for which you want to confirm the transaction.
        @param _receiver The receiver address.
        @param _reason The reason for the transfer.
    */
    function startTransaction(
        uint256 _token,
        address _receiver,
        string memory _reason
    ) public {
        require(
            users[msg.sender].category == userCategory.USER ||
                users[msg.sender].category == userCategory.COMPANY ||
                users[msg.sender].category == userCategory.OWNER,
            "Only users and companies are allowed to do transactions"
        );

        bool found = false;

        // Loop over all transactions for the given garment/token and check if one of them is on status 'PENDING'
        // and has the token as the given token
        for (uint16 i = 0; i < tokenTransactions[_token].length; i++) {
            if (
                tokenTransactions[_token][i].status == transactionStatus.PENDING
            ) {
                found = true;
            }
        }

        // Do not allow multiple transactions to be started for the same token
        require(
            !found,
            "There is already a transaction for this token with status 'PENDING'"
        );

        // Create the transaction object
        Transaction memory t =
            Transaction(
                transactionStatus.PENDING,
                _receiver,
                msg.sender,
                _reason,
                _token
            );

        // User approves the receiver to transfer the token
        super.approve(_receiver, _token);

        // Push transaction to garment mapping
        tokenTransactions[_token].push(t);

        // Map the transaction under the receiver
        // The current owner can still quickly find this transaction by listing his tokens and then listing the transactions for each token,
        // but the receiver can't unless he loops over every garment. Therefore we map the transaction to the receiver.
        userTransactions[_receiver].push(t);
        userTransactions[msg.sender].push(t);
    }

    /*
        @notice confirmTransaction confirms a transaction and transfers the token to you.
        @param _token The token for which you want to confirm the transaction.
    */
    function confirmTransaction(uint256 _token) public payable {
        bool found = false;
        uint16 index;

        // Loop over all transactions for the given garment/token and check if one of them is on status 'PENDING'
        // and has the receiver listed as the msg.sender (caller)
        for (uint16 i = 0; i < tokenTransactions[_token].length; i++) {
            if (
                tokenTransactions[_token][i].receiverAddress == msg.sender &&
                tokenTransactions[_token][i].status == transactionStatus.PENDING
            ) {
                found = true;
                index = i;
            }
        }

        // If there was no pending transaction found with the given tokenID and the msg.sender as receiver, then error
        require(
            found,
            "No transaction was found matching the given parameters and status 'PENDING'"
        );

        // If the msg.sender is not a recycler and the clothing fee isnt present, then revert
        // We require everyone but recyclers to pay a clothing fee on their items at the time of receiving
        if (
            users[msg.sender].category != userCategory.RECYCLER &&
            msg.value != clothingFee
        ) {
            revert(
                "To transfer a collectable you need to deposit an exact free of 0.0025 ETH"
            );
        }

        if (
            users[msg.sender].category == userCategory.RECYCLER && msg.value > 0
        ) {
            revert("Recyclers do not pay any fee for accepting garments");
        }

        //  Transfer the token using the earlier approved access since msg.sender is not the current token owner
        super.transferFrom(
            tokenTransactions[_token][index].senderAddress,
            tokenTransactions[_token][index].receiverAddress,
            _token
        );

        // Give the sender their fee back
        payable(tokenTransactions[_token][index].senderAddress).transfer(
            clothingFee
        );

        // Update the userTransaction for the senderAddress
        updateTransaction(index, _token, transactionStatus.COMPLETED);
    }

    /*
        @notice cancelTransaction cancels a transaction.
        @param _token The token for which you want to cancel the transaction.
    */
    function cancelTransaction(uint256 _token) public {
        bool found = false;
        uint16 index;

        // Loop over all transactions for the given garment/token and check if one of them is on status 'PENDING'
        // and has the receiver listed as the msg.sender (caller)
        for (uint16 i = 0; i < tokenTransactions[_token].length; i++) {
            if (
                tokenTransactions[_token][i].senderAddress == msg.sender &&
                tokenTransactions[_token][i].status == transactionStatus.PENDING
            ) {
                found = true;
                index = i;
            }
        }

        // If there was no pending transaction found with the given tokenID and the msg.sender as receiver, then error
        require(
            found,
            "No transaction was found matching the given parameters and status 'PENDING'"
        );

        updateTransaction(index, _token, transactionStatus.CANCELED);
    }


    /*
        @notice declineTransaction declines a transaction.
        @param _token The token for which you want to decline the transaction.
    */
    function declineTransaction(uint256 _token) public {
        bool found = false;
        uint16 index;

        // Loop over all transactions for the given garment/token and check if one of them is on status 'PENDING'
        // and has the receiver listed as the msg.sender (caller)
        for (uint16 i = 0; i < tokenTransactions[_token].length; i++) {
            if (
                tokenTransactions[_token][i].receiverAddress == msg.sender &&
                tokenTransactions[_token][i].status == transactionStatus.PENDING
            ) {
                found = true;
                index = i;
            }
        }

        // If there was no pending transaction found with the given tokenID and the msg.sender as receiver, then error
        require(
            found,
            "No transaction was found matching the given parameters and status 'PENDING'"
        );

        updateTransaction(index, _token, transactionStatus.DECLINED);
    }

    /*
        @notice updateTransaction updates a transaction object in the user transaction mappings.
        Using this function avoids code repeating in several functions like the accept and decline function.
        @param index The 0 based index of the transaction struct in the original tokenTransactions mapping (avoids re-looping).
        @param _token The NFT/token that belongs to the transaction.
        @param transactionStatus The status that the transaction should be set to.
    */
    function updateTransaction(
        uint16 index,
        uint256 _token,
        transactionStatus status
    ) internal {
        // Update the userTransaction for the senderAddress
        for (
            uint256 i = 0;
            i <
            userTransactions[tokenTransactions[_token][index].senderAddress]
                .length;
            i++
        ) {
            Transaction memory found =
                userTransactions[
                    tokenTransactions[_token][index].senderAddress
                ][i];
            Transaction memory transaction = tokenTransactions[_token][index];
            bytes32 userTransactionHash =
                (
                    keccak256(
                        abi.encodePacked(
                            found.reason,
                            found.status,
                            found.token,
                            found.receiverAddress,
                            found.senderAddress
                        )
                    )
                );
            bytes32 transactionHash =
                (
                    keccak256(
                        abi.encodePacked(
                            transaction.reason,
                            transaction.status,
                            transaction.token,
                            transaction.receiverAddress,
                            transaction.senderAddress
                        )
                    )
                );
            if (userTransactionHash == transactionHash) {
                userTransactions[
                    tokenTransactions[_token][index].senderAddress
                ][i]
                    .status = status;
            }
        }
        // Update the userTransaction for the receiverAddress
        for (
            uint256 i = 0;
            i <
            userTransactions[tokenTransactions[_token][index].receiverAddress]
                .length;
            i++
        ) {
            Transaction memory found =
                userTransactions[
                    tokenTransactions[_token][index].receiverAddress
                ][i];
            Transaction memory transaction = tokenTransactions[_token][index];
            bytes32 userTransactionHash =
                (
                    keccak256(
                        abi.encodePacked(
                            found.reason,
                            found.status,
                            found.token,
                            found.receiverAddress,
                            found.senderAddress
                        )
                    )
                );
            bytes32 transactionHash =
                (
                    keccak256(
                        abi.encodePacked(
                            transaction.reason,
                            transaction.status,
                            transaction.token,
                            transaction.receiverAddress,
                            transaction.senderAddress
                        )
                    )
                );
            if (userTransactionHash == transactionHash) {
                userTransactions[
                    tokenTransactions[_token][index].receiverAddress
                ][i]
                    .status = status;
            }
        }

        // Set transaction status to completed
        tokenTransactions[_token][index].status = status;
    }

    /*
        @notice createCollectible creates and mints a new NFT/token.
        @param tokenURI The URI to the off-chain properties.
        @param amount The amount of NFTs/tokens you want to create for the given URI.
    */
    function createCollectible(string memory tokenURI, uint16 amount)
        public
        payable
        returns (uint256[] memory)
    {
        require(
            users[msg.sender].category == userCategory.COMPANY,
            "Only companies are allowed to create garments"
        );

        require(
            amount < 100000,
            "you can only create 100000 garments at 1 time"
        );

        require(
            msg.value == clothingFee * amount,
            "You need to deposit an exact fee of 0.0025ETH per garment"
        );

        uint256[] memory items = new uint256[](amount);
        uint16 i;
        for (i = 0; i < amount; i++) {
            tokenCounter = tokenCounter + 1;
            uint256 newItemId = tokenCounter;

            _safeMint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenURI);

            items[i] = newItemId;
        }

        return items;
    }

    /*
        @notice updateTokenURI updates the tokenURI of an NFT.
        @param tokenURI The new tokenURI.
        @param _token The token for which you want to update the URI.
    */
    function updateTokenURI(string memory tokenURI, uint16 _token) public {
        _setTokenURI(_token, tokenURI);
    }

    /*
        @notice setUserCategory sets the category/role for a given address.
        Only the contract owner/deployer can call this function.
        @param a The address for which you want to update the category.
        @param userCategory The category that the user will be set to.
    */
    function setUserCategory(address a, userCategory category)
        public
        onlyOwner
    {
        require(msg.sender != a, "Owner cant update his own role"); // TODO make it so that owner cant change his own role?
        users[a].category = category;
    }

    /*
        @notice getCategory returns the category/role for the msg.sender / caller.
    */
    function getCategory() public view returns (userCategory) {
        return users[msg.sender].category;
    }

    /*
        @notice getUser returns the onchain properties of a user/address.
        @param userAddress The address of which you want the properties.
    */
    function getUser(address userAddress) public view returns (User memory) {
        require(
            users[userAddress].category != userCategory.USER,
            "You can only receive the information of Companies or recyclers."
        );
        return users[userAddress];
    }

    /*
        @notice getTokensForUser returns all the tokens for the msg.sender / caller.
    */
    function getTokensForUser() public view returns (uint256[] memory) {
        address owner = msg.sender;
        uint256 tokenCount = balanceOf(msg.sender);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalGarments = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all garments have IDs starting at 1 and increasing
            // sequentially up to the totalGarments count.
            uint256 garmentId;

            for (garmentId = 1; garmentId <= totalGarments; garmentId++) {
                if (ownerOf(garmentId) == owner) {
                    result[resultIndex] = garmentId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    /*
        @notice getTransactionsForUser returns all the transaction structs for a given user/address.
        @param userAddress The address of which you want the transactions.
    */
    function getTransactionsForUser(address userAddress)
        public
        view
        returns (Transaction[] memory)
    {
        return userTransactions[userAddress];
    }

    /*
        @notice getTransactionsForToken returns all the transaction structs for a given token.
        @param token The token of which you want the transactions.
    */
    function getTransactionsForToken(uint256 token)
        public
        view
        returns (Transaction[] memory)
    {
        return tokenTransactions[token];
    }

    /* Overwrite public ERC721 functions which we do not allow to be called directly (e.g. to avoid paying recycling fees) */

    function transferFrom(
        address _From,
        address _To,
        uint256 tokenId
    ) public override {}

    function approve(address to, uint256 tokenId) public override {}

    function setApprovalForAll(address operator, bool approved)
        public
        override
    {}

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {}

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {}
}
