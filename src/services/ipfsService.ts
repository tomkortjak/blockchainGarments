import {web3Store} from "@/store/web3"
import IPFS from 'ipfs-core'

export class IpfsService {
    node;

    constructor() {
        this.setupIPFS()
    }

    async getNFTMetadata(tokenID) {
        const metadataURI = await web3Store.getters.getTokenURI(tokenID)
        const cid = this.stripIpfsUriPrefix(metadataURI);

        return this.getMetadataFromCID(cid);
    }

    async getMetadataFromCID(CID) {
        for await (const data of this.node.cat(CID)) {
            return data.toString();
        }
        return null;
    }

    stripIpfsUriPrefix(cidOrURI) {
        if (cidOrURI.startsWith('ipfs://')) {
            return cidOrURI.slice('ipfs://'.length)
        }
        return cidOrURI
    }

    async setupIPFS() {
        const node = await IPFS.create({repo: 'ipfs-' + Math.random()})

        // test code to see it its working
        // let a = await this.getNFTMetadata("QmT1v6qxdEYmNjaxh75HEAhpzwHJ5mLCnM4gVFXvCSb6rR", node);
        // let a = await this.getMetadataFromCID("QmT1v6qxdEYmNjaxh75HEAhpzwHJ5mLCnM4gVFXvCSb6rR");
        // console.log(a)
    }

}



