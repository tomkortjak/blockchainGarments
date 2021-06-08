<template>
  <b-container fluid="lg" v-if="garment">
    <h3 class="garment-title">{{ garment.name }}</h3>
    <div class="animate-height">
      <b-row class="custom-row">
        <b-col>
          <img class="garment-ico" :src="garment.imageCID" />
          <b-button
            class="clean-btn"
            variant="outline-warning"
            v-b-modal.update-modal
            >Update garment information</b-button
          >
          <router-link :to="`/garment/` + currentToken + `/owners`">
            <b-button class="clean-btn" variant="outline-primary" block
              >Ownership history</b-button
            >
          </router-link>
          <router-link :to="`/garment/` + currentToken + `/transfer`">
            <b-button class="clean-btn" variant="outline-success" block
              >Transfer garment</b-button
            >
          </router-link>
        </b-col>
        <b-col cols md="8">
          <div class="custom-container">
            <div v-if="garment.size && garment.size !== ''" class="detail-box">
              <label>size</label>
              <p>{{ garment.size }}</p>
            </div>
            <div v-if="garment.type && garment.type !== ''" class="detail-box">
              <label>type</label>
              <p>{{ garment.type }}</p>
            </div>
            <div
              v-if="garment.originalPricing && garment.originalPricing !== ''"
              class="detail-box"
            >
              <label>original Pricing</label>
              <p>&euro;{{ garment.originalPricing }}</p>
            </div>
            <div
              v-if="garment.season && garment.season !== ''"
              class="detail-box"
            >
              <label>season</label>
              <p>{{ garment.season }}</p>
            </div>
            <div
              v-if="garment.fibers && garment.fibers !== ''"
              class="detail-box"
            >
              <label>fibers</label>
              <p>{{ garment.fibers }}</p>
            </div>
            <div
              v-if="garment.coating && garment.coating !== ''"
              class="detail-box"
            >
              <label>coating</label>
              <p>{{ garment.coating }}</p>
            </div>
            <div
              v-if="garment.textiles && garment.textiles !== ''"
              class="detail-box"
            >
              <label>textiles</label>
              <p>{{ garment.textiles }}</p>
            </div>
            <div
              v-if="garment.manufactureDate && garment.manufactureDate !== ''"
              class="detail-box"
            >
              <label>manufacture Date</label>
              <p>{{ garment.manufactureDate }}</p>
            </div>
            <div
              v-if="garment.factory && garment.factory !== ''"
              class="detail-box"
            >
              <label>factory</label>
              <p>{{ garment.factory }}</p>
            </div>
            <div
              v-if="garment.designDate && garment.designDate !== ''"
              class="detail-box"
            >
              <label>design Date</label>
              <p>{{ garment.designDate }}</p>
            </div>
            <div
              v-if="garment.dateOfSale && garment.dateOfSale !== ''"
              class="detail-box"
            >
              <label>date Of Sale</label>
              <p>{{ garment.dateOfSale }}</p>
            </div>
            <div
              v-if="garment.shippingDate && garment.shippingDate !== ''"
              class="detail-box"
            >
              <label>shipping Date</label>
              <p>{{ garment.shippingDate }}</p>
            </div>
            <div
              v-if="garment.lifeSpan && garment.lifeSpan !== ''"
              class="detail-box"
            >
              <label>lifeSpan</label>
              <p>{{ garment.lifeSpan }}</p>
            </div>
            <div
              v-if="
                garment.currentEnvironment && garment.currentEnvironment !== ''
              "
              class="detail-box"
            >
              <label>current Environment</label>
              <p>{{ garment.currentEnvironment }}</p>
            </div>
            <div
              v-if="garment.color && garment.color !== ''"
              class="detail-box"
            >
              <label>color</label>
              <input type="color" :value="garment.color" disabled />
            </div>
            <div
              v-if="garment.damageSustained && garment.damageSustained !== ''"
              class="detail-box"
            >
              <label>damage Sustained</label>
              <p>{{ garment.damageSustained }}</p>
            </div>
            <div
              v-if="garment.salePrice && garment.salePrice !== ''"
              class="detail-box"
            >
              <label>sale Price</label>
              <p>&euro;{{ garment.salePrice }}</p>
            </div>
            <div
              v-if="garment.shipper && garment.shipper !== ''"
              class="detail-box"
            >
              <label>shipper</label>
              <p>{{ garment.shipper }}</p>
            </div>
            <div
              v-if="garment.warrantyTime && garment.warrantyTime !== ''"
              class="detail-box"
            >
              <label>warranty Time</label>
              <p>{{ garment.warrantyTime }}</p>
            </div>
            <div
              v-if="garment.token && garment.token !== ''"
              class="detail-box"
            >
              <label>token</label>
              <p>{{ garment.token }}</p>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

    <!--Popup for updating the garment information -->
    <b-modal
      id="update-modal"
      title="Update garment information"
      ok-only
      ok-title="Update information"
      @ok="updateGarment"
    >
      <label>Sustained damage</label>
      <b-form-input
        v-model="form.damageSustained"
        type="text"
        placeholder="Enter your damages"
      ></b-form-input>
      <label>Lifespan (fill in upon recycle)</label>
      <b-form-input v-model="form.lifeSpan" type="date"></b-form-input>
      <label>Current environment</label>
      <b-form-input
        v-model="form.currentEnvironment"
        type="text"
        placeholder="Snow, Humid, etc."
      ></b-form-input>
      <label>Returned</label>
      <b-form-checkbox v-model="form.returned"></b-form-checkbox>
      <label>Sale date (fill in upon sale)</label>
      <b-form-input v-model="form.dateOfSale" type="date"></b-form-input>
      <label>Sale price</label>
      <b-input-group>
        <b-form-input
          v-model="form.salePrice"
          type="number"
          step=".01"
          placeholder="Enter sale price"
        ></b-form-input>
      </b-input-group>
      <label>Shipping date (fill in upon shipping)</label>
      <b-form-input v-model="form.shippingDate" type="date"></b-form-input>
      <label>Shipper</label>
      <b-form-input
        v-model="form.shipper"
        type="text"
        placeholder="Fill in shipper"
      ></b-form-input>
      <label>Warranty time</label>
      <b-form-input
        v-model="form.warrantyTime"
        type="text"
        placeholder="Fill in warranty"
      ></b-form-input>
    </b-modal>
  </b-container>
</template>

<script>
import { ipfsStore } from "@/store/ipfsStore";
import axios from "axios";
import { web3Store } from "@/store/web3";

export default {
  data: function () {
    return {
      currentToken: this.$route.params.id,
      form: {
        damageSustained: null,
        currentEnvironment: null,
        lifeSpan: null,
        returned: null,
        salePrice: null,
        shippingDate: null,
        shipper: null,
        dateOfSale: null,
        warrantyTime: null,
      },
    };
  },
  computed: {
    garment: function () {
      return ipfsStore.state.garments.find(
        (garment) => garment.token === this.$route.params.id
      );
    },
  },
  methods: {
    updateGarment: async function () {
      const token = this.garment.token;
      const body = new URLSearchParams();
      let r = this.$router;

      console.log(this.garment);

      // Gather current information on garment
      for (const attr in this.garment) {
        if (this.garment.hasOwnProperty(attr)) {
          body.append(attr, this.garment[attr]);
        }
      }

      // Loop through filled in form
      for (const attr in this.form) {
        if (this.form.hasOwnProperty(attr) && this.form[attr] != null) {
          body.append(attr, this.form[attr]);
        }
      }

      console.log(body);

      await axios({
        method: "post",
        url: "http://127.0.0.1:5000/api/uploadGarment",
        data: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(function (res) {
        const ipfsURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
        web3Store.dispatch("updateToken", { ipfsURI, token }).then(() => {
          r.push({ name: "GarmentsOverview" });
        });
      });
    },
  },
};
</script>>

<style scoped lang="scss">
.garment-title {
  margin: 40px 0 30px;
  text-align: center;
  text-transform: capitalize;
  font-family: "Karla";
  font-size: 2rem;
  font-weight: bold;
}

.custom-row {
  gap: 25px;
  margin-bottom: 25px;
}

.garment-ico {
  width: 100%;
}

.clean-btn {
  width: 100%;
  margin: 15px 0 0;
}

.col-8 {
  overflow: hidden;
}

.custom-container {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 10px;

  @media only screen and (min-width: 576px) {
    gap: 15px;
  }
}

.modal-body {
  input,
  .custom-checkbox,
  .input-group {
    margin: 0 0 1rem;
  }

  label {
    display: inline-block;
    margin-bottom: 0.25rem;
    color: #29bb89;
    font-size: 0.9rem;
  }
}
</style>