<template>
  <v-card>
    <v-card-title
      >Overview <AdCardStatus :status="ad.status" class="ml-2" />
      <v-spacer></v-spacer>
      <slot name="top-right"></slot>
    </v-card-title>
    <v-card-text class="text-body-1">
      <v-list-item v-for="(value, key) in overviewDesc" :key="key">
        <span class="font-weight-bold mr-2">{{ key + ':' }}</span>
        {{ ` ${value || 'None'}` }}
      </v-list-item>
      <v-list-item>
        <span class="font-weight-bold mr-2"> Content: </span>
        {{ ad.contentId.mediaArray.length }} videos
        <BuildingAdContentPreview :ad="ad" />
      </v-list-item>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title>Adset</v-card-title>
    <v-card-text>
      <AdsetDesc :ad-set="ad.adSetId" />
    </v-card-text>
    <v-divider></v-divider>

    <slot name="append" :ad="ad"></slot>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd } from '~/types/types';

export default Vue.extend({
  props: {
    ad: {
      type: Object,
      required: true,
    } as Vue.PropOptions<DetailedAd>,
  },
  computed: {
    overviewDesc(): { [key: string]: string } {
      return {
        Name: `${this.ad.name}`,
        Budget: `${this.ad.budget}`,
        AdManager: `${this.ad.adManagerId.email}`,
        BuildingManager: `${this.ad.bdManagerId.email}`,
      };
    },

    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
  },
});
</script>
