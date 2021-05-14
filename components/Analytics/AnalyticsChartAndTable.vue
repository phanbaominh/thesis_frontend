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
          { text: 'Views by video', value: AnalyticsValue.Views },
          { text: 'Run times by video', value: AnalyticsValue.RunTime },
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
    this.tableData = result;
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
      const colors = [];
      for (let i = 0; i < noDataset; i++) {
        colors.push(this.random_rgba());
      }
      this.colors = colors;
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
