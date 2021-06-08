<template>
  <b-container class="ownerHistory" fluid="sm">
    <b-row
      class="owner-row text-left"
      v-for="transfer in ownershipHistory"
      :key="transfer.owner"
    >
      <b-col cols="12">
        <h4>{{ transfer.reason }}</h4>
      </b-col>
      <b-col>
        <label class="transferLabel"
          ><b>From:</b> {{ transfer.senderAddress }}
        </label>
        <label class="transferLabel"
          ><b>To:</b> {{ transfer.receiverAddress }}
        </label>
      </b-col>
    </b-row>
    <router-link :to="'/garment/' + currentToken + '/detail'">
      <b-button class="backBtn" variant="outline-success" size="lg"
        >Back to details</b-button
      >
    </router-link>
  </b-container>
</template>

<script>
import { web3Store } from "@/store/web3";

export default {
  data: function () {
    return {
      currentToken: this.$route.params.id,
      ownershipHistory: [],
    };
  },
  computed: {
    history: function () {
      return web3Store.state.userTokens;
    },
  },
  methods: {
    getStatus(status) {
      switch (status) {
        case "0":
          return "PENDING";
        case "1":
          return "COMPLETED";
        case "2":
          return "CANCELED";
        case "3":
          return "DECLINED";
        default:
          return "";
      }
    },
    async getOwners() {
      const token = this.$data.currentToken;
      this.ownershipHistory = await web3Store.dispatch(
        "getTransactionsForToken",
        { token }
      );
      let acceptedTransactions = [];
      for (let i = 0; i < this.ownershipHistory.length; i++) {
        if (this.getStatus(this.ownershipHistory[i].status) == "COMPLETED")
          acceptedTransactions.push(this.ownershipHistory[i]);
      }
      this.ownershipHistory = acceptedTransactions.reverse();
    },
  },
  watch: {
    history: function () {
      this.getOwners();
    },
  },
  mounted() {
    this.getOwners();
  },
};
</script>

<style lang="scss" scoped>
.owner-row {
  border-left: 3px solid #289672;
  padding: 25px 0;
}
.ownerHistory {
  max-width: 580px;
}

.backBtn {
  margin-top: 30px;
}

.transferLabel {
  word-break: break-word;
  margin-right: 10px;
}
</style>