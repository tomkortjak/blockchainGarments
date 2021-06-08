<template>
  <b-container class="garments-item" fluid="sm">
    <b-row class="info-row align-content-center" v-if="garment">
      <b-col cols="2" class="img-column">
        <img class="garment-ico" :src="garment.imageCID" />
      </b-col>
      <b-col cols sm="12" md="10" class="garment-info">
        <h5>{{ garment.name }}</h5>
        <span>Token: {{ garment.token }}</span>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-row align-h="center">
        <b-col cols="12">
          <b-form-group
            class="text-center"
            id="address-group"
            label="New owner Address:"
            label-for="address"
          >
            <b-form-input
              id="address"
              v-model="form.address"
              type="text"
              placeholder="Enter address"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="12">
          <b-form-group
            class="text-center"
            id="reason-group"
            label="Reason for transfer:"
            label-for="reason"
          >
            <b-form-input
              id="reason"
              v-model="form.reason"
              type="text"
              placeholder="Enter reason for transfer"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col class="text-center">
          <b-button type="submit" variant="outline-success" size="lg" block
            >Transfer</b-button
          >
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { web3Store } from "@/store/web3.ts";
import { ipfsStore } from "@/store/ipfsStore";

export default {
  data: function () {
    return {
      form: {
        address: "",
        reason: "",
      },
      show: true,
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
    onSubmit(event) {
      event.preventDefault();
      let receiver = this.form.address;
      let reason = this.form.reason;
      let garmentToken = this.garment.token;
      web3Store
        .dispatch("startTransfer", { garmentToken, receiver, reason })
        .then(() => {
          this.$router.push({ name: "Progress" });
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.address = "";
      this.form.reason = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>


<style scoped lang="scss">
.garments-item {
  text-align: left;
  max-width: 768px;

  #address-group,
  #price-group,
  #reason-group {
    color: #29bb89;
    text-transform: capitalize;
  }
}

.info-row {
  margin-bottom: 35px;
}

.garment-info {
  margin: 20px auto 0;
  text-align: center;

  @media only screen and (min-width: 768px) {
    text-align: left;
    margin: auto 0;
  }

  h5 {
    letter-spacing: 1px;

    @media only screen and (min-width: 768px) {
      font-size: 1.4em;
    }
  }
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
