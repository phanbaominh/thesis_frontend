<template>
  <v-card>
    <v-row>
      <v-col cols="2"> <AnalyticsZoneSelect /> </v-col>

      <v-spacer></v-spacer>
      <v-col cols="2">
        <AnalyticsDatePicker />
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-tabs v-model="tab" class="mb-2">
      <v-tab v-for="item in tabItems" :key="item.text" nuxt :to="item.to">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <nuxt-child />
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  key: (to) => to.fullPath,
  middleware: [
    'checkUserIsBuildingManager',
    ({ $permission, $auth, redirect }) => {
      if ($auth.user) {
        if (!$permission.canGeneralReadAnalytics()) return redirect('/');
      }
    },
  ],
  data() {
    return {
      tab: null,
      tabItems: [
        { text: 'Zones', to: 'zone' },
        { text: 'Ad Managers', to: 'adManager' },
        { text: 'Age', to: 'age' },
        { text: 'Gender', to: 'gender' },
      ],
      key: 'cool',
    };
  },
  head: {
    meta: [{ hid: 'viewport', name: 'viewport', content: 'width=1080' }],
  },
  mounted() {
    this.key += this.key;
    this.$nextTick(() => this.$forceUpdate());
  },
  created() {
    const {
      timeStart: qTimeStart,
      timeEnd: qTimeEnd,
      item = 'all',
    } = this.$route.query;
    const timeStart = dayjs(
      Number(qTimeStart || 0) * 1000 || dayjs().subtract(6, 'day')
    );
    const timeEnd = dayjs(Number(qTimeEnd || 0) * 1000 || dayjs());
    this.$accessor.SET_ANALYTICS_PERIOD({
      start: timeStart,
      end: timeEnd,
    });
    this.$accessor.SET_ANALYTICS_ITEM(item);
  },
});
</script>
