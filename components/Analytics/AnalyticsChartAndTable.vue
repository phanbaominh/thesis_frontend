<template>
  <v-card class="pa-2">
    <v-row>
      <v-col cols="2">
        <AnalyticsValueSelect :items="valueSelectItems" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <AnalyticsFrequencySelect />
      </v-col>
    </v-row>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending> Fetching data...</template>
      <LineChart
        v-if="!$fetchState.pending && !$fetchState.error"
        class="custom-chart"
        :chart-data="chartData"
        :options="options"
      />
      <AnalyticsDataTable
        :headers="headers"
        :data="tableData"
        @select="onSelect"
      />
    </BaseFetcher>
  </v-card>
</template>
<script lang="ts">
import Chart from 'chart.js';
import dayjs from 'dayjs';
import Vue from 'vue';
import {
  AnalyticsData,
  AnalyticsFrequency,
  AnalyticsQueryObject,
  AnalyticsValue,
  Select,
} from '~/types/types';
const LineChartColors = Object.values({
  black: '#000000',
  blue: '#0000ff',
  brown: '#a52a2a',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgrey: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkviolet: '#9400d3',
  fuchsia: '#ff00ff',
  gold: '#ffd700',
  green: '#008000',
  indigo: '#4b0082',
  khaki: '#f0e68c',
  lightblue: '#add8e6',
  lightcyan: '#e0ffff',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  magenta: '#ff00ff',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  orange: '#ffa500',
  pink: '#ffc0cb',
  purple: '#800080',
  violet: '#800080',
  red: '#ff0000',
  silver: '#c0c0c0',
  white: '#ffffff',
  yellow: '#ffff00',
});
export default Vue.extend({
  props: {
    headers: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    valueSelectItems: {
      default: () =>
        [
          { text: 'Views by ad', value: AnalyticsValue.Views },
          { text: 'Run times by ad', value: AnalyticsValue.RunTime },
          { text: 'Cost by ad', value: AnalyticsValue.Cost },
        ] as Select[],
      type: Array,
    },
  },
  data() {
    return {
      chartData: {} as Chart.ChartData,
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 2,
          },
        },
        tooltips: {
          mode: 'x',
          intersect: false,
        },
        legend: {
          position: 'bottom',
          onClick: () => {},
        },
      } as Chart.ChartOptions,
      updateChart: false,
      tableData: [] as any[],
      colors: [] as string[],
      labels: [] as string[],
    };
  },
  async fetch() {
    const result = (
      await this.$axios.$get(this.url, {
        params: this.query,
      })
    ).data as AnalyticsData[];
    let dataId = 0;
    this.tableData = result.map((result) => ({ id: dataId++, ...result }));
    const freq = this.$accessor.analytics.frequency;
    const timeStart = this.$accessor.analytics.timeStart;
    const timeEnd = this.$accessor.analytics.timeEnd;
    const diffday = timeEnd.diff(timeStart, 'day');

    this.setLabels(freq, timeStart, diffday);
    this.setColors(result.length);
    const datasets = result.map((d, i) => ({
      label: d.name,
      data: d.data,
      fill: false,
      borderColor: this.colors[i],
    }));
    this.chartData = {
      labels: this.labels,
      datasets,
    };
    this.updateChart = !this.updateChart;

    this.$router.replace({ query: this.query }).catch((_err) => {});
  },
  computed: {
    query(): AnalyticsQueryObject {
      return this.$accessor.analyticsQuery;
    },
  },
  watch: {
    query() {
      this.$fetch();
    },
  },
  created() {
    const {
      value = AnalyticsValue.Views,
      frequency: qFreq,
    } = this.$route.query;
    const frequency = qFreq ? Number(qFreq) : AnalyticsFrequency.Daily;
    this.$accessor.SET_ANALYTICS_VALUE(value);
    this.$accessor.SET_ANALYTICS_FREQUENCY(frequency);
  },
  methods: {
    random_rgba() {
      // return faker.helpers.randomize(LineChartColors);
      const o = Math.round;
      const r = Math.random;
      const s = 255;
      return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
    },
    setLabels(step: number, timeStart: dayjs.Dayjs, diffday: number) {
      const labels = [];

      for (let i = 0; i <= diffday; i += step) {
        labels.push(timeStart.add(i, 'day').format('YYYY/MM/DD'));
      }
      this.labels = labels;
    },
    setColors(noDataset: number) {
      if (noDataset === this.colors.length) return;

      if (noDataset <= LineChartColors.length)
        this.colors = LineChartColors.slice(0, noDataset);
      else {
        const colors = [] as string[];
        for (let i = 0; i < noDataset; i++) {
          let randomColor = this.random_rgba();
          while (colors.includes(randomColor)) {
            randomColor = this.random_rgba();
          }
          colors.push(randomColor);
        }
        this.colors = colors;
      }
    },
    onSelect(datasets: any[]) {
      this.chartData = {
        labels: this.labels,
        datasets: datasets.map((d, i) => ({
          label: d.name,
          data: d.data,
          fill: false,
          borderColor: this.colors[i],
        })),
      };
    },
  },
});
</script>
<style scoped>
.custom-chart {
  height: 500px;
}
</style>
