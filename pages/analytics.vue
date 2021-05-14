<template>
  <v-card>
    <v-row>
      <v-col cols="3"> <AnalyticsFilter /> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <AnalyticsDatePicker />
      </v-col>
    </v-row>
    <v-tabs v-model="tab" class="mb-2">
      <v-tab v-for="item in tabItems" :key="item.text" nuxt :to="item.to">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <nuxt-child />
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  middleware: 'checkUserIsAdManager',
  data() {
    return {
      tab: null,
      tabItems: [
        { text: 'Ads', to: 'ad' },
        { text: 'Building Managers', to: 'bdManager' },
        { text: 'Age', to: 'age' },
        { text: 'Gender', to: 'gender' },
      ],
    };
  },
  created() {
    const { timeStart: qTimeStart, timeEnd: qTimeEnd } = this.$route.query;
    const timeStart = dayjs(
      Number(qTimeStart || 0) * 1000 || dayjs().subtract(6, 'day')
    );
    const timeEnd = dayjs(Number(qTimeEnd || 0) * 1000 || dayjs());
    this.$accessor.SET_ANALYTICS_PERIOD({
      start: timeStart,
      end: timeEnd,
    });
  },
});
</script>
