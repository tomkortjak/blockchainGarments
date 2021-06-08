 @@ -0,0 +1,26 @@
<template>
  <div class="transaction-page">
    <h1 class="pagetitle">Transaction</h1>
    <transactionPage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import transactionPage from "@/components/TransactionForm.vue";

@Component({
  components: {
    transactionPage,
  },
})
export default class Transaction extends Vue {}
</script>
