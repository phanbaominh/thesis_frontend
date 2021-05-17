<template>
  <AdDetailed :ad="ad">
    <template #append>
      <BaseDialogActions v-if="isPending" @close="onReject" @confirm="onAccept">
        Accept
        <template #close> Reject </template>
      </BaseDialogActions>
    </template>
  </AdDetailed>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd } from '~/types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const ad = (await $axios.$get($apiUrl.adDetailed(route.params.id))).adOffer;
    // const ad = {
    //   _id: '123',
    //   name: 'test',
    //   adset: {
    //     _id: '123',
    //     name: 'adset',
    //     ages: { value: [1, 2], strict: false },
    //     genders: { value: [10], strict: false },
    //     daysOfWeek: { value: [1, 2], strict: false },
    //     hoursOfDay: { value: [1, 2], strict: false },
    //   },
    //   media: {
    //     _id: '234',
    //     name: 'playlist1',
    //     mediaArray: ['608f935f197d752cf86eb554'],
    //   },
    //   budget: 500,
    //   buildingManager: {
    //     _id: '234',
    //     username: 'buildingmanager',
    //     email: 'bdmanager@mail.com',
    //     password: '123',
    //   },
    //   adManager: {
    //     _id: '234',
    //     username: 'admanager',
    //     email: '234',
    //     password: '123',
    //   },
    //   status: AdStatus.Pending,
    // } as DetailedAd;
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as DetailedAd,
    };
  },
  computed: {
    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
  },
  methods: {
    async changeStatus(status: AdStatus) {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatus(this.ad._id), { status });
        this.ad.status = status;
      });
    },
    async onAccept() {
      await this.changeStatus(AdStatus.Deployed);
    },
    async onReject() {
      await this.changeStatus(AdStatus.Rejected);
    },
  },
});
</script>
