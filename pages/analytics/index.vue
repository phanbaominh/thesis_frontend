<template>
  <v-card>
    <v-row>
      <v-col> <AnalyticsFilter /> </v-col>
      <v-col>
        <AnalyticsDatePicker />
      </v-col>
    </v-row>
    <v-tabs v-model="tab" class="mb-2">
      <v-tab v-for="item in tabItems" :key="item.text">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item> <AnalyticsVideo /></v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  layout: 'analytics',
  middleware: 'checkUserIsAdManager',
  data() {
    return {
      tab: null,
      tabItems: [
        { text: 'Videos', to: 'videos' },
        { text: 'Playlists', to: 'playlists' },
      ],
    };
  },
  created() {
    const { timeStart: qTimeStart, timeEnd: qTimeEnd } = this.$route.query;
    const timeStart = dayjs(
      Number(qTimeStart || 0) || dayjs().subtract(6, 'day')
    );
    const timeEnd = dayjs(Number(qTimeEnd || 0) || dayjs());
    this.$accessor.SET_ANALYTICS_PERIOD({
      start: timeStart,
      end: timeEnd,
    });
  },
});
</script>
