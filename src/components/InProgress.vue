<template>
  <b-container
    class="progress-list"
    fluid="sm"
    v-if="pendingTransactions && pendingTransactions.length > 0"
  >
    <b-row
      v-for="transaction in pendingTransactions"
      class="item-row"
      :key="transaction.token"
    >
      <b-col cols sm="2" class="img-column"
        ><img class="garment-ico" src="../assets/transfer.png" />
      </b-col>
      <b-col cols sm="10" class="garment-info">
        <b-row>
          <b-col cols md="2" class="sm-text">reason:</b-col>
          <b-col cols md="8">{{ transaction.reason }}</b-col>
        </b-row>
        <b-row>
          <b-col cols md="2" class="sm-text">receiver:</b-col>
          <b-col cols md="8">{{ transaction.receiverAddress }}</b-col>
        </b-row>
        <b-row>
          <b-col cols md="2" class="sm-text">sender:</b-col>
          <b-col cols md="8">{{ transaction.senderAddress }}</b-col>
        </b-row>
        <b-row>
          <b-col cols md="2" class="sm-text">Token:</b-col>
          <b-col cols md="8">{{ transaction.token }}</b-col>
        </b-row>
      </b-col>
      <b-row
        v-if="transaction.receiverAddress.toLowerCase() === currentAccount"
      >
        <b-col cols="6">
          <b-button
            variant="outline-success"
            v-on:click="confirm(transaction.token)"
            block
            ><span v-if="role != dRoles.RECYCLER">Confirm</span><span v-if="role == dRoles.RECYCLER">Recycle</span>
          </b-button>
        </b-col>
        <b-col cols="6">
          <b-button
            variant="outline-danger"
            v-on:click="decline(transaction.token)"
            block
            >Decline</b-button
          >
        </b-col>
        <small
          style="width: 100%; text-align: center; margin-top: 5px"
          v-if="role != dRoles.RECYCLER"
          ><i
            >A transfer will cost 0.0025 ETH, which is a recycling fee that you
            get back upon a future transfer or recycling.</i
          ></small
        >
      </b-row>
      <b-row v-if="transaction.senderAddress.toLowerCase() === currentAccount">
        <b-col cols="12">
          <b-button
            variant="outline-danger"
            v-on:click="cancel(transaction.token)"
            block
            >Cancel Transfer</b-button
          >
        </b-col>
      </b-row>
    </b-row>
  </b-container>
</template>

<script>
import { web3Store, roles } from "@/store/web3";

export default {
  data: function () {
    return {
      pendingTransactions: [],
      dRoles: roles,
    };
  },
  computed: {
    garmentTokens: function () {
      return web3Store.state.userTokens;
    },
    currentAccount: function () {
      return web3Store.state.account;
    },
    role() {
      return web3Store.getters.getRole;
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
    async getPendingTransactions() {
      const transactions = await web3Store.dispatch("getTransactionsForUser");
      let receivedPendingTransactions = [];

      for (let transactionIndex in transactions) {
        let transactionInfo = transactions[transactionIndex];

        let transaction = {
          status: this.getStatus(transactionInfo.status),
          receiverAddress: transactionInfo.receiverAddress,
          senderAddress: transactionInfo.senderAddress,
          reason: transactionInfo.reason,
          token: transactionInfo.token,
        };

        if (transaction.status === "PENDING") {
          receivedPendingTransactions.push(transaction);
        }
      }

      this.pendingTransactions = receivedPendingTransactions;
    },
    async cancel(garmentToken) {
      console.log("cancel");
      await web3Store.dispatch("cancelTransfer", { garmentToken });
    },
    async confirm(garmentToken) {
      console.log("confirm");
      await web3Store.dispatch("confirmTransfer", { garmentToken });
    },
    async decline(garmentToken) {
      console.log("decline");
      await web3Store.dispatch("declineTransfer", { garmentToken });
    },
  },
  watch: {
    garmentTokens: function () {
      this.getPendingTransactions();
    },
  },
  mounted() {
    this.getPendingTransactions();
  },
};
</script>>

<style scoped lang="scss">
.item-row {
  box-shadow: 1px 1px 5px #555;
  margin: 0;
  margin-bottom: 20px;
  padding: 20px 20px;
  border: 1px solid black;
  > .row {
    margin: 1rem 0 0;
  }
}

p {
  margin: 0;
}

.progress-list {
  margin: 30px 25px;
  text-align: left;
  width: calc(100% - 50px);
  padding: 20px 25px;

  @media only screen and (min-width: 576px) {
    margin: 30px auto;
  }

  @media only screen and (min-width: 992px) {
    max-width: 768px;
  }
}

.sm-text {
  text-transform: capitalize;
  margin: auto 0;
  font-size: 1rem;
  color: rgba(40, 150, 114, 75%);
}

.row {
  width: 100%;
}

.garment-info {
  margin: auto 0;

  h5 {
    letter-spacing: 1px;

    @media only screen and (min-width: 768px) {
      font-size: 1.4em;
    }
  }
}

.col-md-8 {
  font-size: 1.1rem;
  word-break: break-word;
}

.img-column {
  text-align: center;
  margin: auto;
  padding: 0;

  @media only screen and (min-width: 768px) {
    padding: 0 15px;
  }
}

.garment-ico {
  width: 100%;
  max-width: 75px;
  object-fit: contain;
  object-position: center;
  margin: auto;
}

span {
  color: #555;
  display: block;

  &:not(:last-child) {
    margin: 0 25px 0 0;
  }

  @media only screen and (min-width: 768px) {
    display: inline-block;
  }
}
</style>
