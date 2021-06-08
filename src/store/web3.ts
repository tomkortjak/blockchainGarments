import Vue from 'vue'
import Vuex from 'vuex'
import { metadata } from "@/assets/layout";

Vue.use(Vuex)

let web3Contract;
let account;
let contractAddress;
let web3;

declare global {
    interface Window {
        ethereum: any;
    }
}

export enum roles { USER, COMPANY, RECYCLER, OWNER }

export const web3Store = new Vuex.Store({
    state: {
        userTokens: [],
        account: null,
        role: "loading",
    },
    getters: {
        getRole: (state) => {
            return state.role
        },
    },
    mutations: {
        setUserTokens: async function (state, tokens) {
            state.userTokens = tokens;
        },
        setCurrentAccount: async function (state, account) {
            state.account = account
        },
        setRole: async function (state, role) {
            state.role = role
        },
    },
    actions: {
        setupWeb3: async function () {
            window.ethereum.on("accountsChanged", function (accounts) {
                window.location.reload();
            });

            if (!window.ethereum.isMetaMask) {
                alert("Please install MetaMask to use this app");
                return;
            }

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });

            if (chainId != 42) {
                alert("Please connect MetaMask to the kovan network");
                return;
            }

            const Web3 = require('web3')
            // let web3 = new Web3("http://127.0.0.1:7545/")
            web3 = new Web3(new Web3.providers.HttpProvider(process.env.VUE_APP_INFURA_URL))

            // fill here your smart contract address
            contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;

            //Connect to the contract
            web3Contract = await new web3.eth.Contract(metadata, contractAddress);

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            account = accounts[0];
            console.log("received account", account, "from metamask")

            // get role of user
            let role = await web3Contract.methods.getCategory().call({
                from: account
            });

            this.commit("setRole", role);

            // get tokens for user and make them globally available
            let tokens = await web3Contract.methods.getTokensForUser().call({
                from: account
            });

            this.commit("setCurrentAccount", account);
            this.commit("setUserTokens", tokens);
        },
        getTokensForUser: async function () {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            // get tokens for user and make them globally available
            let tokens = await web3Contract.methods.getTokensForUser().call({
                from: account
            });

            await this.commit("setUserTokens", tokens);
        },
        createToken: async function (state, { ipfsURI, amount }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            let val = (2500000000000000 * parseInt(amount)).toString(16).toUpperCase();
            console.log("sending a recycling fee of (hex)", val);

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                value: val,
                data: web3Contract.methods.createCollectible(ipfsURI, amount).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`token creation successful (https://kovan.etherscan.io/tx/${txHash})`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("token creation error", error.message)
            }
        },
        updateToken: async function (state, { ipfsURI, token }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            console.log(ipfsURI, token)

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                data: web3Contract.methods.updateTokenURI(ipfsURI, token).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`token update successful (https://kovan.etherscan.io/tx/${txHash})`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("token creation error", error.message)
            }

        },
        startTransfer: async function (state, { garmentToken, receiver, reason }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                data: web3Contract.methods.startTransaction(garmentToken, receiver, reason).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`transaction successfully started`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("transaction creation error", error.message)
            }
        },
        confirmTransfer: async function (state, { garmentToken }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            let val = '0';

            // Everyone except recyclers need to deposit the recyclers fee
            let role = web3Store.getters.getRole;
            if (role != roles.RECYCLER) {
                val = (2500000000000000).toString(16).toUpperCase();
                console.log("sending a recycling fee of (hex)", val);
            }

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                value: val,
                data: web3Contract.methods.confirmTransaction(garmentToken).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`transaction confirmation successful`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("transaction confirmation error", error.message)
            }
        },
        declineTransfer: async function (state, { garmentToken }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                data: web3Contract.methods.declineTransaction(garmentToken).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`transaction decline successful`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("transaction confirmation error", error.message)
            }
        },
        cancelTransfer: async function (state, { garmentToken }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                data: web3Contract.methods.cancelTransaction(garmentToken).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`transaction cancel successful`)
                this.dispatch("getTokensForUser")
            } catch (error) {
                console.log("transaction confirmation error", error.message)
            }
        },
        getTokenURI: async function (state, { token }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            return await web3Contract.methods.tokenURI(parseInt(token)).call();
        },
        getTransactionsForUser: async function () {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            let a = await web3Contract.methods.getTransactionsForUser(account).call();


            if (Array.isArray(a)) {
                let b = [...a]
                return b.reverse();
            }

            return a;
        },
        getTransactionsForToken: async function (state, { token }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            return await web3Contract.methods.getTransactionsForToken(token).call();
        },
        updateRole: async function (state, { address, role }) {
            if (web3Contract == null) {
                console.log("web3 contract is not defined");
                return;
            }

            const transactionParameters = {
                to: contractAddress,
                from: account,
                gas: "400000",
                data: web3Contract.methods.setUserCategory(address, role).encodeABI()
            };

            //sign the transaction via Metamask
            try {
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                console.log(`role update successful`)
            } catch (error) {
                console.log("role update error", error.message)
            }
        },
    }
})
