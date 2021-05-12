<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching ads... </template>
    <DataIterator :type="'Ads'" :init-items="ads" :compact="false">
      <AdForm title="Create an ad:" :dialog="newDialog" @submit="onNew" />
      <template #main="{ items: displayedAdsets }">
        <v-row class="mt-2">
          <v-col
            v-for="ad in displayedAdsets"
            :key="ad._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AdCard :init-ad="ad" :to="`ads/${ad._id}`" @delete="onDelete" />
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
        //   _id: '123',
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
    this.ads = (await this.$axios.$get(this.$apiUrl.adsAdManager)).adOffers;
  },
  methods: {
    async onNew(ad: Ad) {
      await this.$handleErrors(async () => {
        const newAd = (await this.$axios.$post(this.$apiUrl.ads, ad)).adOffer;
        this.newDialog = !this.newDialog;
        this.ads.push(newAd);
      });
    },
    onDelete(ad: Ad) {
      this.ads = this.ads.filter((a) => a._id !== ad._id);
    },
  },
});
</script>
