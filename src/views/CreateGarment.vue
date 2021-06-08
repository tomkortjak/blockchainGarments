<template>
  <div class="create-garment">
    <h1 class="pagetitle">Create Garment</h1>
    <create-garment />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import createGarment from "@/components/createGarment.vue";

@Component({
  components: {
    createGarment,
  },
})
export default class CreateGarment extends Vue {}
</script>
