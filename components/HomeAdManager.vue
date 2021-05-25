<template>
  <v-card>
    <v-card-title>
      Overview in this period

      <AnalyticsDatePicker class="ml-2" />
    </v-card-title>
    <v-card-text>
      <BaseFetcher :fetch-state="$fetchState">
        <template #pending> Fetching data...</template>

        <v-card class="pa-4 mb-4" flat>
          <v-tabs v-model="tab" grow class="mb-2" icons-and-text>
            <v-tab v-for="item in tabItems" :key="item.text">
              <span class="text-h6">{{
                item.text === 'Cost'
                  ? $utils.moneyFormat(item.total)
                  : item.total
              }}</span>
              {{ item.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <LineChart
                v-if="!$fetchState.pending && !$fetchState.error"
                class="custom-chart"
                :chart-data="costChartData"
                :options="options"
              />
            </v-tab-item>
            <v-tab-item>
              <LineChart
                v-if="!$fetchState.pending && !$fetchState.error"
                class="custom-chart"
                :chart-data="viewsChartData"
                :options="options"
              />
            </v-tab-item>
            <v-tab-item>
              <LineChart
                v-if="!$fetchState.pending && !$fetchState.error"
                class="custom-chart"
                :chart-data="runTimeChartData"
                :options="options"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <v-card-title>Top ads in this period</v-card-title>
        <v-data-table
          :headers="headers"
          hide-default-header
          :items="topAdsTableData"
          item-key="name"
          class="elevation-1"
        >
          <template #header>
            <thead>
              <tr>
                <th v-for="hd in headers" :key="hd.text" class="text-h6">
                  {{ hd.text }}
                </th>
              </tr>
            </thead>
          </template>
          <template #item.name="{ item }">
            <nuxt-link :to="`/ads/${item.id}`">{{ item.name }}</nuxt-link>
          </template>
          <template #item.cost="{ item }">
            {{ $utils.moneyFormat(item.cost) }}
          </template>
        </v-data-table>
      </BaseFetcher>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import dayjs from 'dayjs';
import { AnalyticsQueryObject } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      costChartData: {} as Chart.ChartData,
      viewsChartData: {} as Chart.ChartData,
      runTimeChartData: {} as Chart.ChartData,
      topAdsTableData: [] as any,
      headers: [
        { text: 'Ad', value: 'name' },
        { text: 'Cost', value: 'cost' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
      ],
      tab: null,
      tabItems: {
        cost: { text: 'Cost', total: 0 },
        views: { text: 'Views', total: 0 },
        runTime: { text: 'Run time', total: 0 },
      },
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
          display: false,
        },
      } as Chart.ChartOptions,
      labels: [] as string[],
    };
  },
  async fetch() {
    const rawData = (
      await this.$axios.$get(this.$apiUrl.analyticsOverview, {
        params: this.query,
      })
    ).data as {
      views: number[];
      runTime: number[];
      cost: number[];
      totalViews: number;
      totalRunTime: number;
      totalCost: number;
      topAds: {
        id: string;
        name: string;
        views: number;
        runTime: number;
      }[];
    };
    const freq = 1;
    const timeStart = this.$accessor.analytics.timeStart;
    const timeEnd = this.$accessor.analytics.timeEnd;
    const diffday = timeEnd.diff(timeStart, 'day');
    this.setLabels(freq, timeStart, diffday);
    this.costChartData = this.getChartData('Cost', rawData.cost);
    this.viewsChartData = this.getChartData('Views', rawData.views);
    this.runTimeChartData = this.getChartData('Run time', rawData.runTime);

    this.topAdsTableData = rawData.topAds.sort((ad1, ad2) => {
      return -(ad1.views - ad2.views);
    });
    this.tabItems.views.total = rawData.totalViews;
    this.tabItems.runTime.total = rawData.totalRunTime;
    this.tabItems.cost.total = rawData.totalCost;
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
    const { timeStart: qTimeStart, timeEnd: qTimeEnd } = this.$route.query;
    const timeStart = dayjs(
      Number(qTimeStart || 0) * 1000 || dayjs().subtract(27, 'day')
    );
    const timeEnd = dayjs(Number(qTimeEnd || 0) * 1000 || dayjs());
    this.$accessor.SET_ANALYTICS_PERIOD({
      start: timeStart,
      end: timeEnd,
    });
  },
  methods: {
    getChartData(label: string, data: number[]) {
      return {
        labels: this.labels,
        datasets: [
          {
            label,
            data,
            fill: false,
            borderColor: '#0080ff',
          },
        ],
      };
    },
    setLabels(step: number, timeStart: dayjs.Dayjs, diffday: number) {
      const labels = [];

      for (let i = 0; i <= diffday; i += step) {
        labels.push(timeStart.add(i, 'day').format('DD/MM/YYYY'));
      }
      this.labels = labels;
    },
  },
});
</script>
