import Vue from 'vue';
import { Doughnut } from 'vue-chartjs';

Vue.component('DonutChart', {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    (this as any).renderChart(this.data, this.options);
  },
});
