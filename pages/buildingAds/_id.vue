<template>
  <v-card>
    <v-btn nuxt depressed to="/buildingAds"
      ><v-icon> mdi-arrow-left</v-icon></v-btn
    >
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
    <BaseDialogActions v-if="ad.status" @close="onReject" @confirm="onAccept">
      Accept
      <template #close> Reject </template>
    </BaseDialogActions>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd, AdsetConst } from '~/types/types';
export default Vue.extend({
  async asyncData() {
    // { route, $axios, $apiUrl }
    await Promise.resolve();
    // const ad1 = (await $axios.$get($apiUrl.ad(route.params.id))).ad;
    const ad = {
      _id: '123',
      name: 'test',
      adset: {
        _id: '123',
        name: 'adset',
        ages: { value: [1, 2], strict: false },
        gender: { value: 10, strict: false },
        daysOfWeek: { value: [1, 2], strict: false },
        hoursOfDay: { value: [1, 2], strict: false },
      },
      media: {
        _id: '234',
        name: 'playlist1',
        mediaArray: ['608f935f197d752cf86eb554'],
      },
      budget: 500,
      buildingManagerId: '234',
      adManager: {
        _id: '234',
        username: 'admanager',
        email: '234',
        password: '123',
      },
      status: AdStatus.Pending,
    } as DetailedAd;
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as DetailedAd,
    };
  },
  computed: {
    overviewDesc(): { [key: string]: string } {
      return {
        Name: `${this.ad.name}`,
        Budget: `${this.ad.budget}`,
        AdManager: `${this.ad.adManager.email}`,
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
      const genderLine = adset.gender.value === 10 ? 'Male' : 'Female';
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

  methods: {
    async changeStatus(status: AdStatus) {
      try {
        await this.$axios.$put(this.$apiUrl.adStatus(this.ad._id), { status });
        this.ad.status = status;
      } catch (err) {}
    },
    async onAccept() {
      await this.changeStatus(AdStatus.Running);
    },
    async onReject() {
      await this.changeStatus(AdStatus.Rejected);
    },
  },
});
</script>
