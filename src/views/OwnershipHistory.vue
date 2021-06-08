<template>
  <div class="account-history">
    <h1 class="pagetitle">Ownership History</h1>
    <ownership-history-comp />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OwnershipHistoryComp from "@/components/OwnershipHistory.vue"; 

@Component({
  components: {
    OwnershipHistoryComp,
  },
})
export default class OwnershipHistory extends Vue {}
</script>
