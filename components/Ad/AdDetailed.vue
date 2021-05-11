<template>
  <v-card>
    <v-card-title
      >Overview <AdCardStatus :status="ad.status" class="ml-2" />
    </v-card-title>
    <v-card-text>
      <v-list-item v-for="(value, key) in overviewDesc" :key="key">
        <span class="font-weight-bold mr-2">{{ key + ':' }}</span>
        {{ ` ${value || 'None'}` }}
      </v-list-item>
      <v-list-item>
        <span class="font-weight-bold mr-2"> Content: </span>
        {{ ad.media.mediaArray.length }} videos
        <BuildingAdContentPreview :content="ad.media" />
      </v-list-item>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title>Adset</v-card-title>
    <v-card-text>
      <v-list-item v-for="(value, key) in adsetDesc" :key="key">
        <span class="font-weight-bold mr-2">{{ key + ':' }}</span>
        {{ ` ${value || 'None'}` }}
      </v-list-item>
    </v-card-text>
    <v-divider></v-divider>

    <slot name="append" :ad="ad"></slot>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd, AdsetConst, AdsetGender } from '~/types/types';
export default Vue.extend({
  props: {
    initAd: {
      type: Object,
      required: true,
    } as Vue.PropOptions<DetailedAd>,
  },
  data() {
    return { ad: this.initAd };
  },
  computed: {
    overviewDesc(): { [key: string]: string } {
      return {
        Name: `${this.ad.name}`,
        Budget: `${this.ad.budget}`,
        AdManager: `${this.ad.adManager.email}`,
        BuildingManager: `${this.ad.buildingManager.email}`,
      };
    },
    adsetDesc(): { [key: string]: string } {
      const adset = this.ad.adset;
      const ageLine = adset.ages.value
        .map((age) => AdsetConst.ranges[age])
        .join(', ');
      const dowLine = adset.daysOfWeek.value
        .map((dow) => AdsetConst.dows[dow])
        .join(', ');
      const hodLine = adset.hoursOfDay.value
        .map((hod) => AdsetConst.hods[hod])
        .join(', ');
      const genderLine = adset.genders.value
        .map((g) => (g === AdsetGender.Male ? 'Male' : 'Female'))
        .join(',');
      return {
        Ages: ageLine,
        Gender: genderLine,
        DoW: dowLine,
        HoD: hodLine,
      };
    },
    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
  },
});
</script>
