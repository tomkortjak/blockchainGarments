const { assert } = require('chai')

const ClothingNFT = artifacts.require('./ClothingNFT.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ClothingNFT',(accounts) => {
    let contract

    before( async() => {
        contract = await ClothingNFT.deployed();
    })

    describe('deployment', async() => {
        it('should deploy successfully', async() => {
            const address = contract.address
            assert.notEqual(address,'')
        })

        it('should have name and symbol', async() => {
            const name = await contract.name()
            assert.equal(name,'AMFI');

            const symbol = await contract.symbol()
            assert.equal(symbol,'AMFI');
        })
    })

    describe('creating garments', async() => {

        it('should create a new token', async() => {
            const result = await contract.createGarment('http://fashion.com/collection2021/1','Mini Dress','S')
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply,1)
            const event = result.logs[0].args

            const tokenId = event.tokenId.toNumber();

            assert.equal(tokenId,1,'id is correct')
            assert.equal(event.to,accounts[0])

            const garment = await contract.getGarmentDetails(tokenId)

            assert.equal(garment.owner,accounts[0]);
            assert.equal(garment.name,'Mini Dress');
            assert.equal(garment.size,'S');
        })
    })

    describe('ownership', async() => {

        it('should have the correct owner', async() => {
            // minting one garments
            const result = await contract.createGarment('http://fashion.com/collection2021/2','Wrap Dress','M')
            const event = result.logs[0].args
            const tokenId = event.tokenId.toNumber()
            console.log('tokenId',tokenId)
            
            const owner = await contract.ownerOf(tokenId)
            assert.equal(owner,accounts[0]);

            const uri = await contract.tokenURI(tokenId)
            assert.equal(uri,'http://fashion.com/collection2021/2')

        })

        it('should transfer a token to someone', async() => {
            
            // minting one garment
            const result = await contract.createGarment('http://fashion.com/collection2021/4','Super Dress','M')
            const event = result.logs[0].args
            const tokenId = event.tokenId.toNumber()

            var tokens = await contract.getTokensForUser()
            const numberOfTokensBeforeTransfer = tokens.length
            console.log('numberOfTokensBeforeTransfer',numberOfTokensBeforeTransfer)

            // transfer the token to another account
            await contract.safeTransferFrom(accounts[0],accounts[1],tokenId)

            // check the ownership of the token
            const owner = await contract.ownerOf(tokenId);
            assert.equal(owner, accounts[1])

            tokens = await contract.getTokensForUser()
            for(var i=0;i<tokens.length;i++) {
                console.log('tokens['+ i + ']',tokens[i].toNumber())
            }

            assert.equal(tokens.length,numberOfTokensBeforeTransfer - 1)

        })

    })
})