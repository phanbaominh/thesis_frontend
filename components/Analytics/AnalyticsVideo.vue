<template>
  <v-card>
    <v-row>
      <v-col>
        <AnalyticsValueSelect />
      </v-col>
      <v-col>
        <AnalyticsFrequencySelect />
      </v-col>
    </v-row>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending> Fetching data...</template>
      <LineChart
        v-if="!$fetchState.pending && !$fetchState.error"
        class="custom-chart"
        :data="chartData"
        :options="options"
      />
    </BaseFetcher>
  </v-card>
</template>
<script lang="ts">
import Chart from 'chart.js';
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      chartData: {} as Chart.ChartData,
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 2,
              },
            },
          ],
        },
      } as Chart.ChartOptions,
      updateChart: false,
    };
  },
  async fetch() {
    await Promise.resolve();
    this.chartData = {
      labels: [`Offline`, 'cool', 'cool', 'cool', 'cool'],
      datasets: [
        {
          label: 'Device status',
          data: [5, 10, 2, 4, 6],
          fill: false,
        },
      ],
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
});
</script>
