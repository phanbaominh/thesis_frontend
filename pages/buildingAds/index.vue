<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching ads... </template>
    <!-- <DataIterator :type="'Ads'" :init-items="ads" :compact="false">
      <template #main="{ items: displayedAds }">
        <v-row class="mt-2">
          <v-col
            v-for="ad in displayedAds"
            :key="ad._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AdCard
              is-bd
              :init-ad="ad"
              :to="`buildingads/${ad._id}`"
              @delete="onDelete(ad)"
            />
          </v-col>
        </v-row>
      </template>
    </DataIterator> -->
    <BuildingAdTable :init-ad-table-data="adTableData"> </BuildingAdTable>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      ads: [] as Ad[],
      newDialog: false,
      adTableData: [],
    };
  },
  async fetch() {
    // await Promise.resolve();
    // this.ads = (await this.$axios.$get(this.$apiUrl.adsBdManager)).adOffers;
    this.adTableData = (
      await this.$axios.$get(this.$apiUrl.adsTableFormatByBd)
    ).adOffers;
  },
  methods: {
    onDelete(ad: Ad) {
      this.ads = this.ads.filter((a) => a._id !== ad._id);
    },
  },
});
</script>
