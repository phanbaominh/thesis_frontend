<template>
  <AdDetailed :ad="ad">
    <template #top-right>
      <v-btn
        :disabled="!isDeployed"
        color="primary"
        nuxt
        :to="`/analytics/ad?adOffer=${ad._id}`"
      >
        <v-icon>mdi-chart-line</v-icon>Analytics
      </v-btn>
    </template>
  </AdDetailed>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd } from '~/types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    await Promise.resolve();
    const ad = (await $axios.$get($apiUrl.adDetailed(route.params.id))).adOffer;
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as DetailedAd,
    };
  },
  computed: {
    isDeployed(): boolean {
      return this.ad.status === AdStatus.Deployed;
    },
  },
});
</script>
