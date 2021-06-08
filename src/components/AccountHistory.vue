<template>
  <b-container class="history-list">
    <b-row
      class="history-row"
      align-v="center"
      v-for="item in garmentHistory"
      :key="item.token"
    >
      <router-link
        class="plain-link"
        :to="'/garment/' + item.token + '/owners'"
      >
        <b-col class="history-info">
          <h5>{{ item.reason }}</h5>
          <b-row>
            <b-col cols sm="4">
              <label>token:</label>
              <p>{{ item.token }}</p>
            </b-col>
            <b-col cols sm="4">
              <label>Status:</label>
              <p>{{ getStatus(item.status) }}</p>
            </b-col>
          </b-row>
          <span class="divided">
            <label>Sender:</label>
            <p>{{ item.senderAddress }}</p>
          </span>
          <span class="divided">
            <label>Receiver:</label>
            <p>{{ item.receiverAddress }}</p>
          </span>
        </b-col>
      </router-link>
    </b-row>
  </b-container>
</template>

<script>
import { web3Store } from "@/store/web3";

export default {
  data: function () {
    return {
      garmentHistory: [],
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
    async getHistory() {
      this.garmentHistory = await web3Store.dispatch("getTransactionsForUser");
    },
  },
  watch: {
    history: function () {
      this.getHistory();
    },
  },
  mounted() {
    this.getHistory();
  },
};
</script>

<style scoped lang="scss">
.history-row {
  margin: 30px 0;
  flex-direction: column;
  text-align: center;
  box-shadow: 1px 1px 5px #555;
  transition: 0.3s;

  &:hover {
    transform: scale(1.02);
  }

  @media only screen and (min-width: 552px) {
    flex-direction: row;
    text-align: left;
  }
}

.plain-link {
  display: flex;
  text-decoration: none;
  padding: 20px 25px;
  height: 100%;
  width: 100%;
}

.history-list {
  max-width: 768px;
}

.history-info {
  display: block;
  margin: auto 0;
  word-break: break-word;

  label {
    color: rgba(0, 0, 0, 0.5);
  }
  p {
    color: black;
  }

  h5 {
    letter-spacing: 1px;
    color: #289672;

    @media only screen and (min-width: 768px) {
      font-size: 1.4em;
    }
  }
}

span {
  &:not(:last-child) {
    margin: 0 25px 0 0;
  }

  @media only screen and (min-width: 768px) {
    display: inline-block;
    &.divided {
      display: block;
    }
  }
}
</style>