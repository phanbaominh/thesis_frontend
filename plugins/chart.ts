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

// eslint-disable-next-line vue/one-component-per-file
Vue.component('LineChart', {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    (this as any).renderChart((this as any).chartData, this.options);
  },
});
