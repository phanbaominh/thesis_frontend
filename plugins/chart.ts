import Vue from 'vue';
import { Doughnut, Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
Vue.component('DonutChart', {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    (this as any).renderChart(this.data, this.options);
  },
});

Vue.component('LineChart', {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    (this as any).renderChart(this.chartData, this.options);
  },
});
