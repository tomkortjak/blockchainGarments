<template>
  <div id="app">
    <topnav></topnav>
    <router-view />
    <form id="uploadForm" role="form" enctype="multipart/form-data"></form>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Karla&family=Raleway&display=swap");
#app {
  font-family: "Raleway", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 55px 0 0;
}

body::-webkit-scrollbar {
  background: lightgrey;
  width: 1rem;
}

body::-webkit-scrollbar-thumb {
  background-color: #289672;
  outline: 1px solid #289672;
}
div {
  a {
    text-decoration: none;
    margin: 0;
    &:hover {
      text-decoration: none;
    }
  }
}

.animate-height {
  overflow: hidden;
  animation: reveal 0.8s ease-in 0s normal;
}

.detail-box {
  text-align: center;
  width: calc(50% - 5px);
  margin: 0 0 15px;
  word-break: break-word;

  @media only screen and (min-width: 576px) {
    text-align: left;
    width: calc(33.3% - 10px);
    margin: 0 0 15px;
  }

  label {
    text-transform: lowercase;
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.4rem;
    margin: 0;
  }

  input[type="color"] {
    display: block;
    outline: none;
    border: none;
    width: 100%;
    height: 35px;
    border-color: transparent;
  }
}

@keyframes reveal {
  0% {
    max-height: 0px;
  }
  100% {
    max-height: 5000px;
  }
}
</style>

<script>
import { Component, Vue } from "vue-property-decorator";
import topnav from "@/components/Navbar.vue";
import { web3Store } from "@/store/web3.ts";
import { IpfsService } from "@/services/ipfsService";
import { ipfsStore } from "@/store/ipfsStore";

web3Store.dispatch("setupWeb3");

const ipfs = new IpfsService();

@Component({
  components: {
    topnav,
  },
  computed: {
    garmentTokens: function () {
      return web3Store.state.userTokens;
    },
    garments: function () {
      return ipfsStore.state.garments;
    },
  },
  methods: {
    getNFTMetadata(tokenID) {
      return ipfs.getNFTMetadata(tokenID);
    },

    async getGarmentDetails() {
      const tokens = web3Store.state.userTokens;
      await ipfsStore.dispatch("retrieveUserGarments", { tokens });
    },
  },
  watch: {
    garmentTokens: function () {
      this.getGarmentDetails();
    },
  },
})
export default class App extends Vue {}
</script>
