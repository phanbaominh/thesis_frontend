<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching ads... </template>
    <DataIterator :type="'Ads'" :init-items="ads" :compact="false">
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
              :init-ad="ad"
              :to="`buildingads/${ad._id}`"
              @delete="onDelete(ad)"
            />
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      ads: [
        // {
        //   _id: 'testad',
        //   name: 'test',
        //   adsetId: '123',
        //   mediaId: '123',
        //   budget: 500,
        //   buildingManagerId: '234',
        //   status: AdStatus.Pending,
        // },
      ] as Ad[],
      newDialog: false,
    };
  },
  async fetch() {
    // await Promise.resolve();
    this.ads = (await this.$axios.$get(this.$apiUrl.adsBdManager)).adOffers;
  },
  methods: {
    onDelete(ad: Ad) {
      this.ads = this.ads.filter((a) => a._id !== ad._id);
    },
  },
});
</script>
