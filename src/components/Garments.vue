<template>
  <b-container fluid="md">
    <div
      class="text-center"
      v-if="loadingGarments === false && this.garments.length === 0"
    >
      <h4>No garments were found</h4>
    </div>
    <div class="text-center loader" v-if="loadingGarments">
      <b-spinner style="width: 5rem; height: 5rem"></b-spinner>
      <br />
      <strong>Loading garments...</strong>
    </div>

    <div class="garments-list">
      <div class="garment-box" v-for="item in garments" :key="item.token">
        <router-link
          class="garment-link"
          :to="'/garment/' + item.token + '/detail'"
        >
          <div class="garment-holder">
            <h5>{{ item.name }}</h5>
            <b-row align-v="center">
              <b-col cols sm="4" class="garment-type">
                <img
                  v-if="item.type === 'Shirt'"
                  class="garment-ico text-center"
                  src="../assets/shirt.png"
                />
                <img
                  v-if="item.type === 'Pants'"
                  class="garment-ico text-center"
                  src="../assets/pants.png"
                />
                <img
                  v-if="item.type === 'Coat'"
                  class="garment-ico text-center"
                  src="../assets/jacket.png"
                />
              </b-col>
              <b-col cols sm="8" class="garment-details">
                <div class="detail-box">
                  <label>season</label>
                  <p>{{ item.season }}</p>
                </div>
                <div class="detail-box">
                  <label>manufacture Date</label>
                  <p>{{ item.manufactureDate }}</p>
                </div>
                <div class="detail-box">
                  <label>size</label>
                  <p>{{ item.size }}</p>
                </div>
                <div class="detail-box">
                  <label>color</label>
                  <input type="color" :value="item.color" disabled />
                </div>
              </b-col>
            </b-row>
          </div>
        </router-link>
      </div>
    </div>
  </b-container>
</template>

<style scoped lang="scss">
.loader {
  position: fixed;
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 250px;
  left: 0;
  top: 52px;
  margin: 0;
  background: rgba(217, 217, 217, 0.3);
  z-index: 100;
}

strong {
  font-size: 22px;
}

.garments-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: flex-start;
  align-content: flex-start;
  text-align: left;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    padding: 0;
    flex-direction: row;
  }

  .garment-box {
    display: flex;
    width: 100%;
    margin: 0 0 15px;
    transition: 0.3s;
    box-shadow: 2px 2px 6px #555;
    border: 1px solid black;

    @media only screen and (min-width: 768px) {
      width: calc(50% - 15px);
      min-height: 290px;

      &:nth-child(even) {
        margin: 0 0 40px 15px;
      }
      &:nth-child(odd) {
        margin: 0 15px 40px 0;
      }
      &:hover {
        transform: scale(1.005);
      }
      &:hover h5 {
        color: #29bb89;
      }
    }

    .garment-holder {
      padding: 30px 20px;
      width: 100%;

      h5 {
        color: #29bb89;
        font-weight: bold;
        transition: 0.3s;
        text-align: center;
        font-size: 1.5em;
        font-family: "Karla";
        margin: 0 0 1rem;
      }

      .garment-type {
        text-align: center;
      }

      .garment-details {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        flex-direction: row;

        .detail-box {
          width: 50%;

          label {
            font-size: 0.8rem;

            @media only screen and (min-width: 768px) {
              font-size: 0.7rem;
            }

            @media only screen and (min-width: 992px) {
              font-size: 0.8rem;
            }
          }
        }
      }
    }
  }

  a {
    color: #333;
    text-decoration: none;
  }
}

.garment-link {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
}

.item-row {
  border-radius: 25px;
  vertical-align: middle;
  padding: 20px 0px;
  margin: 40px 0;
  box-shadow: 0px 0px 10px;
  transition: 0.5s;
}

.row {
  justify-content: center;
}

.garment-ico {
  max-width: 130px;
  max-height: 100px;
  object-fit: contain;
}

.garment-info {
  word-break: break-word;
}

.garment-ico {
  width: 100%;
  max-width: 100px;
}
</style>

<script>
import { ipfsStore } from "@/store/ipfsStore";
import { web3Store } from "@/store/web3.ts";

export default {
  computed: {
    garments: function () {
      return ipfsStore.state.garments;
    },
  },
  data: function () {
    return {
      loadingGarments: true,
    };
  },
  watch: {
    garments: function (val) {
      if (ipfsStore.state.garments !== null) {
        const garments = ipfsStore.state.garments;
        console.log("done loading", garments);
        this.loadingGarments = false;
      }
    },
  },
  mounted() {
    web3Store.dispatch("getTokensForUser");
  },
  beforeMount() {
    this.loadingGarments = true;
  },
};
</script>
