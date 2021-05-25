<template>
  <v-card class="pa-2">
    <v-card-title>
      Logs in selected period <v-spacer></v-spacer>
      <AnalyticsDatePicker class="" />
    </v-card-title>
    <v-data-table
      :headers="headers"
      hide-default-header
      :items="logs"
      item-key="name"
      class="elevation-1"
      :loading="loading"
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
      <template #item.ad="{ item: { ad } }">
        <nuxt-link :to="`/ads/${ad._id}`">{{ ad.name }}</nuxt-link>
      </template>
      <template #item.genders="{ item: { genders } }">
        {{ `Male: ${genders[0]}, Female: ${genders[1]}` }}
      </template>
      <template #item.cost="{ item: { cost } }">
        {{ $utils.moneyFormat(cost) }}
      </template>
      <template #item.costPerView="{ item: { cost, views } }">
        {{ $utils.moneyFormat(cost / views) }}
      </template>
      <template #item.ages="{ item }">
        {{ item.ages.toString() }}
      </template>
      <template #item.timeStart="{ item }">
        {{ $utils.timeFormat(item.timeStart) }}
      </template>
      <template #item.bdManager="{ item: { bdManager } }">
        {{ bdManager.username }}
      </template>
      <template #item.zone="{ item: { zone } }">
        {{ zone.name }}
      </template>
      <template #item.device="{ item: { device } }">
        {{ device.name }}
      </template>
      <template #item.image="{ item: { image } }">
        <LogImagePreview v-if="image" :link="image" />
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { AdLog, AnalyticsQueryObject } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      headers: [
        { text: 'Ad', value: 'ad' },
        { text: 'Cost     ', value: 'cost' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
        { text: 'First frame', value: 'image' },
        { text: 'Cost per view', value: 'costPerView' },
        { text: 'Time start', value: 'timeStart' },
        { text: 'Device', value: 'device' },
        { text: 'Zone', value: 'zone' },
        { text: 'Building manager', value: 'bdManager' },
        { text: 'Male/Female', value: 'genders' },
        { text: 'Age ranges', value: 'ages' },
      ],
      loading: true,
      logs: [] as AdLog[],
    };
  },
  async fetch() {
    this.logs = (
      await this.$axios.$get(this.$apiUrl.logs, { params: this.query })
    ).logs as AdLog[];
    this.loading = false;
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
});
</script>
