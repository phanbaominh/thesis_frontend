<template>
  <v-card class="pa-2">
    <v-card-title>
      Logs in selected period <v-spacer></v-spacer>
      <AnalyticsDatePicker class="" />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="logs"
      item-key="_id"
      class="elevation-3"
      :loading="loading"
    >
      <!-- <template #header>
        <thead>
          <tr>
            <th v-for="hd in headers" :key="hd.text" class="text-h6">
              {{ hd.text }}
            </th>
          </tr>
        </thead>
      </template> -->
      <template #item.ad="{ item: { ad } }">
        <AdLink :ad="ad"></AdLink>
      </template>
      <template #item.genders="{ item: { genders } }">
        {{ `Male: ${genders[0]}, Female: ${genders[1]}` }}
      </template>
      <template #item.cost="{ item: { cost } }">
        {{ $utils.moneyFormat(cost) }}
      </template>
      <template #item.costPerView="{ item: { cost, views } }">
        {{ $utils.moneyFormat(cost / (views || 1)) }}
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
      <template v-if="$vuetify.breakpoint.smAndUp" #body.append>
        <tr>
          <td colspan="2">
            <v-text-field
              v-model="search"
              label="Search name"
              class="mx-4"
            ></v-text-field>
          </td>
          <td v-for="i in 4" :key="i"></td>
          <td colspan="4">
            <div class="date-search">
              <span class="text-caption date-caption-from">
                {{ from.time }} {{ from.date }}
                <v-icon
                  v-if="isVisible(from)"
                  x-small
                  @click="from = { time: '', date: '' }"
                >
                  mdi-close
                </v-icon>
              </span>
              <div>
                <span>From:</span>
                <LogTimePicker @pick="from.time = $event" />
                <LogDatePicker @pick="from.date = $event" />
              </div>
              <span class="text-caption date-caption-to">
                {{ to.time }} {{ to.date }}
                <v-icon
                  v-if="isVisible(to)"
                  x-small
                  @click="to = { time: '', date: '' }"
                >
                  mdi-close
                </v-icon>
              </span>
              <div>
                <span>To: </span>
                <LogTimePicker @pick="to.time = $event" />
                <LogDatePicker @pick="to.date = $event" />
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { Ad, AdLog, AnalyticsQueryObject } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      search: '',
      from: { date: '', time: '' },
      to: { date: '', time: '' },
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
    headers() {
      return [
        {
          text: 'Ad',
          value: 'ad',
          filter: (value: Ad) => {
            if (!this.search) return true;
            const regex = new RegExp(this.search);
            return regex.test(value.name);
          },
        },
        { text: 'Cost     ', value: 'cost' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
        { text: 'First frame', value: 'image' },
        { text: 'Cost per view', value: 'costPerView' },
        {
          text: 'Time start',
          value: 'timeStart',
          filter: (value: number) => {
            const fromDateStr = this.from.date + this.from.time;
            const toDateStr = this.to.date + this.to.time;
            const fromDate = dayjs(fromDateStr);
            const toDate = dayjs(toDateStr);
            const dateStart = dayjs.unix(value);
            if (!fromDate.isValid() && !toDate.isValid()) return true;
            return (
              (!fromDate.isValid() ||
                dateStart.isAfter(fromDate) ||
                dateStart.isSame(fromDate)) &&
              (!toDate.isValid() ||
                dateStart.isBefore(toDate) ||
                dateStart.isSame(toDate))
            );
          },
        },
        { text: 'Device', value: 'device' },
        { text: 'Zone', value: 'zone' },
        { text: 'Building manager', value: 'bdManager' },
        { text: 'Male/Female', value: 'genders' },
        { text: 'Age ranges', value: 'ages' },
      ];
    },
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
    isVisible(time: { time: string; date: string }) {
      return !!(time.time || time.date);
    },
  },
});
</script>
<style scoped>
.date-search {
  position: relative;
}
.date-caption-from {
  position: absolute;
  top: -10px;
}
.date-caption-to {
  position: absolute;
  top: 15px;
}
</style>
