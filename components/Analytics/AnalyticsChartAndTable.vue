<template>
  <v-card>
    <v-row>
      <v-col cols="2">
        <AnalyticsValueSelect />
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
        },
      } as Chart.ChartOptions,
      updateChart: false,
      tableData: [] as any[],
      colors: [] as string[],
      labels: [] as string[],
    };
  },
  async fetch() {
    await Promise.resolve();
    // const result = (await this.$axios.$get(this.url)).data;
    const result = [this.getFakeData(), this.getFakeData()] as {
      data: any[];
      name: string;
    }[];
    this.tableData = result;
    const freq = this.$accessor.analytics.frequency;
    const timeStart = this.$accessor.analytics.timeStart;
    const timeEnd = this.$accessor.analytics.timeEnd;
    const diffday = timeEnd.diff(timeStart, 'day');

    this.setLabelsColors(freq, timeStart, diffday);
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
  },
  computed: {
    query(): string {
      return this.$accessor.analyticsQuery;
    },
  },
  watch: {
    query() {
      this.$fetch();
    },
  },
  methods: {
    random_rgba() {
      const o = Math.round;
      const r = Math.random;
      const s = 255;
      return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
    },
    setLabelsColors(step: number, timeStart: dayjs.Dayjs, diffday: number) {
      const labels = [];

      const colors = [];
      for (let i = 0; i <= diffday; i += step) {
        labels.push(timeStart.add(i, 'day').format('YYYY/MM/DD'));
        colors.push(this.random_rgba());
      }
      this.colors = colors;
      this.labels = labels;
    },
    getFakeData() {
      return {
        name: `dataset${Math.round(Math.random() * 100)}`,
        views: Math.random() * 1000,
        runTime: Math.random() * 50,
        data: [...Array(365).keys()].map(
          (val) => val + Math.round(Math.random() * 100)
        ),
      };
    },
    onSelect(datasets: any[]) {
      console.log(datasets);
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
