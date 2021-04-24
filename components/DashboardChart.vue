<template>
  <DonutChart
    v-if="loaded"
    class="custom-chart"
    :data="chartData"
    :options="options"
  />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    loaded: {
      type: Boolean,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({ maintainAspectRatio: false }),
    },
  },
});
</script>
<style scoped>
.custom-chart {
  height: 200px;
}
</style>
