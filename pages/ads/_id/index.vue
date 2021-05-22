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
    <template #append>
      <v-card-actions v-if="isIdle">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onSend"> Send </v-btn>
      </v-card-actions>
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
        this.ad.status === AdStatus.Finished
      );
    },
    isIdle(): boolean {
      return this.ad.status === AdStatus.Idle;
    },
  },
  methods: {
    async onSend() {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusSend(this.ad._id));
        this.ad.status = AdStatus.Pending;
      });
    },
  },
});
</script>
