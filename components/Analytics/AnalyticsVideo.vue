<template>
  <v-card>
    <v-row>
      <v-col>
        <AnalyticsValueSelect />
      </v-col>
      <v-col>
        <AnalyticsByDateSelect />
      </v-col>
    </v-row>
    <BaseFetcher :fetch-state="$fetchState">
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
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      chartData: {
        labels: [`Offline`, `Online`, 'cool'],
        datasets: [
          {
            label: 'Device status',
            data: [5, 10, 2],
            fill: false,
            backgroundColor: ['rgb(220, 53, 69)', '#4CAF50'],
            hoverOffset: 4,
          },
        ],
      },
      options: {},
    };
  },
  async fetch() {
    await Promise.resolve();
  },
});
</script>
