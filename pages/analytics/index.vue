<template>
  <v-card>
    <v-row>
      <v-col> <AnalyticsFilter /> </v-col>
      <v-col>
        <AnalyticsDatePicker />
      </v-col>
    </v-row>
    <v-tabs v-model="tab">
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
export default Vue.extend({
  layout: 'analytics',
  middleware: 'checkUserIsAdManager',
  auth: false,
  data() {
    return {
      tab: null,
      tabItems: [
        { text: 'Videos', to: 'videos' },
        { text: 'Playlists', to: 'playlists' },
      ],
    };
  },
});
</script>
