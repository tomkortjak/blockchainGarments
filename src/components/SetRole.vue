<template>
  <b-container fluid="sm">
    <b-form @submit="onSubmit">
      <b-row align-h="center">
        <b-col cols="12">
          <b-form-group
            class="text-center"
            id="address-group"
            label="Address:"
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
          <b-form-group id="input-group-3" label="Role:" label-for="input-3">
            <b-form-select
              id="role"
              v-model="form.role"
              :options="rolesDropdown"
              required
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row align-h="center">
        <b-col class="text-center">
          <b-button type="submit" variant="outline-success" size="lg" block
            >Set Role</b-button
          >
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import axios from "axios";
import { web3Store, roles } from "@/store/web3";

export default {
  data() {
    return {
      dRoles: roles,
      rolesDropdown: [
        { text: "User", value: roles.USER },
        { text: "Company", value: roles.COMPANY },
        { text: "Recycler", value: roles.RECYCLER },
      ],

      form: {
        address: "",
        role: "",
      },
    };
  },

  methods: {
    updateRole(role) {
      this.form.role = role;
    },

    onSubmit(event) {
      event.preventDefault();

      let address = this.form.address;
      let role = this.form.role;

      web3Store.dispatch("updateRole", { address, role }).then(() => {
        this.form.address = null;
        this.form.role = null;
        console.log("success");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container-sm {
  max-width: 768px;
}

#address-group,
#input-group-3 {
  color: #29bb89;
  text-transform: capitalize;
}
</style>
