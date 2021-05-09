import Vue from 'vue';
import { Doughnut, Line } from 'vue-chartjs';

Vue.component('DonutChart', {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    (this as any).renderChart(this.data, this.options);
  },
});

Vue.component('LineChart', {
  extends: Line,
  props: ['data', 'options'],
  mounted() {
    (this as any).renderChart(this.data, this.options);
  },
});
