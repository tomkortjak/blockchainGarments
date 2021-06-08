<template>
  <div class="garment-overview">
    <h1 class="pagetitle">In Progress</h1>
    <Progress />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Progress from "@/components/InProgress.vue"; // @ is an alias to /src

@Component({
  components: {
    Progress,
  },
})
export default class Home extends Vue {}
</script>