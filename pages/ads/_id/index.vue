<template>
  <AdDetailed :ad="ad">
    <template #top-right>
      <v-btn
        :fab="$vuetify.breakpoint.smAndDown"
        depressed
        small
        :disabled="!isAnalyzable"
        color="primary"
        nuxt
        :to="`/analytics/ad?adOffer=${ad._id}`"
      >
        <v-icon>mdi-chart-line</v-icon>
        <span v-if="!$vuetify.breakpoint.smAndDown">Analytics</span>
      </v-btn>
    </template>
  </AdDetailed>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd } from '~/types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const ad = (await $axios.$get($apiUrl.adDetailed(route.params.id))).adOffer;
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as DetailedAd,
    };
  },
  computed: {
    isAnalyzable(): boolean {
      return (
        this.ad.status === AdStatus.Deployed ||
        this.ad.status === AdStatus.Canceled
      );
    },
  },
});
</script>
