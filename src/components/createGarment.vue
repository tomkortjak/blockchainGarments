<template>
  <b-container fluid="sm">
    <b-dropdown id="category-dropdown" text="Garment category">
      <b-dropdown-item v-on:click="updateCategory('Shirt')"
        >Shirt
      </b-dropdown-item>
      <b-dropdown-item v-on:click="updateCategory('Pants')"
        >Pants
      </b-dropdown-item>
      <b-dropdown-item v-on:click="updateCategory('Coat')"
        >Coat
      </b-dropdown-item>
    </b-dropdown>

    <b-form @submit="onSubmit" @reset="onReset" v-if="category">
      <div class="animate-height">
        <h4>{{ category }} form</h4>
        <b-row align-h="center">
          <b-col cols="4">
            <b-form-group class="text-center" label="Name:" label-for="name">
              <b-form-input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter garment name"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Factory:"
              label-for="factory"
            >
              <b-form-input
                id="factory"
                v-model="form.factory"
                type="text"
                placeholder="Enter factory"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Design date:"
              label-for="designDate"
            >
              <b-form-input
                id="designDate"
                v-model="form.designDate"
                type="date"
                placeholder="Enter designDate"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="4" v-if="category !== 'Pants'">
            <b-form-group class="text-center" label="Size:" label-for="size">
              <b-form-input
                id="size"
                v-model="form.size"
                type="text"
                placeholder="Enter garment size"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="2" v-if="category === 'Pants'">
            <b-form-group
              class="text-center"
              label="Length:"
              label-for="length"
            >
              <b-form-input
                id="length"
                v-model="form.length"
                type="number"
                placeholder="length"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="2" v-if="category === 'Pants'">
            <b-form-group class="text-center" label="Width:" label-for="width">
              <b-form-input
                id="width"
                v-model="form.width"
                type="text"
                placeholder="width"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group class="text-center" label="Color:" label-for="color">
              <b-form-input
                id="color"
                v-model="form.color"
                type="color"
                placeholder="Enter color"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Garment original price:"
              label-for="originalPrice"
            >
              <b-input-group prepend="€">
                <b-form-input
                  id="originalPrice"
                  v-model="form.originalPricing"
                  type="number"
                  step=".01"
                  placeholder="Enter original pricing:"
                  aria-describedby="basic-addon1"
                  aria-
                  required
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Amount fabricated:"
              label-for="amount"
            >
              <b-form-input
                id="amount"
                v-model="form.amount"
                type="number"
                placeholder="Enter amount"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Season:"
              label-for="season"
            >
              <b-form-input
                id="season"
                v-model="form.season"
                type="text"
                placeholder="Enter season"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              class="text-center"
              label="Coating:"
              label-for="coating"
            >
              <b-form-input
                id="coating"
                v-model="form.coating"
                type="text"
                placeholder="Enter coating"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <b-form-group
              class="text-center"
              label="Fibers:"
              label-for="fibers"
            >
              <b-form-input
                id="fibers"
                v-model="form.fibers"
                type="text"
                placeholder="Enter fibers"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group
              class="text-center"
              label="Textiles:"
              label-for="textiles"
            >
              <b-form-input
                id="textiles"
                v-model="form.textiles"
                type="text"
                placeholder="Enter textiles"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="12">
            <b-form-group
              class="text-center"
              label="Select image:"
              label-for="file"
            >
              <b-form-file id="file" v-model="form.file" required></b-form-file>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col class="text-center">
            <b-button type="submit" variant="outline-success" size="lg" block
              >Create
            </b-button>
            <small>Note: Creating a garment costs a starting recyclers fee of 0.0025ETH</small>
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import { web3Store } from "@/store/web3.ts";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        name: "",
        size: "",
        color: "#000000",
        type: "",
        originalPricing: "",
        season: "",
        fibers: "",
        coating: "",
        amount: null,
        textiles: "",
        factory: "",
        length: null,
        width: null,
        manufactureDate: new Date().toLocaleDateString("en-US"),
        designDate: null,
        file: null,
      },
      show: true,
      category: null,
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      let formData = new FormData();
      formData.append("image", this.form.file);

      // first upload image to IPFS to get image link
      const imageResponse = await axios.post(
        "http://127.0.0.1:5000/api/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const body = new URLSearchParams();
      for (const attr in this.form) {
        if (
          this.form.hasOwnProperty(attr) &&
          attr !== "size" &&
          this.form[attr] != null
        )
          body.append(attr, this.form[attr]);
      }

      console.log(body.toString());
      // Coverts the size for pants to one string
      if (this.category === "Pants") {
        const size = `${this.form.width} ${this.form.length}`;
        body.append("size", size);
      } else {
        body.append("size", this.form.size);
      }

      console.log("image URL set for garment : ", imageResponse.data.IpfsHash);
      body.append(
        "imageCID",
        "https://ipfs.io/ipfs/" + imageResponse.data.IpfsHash
      );
      console.log("image", body.toString());

      let r = this.$router;
      let form = this.form;

      // upload garment to IPFS
      await axios({
        method: "post",
        url: "http://127.0.0.1:5000/api/uploadGarment",
        data: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(function (res) {
        const ipfsURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
        const amount = form.amount;
        web3Store.dispatch("createToken", { ipfsURI, amount }).then(() => {
          r.push({ name: "GarmentsOverview" });
        });
      });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.name = "";
      this.form.size = "";
      this.form.color = "#000000";
      this.form.type = "";
      this.form.originalPricing = "";
      this.form.season = "";
      this.form.fibers = "";
      this.form.coating = "";
      this.form.amount = null;
      this.form.textiles = "";
      this.form.factory = "";
      this.form.manufactureDate = new Date().toLocaleDateString("en-US");
      this.form.designDate = null;
      this.form.file = null;
      this.form.length = null;
      this.form.width = null;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    updateCategory(category) {
      this.category = category;
      this.form.type = category;
    },
  },
};
</script>

<style lang="scss" scoped>
.container-sm {
  max-width: 768px;

  #category-dropdown :not(ul):hover {
    background: #29bb89;
    color: white;
  }

  form {
    margin: 35px 0 50px;

    h4 {
      font-size: 2rem;
      margin: 0 0 1.5rem;
    }
  }
}
</style>
