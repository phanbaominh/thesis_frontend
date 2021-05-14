<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>Loading Ad Offer</template>
    <v-select v-model="selectedItem" outlined dense :items="items" label="Ad">
    </v-select>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad, Select } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      items: [] as Select[],
      selectedItem: this.$accessor.analytics.ad,
    };
  },
  async fetch() {
    const ads = (await this.$axios.$get(this.$apiUrl.adsAdManager))
      .adOffers as Ad[];
    this.items.push({ text: 'All', value: 'all' });
    ads.forEach((ad) => this.items.push({ text: ad.name, value: ad._id }));
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_AD(this.selectedItem);
    },
  },
});
</script>
