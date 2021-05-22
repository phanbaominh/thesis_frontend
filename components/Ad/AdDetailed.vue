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
        <span class="font-weight-bold mr-2">Building Manager:</span>
        <v-card flat outlined rounded>
          <AdBdManagerListItem :bd-manager="ad.bdManagerId" />
        </v-card>
      </v-list-item>
      <v-list-item>
        <span class="font-weight-bold mr-2"> Content: </span>
        {{ ad.contentId.mediaArray.length }} videos
        <PlaylistPreview :content="ad.contentId" />
      </v-list-item>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title>Adset</v-card-title>
    <v-card-text>
      <AdsetDesc :ad-set="ad.adSetId" />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title>Zones</v-card-title>
    <div class="pa-2">
      <AdDetailedZoneTable :zones="ad.zoneIds" />
    </div>
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
      };
    },

    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
  },
});
</script>
