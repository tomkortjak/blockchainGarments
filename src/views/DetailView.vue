<template>
  <Detail />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Detail from "@/components/Detail.vue"; // @ is an alias to /src

@Component({
  components: {
    Detail,
  },
})
export default class DetailView extends Vue {}
</script>
