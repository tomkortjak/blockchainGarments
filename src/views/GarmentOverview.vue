<template>
  <div class="garment-overview">
    <h1 class="pagetitle">Garments</h1>
    <Garments />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Garments from "@/components/Garments.vue"; // @ is an alias to /src

@Component({
  components: {
    Garments,
  },
})
export default class GarmentsOverview extends Vue {}
</script>
