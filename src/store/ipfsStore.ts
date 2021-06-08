import Vue from 'vue'
import Vuex from 'vuex'
import {web3Store} from '@/store/web3'
import {garmentModel} from "@/models/garmentModel";
import axios from "axios";

Vue.use(Vuex)

export const ipfsStore = new Vuex.Store({
    state: {
        garments: null,
    },
    mutations: {
        setUserGarments: async function (state, {userGarments}) {
            console.log("settings garments with", userGarments)
            state.garments = userGarments;
        }
    },
    actions: {
        async retrieveUserGarments(state, {tokens}) {
            let userGarments = []
            let tokensURIs: string[] = []

            tokensURIs = await ipfsStore.dispatch("getTokenURIs", {tokens})

            userGarments = await ipfsStore.dispatch("ipfsDataForTokens", {tokens, tokensURIs})

            console.log("userGarments before setting", userGarments)
            this.commit("setUserGarments", {userGarments})
        },
        async ipfsDataForTokens(state, {tokens, tokensURIs}) {
            let userGarments: garmentModel[] = []
            for (let i in tokens) {
                let token = tokens[i]
                const IpfsURI = tokensURIs[token]

                const response = await axios({
                    method: "get",
                    url: IpfsURI,
                });

                let garment: garmentModel = {
                    size: response.data.attributes[0].value,
                    color: response.data.attributes[1].value,
                    type: response.data.attributes[2].value,
                    originalPricing: response.data.attributes[3].value,
                    season: response.data.attributes[4].value,
                    fibers: response.data.attributes[5].value,
                    coating: response.data.attributes[6].value,
                    textiles: response.data.attributes[7].value,
                    factory: response.data.attributes[8].value,
                    manufactureDate: response.data.attributes[9].value,
                    designDate: response.data.attributes[10].value,
                    name: response.data.name,
                    imageCID: response.data.image,
                    token: token,
                }

                for (const attr in response.data.attributes) {
                    if (response.data.attributes.hasOwnProperty(attr) && response.data.attributes[attr].value != undefined) {
                        const trait = response.data.attributes[attr].trait_type
                        const value = response.data.attributes[attr].value
                        garment[trait] = value
                    }
                }

                userGarments.push(garment);
            }
            return userGarments;
        },
        async getTokenURIs(state, {tokens}) {
            let tokensURIs: string[] = []

            for (let i in tokens) {
                let token = tokens[i]
                const tokenURI = await web3Store.dispatch("getTokenURI", {token})

                if (tokenURI.startsWith("https://ipfs.io/ipfs/")) {
                    tokensURIs[token] = tokenURI
                }
            }

            return tokensURIs
        }
    },
})
