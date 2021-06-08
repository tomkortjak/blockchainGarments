<template>
  <div class="account-history">
    <h1 class="pagetitle">Account History</h1>
    <AccountHistory />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AccountHistory from "@/components/AccountHistory.vue"; // @ is an alias to /src

@Component({
  components: {
    AccountHistory,
  },
})
export default class AccHistory extends Vue {}
</script>

<style>
.pagetitle {
  font-family: "Karla", sans-serif;
  margin: 50px 15px;
  letter-spacing: 2px;
  color: #289672;
}
</style>
