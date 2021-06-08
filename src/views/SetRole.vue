<template>
  <div class="create-garment">
    <h1 class="pagetitle">Set Role</h1>
    <set-role />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SetRole from "@/components/SetRole.vue";

@Component({
  components: {
    SetRole,
  },
})
export default class SetRolePage extends Vue {}
</script>
