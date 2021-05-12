<template>
  <AdDetailed :ad="ad" />
</template>
<script lang="ts">
import Vue from 'vue';
import { DetailedAd } from '~/types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    await Promise.resolve();
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
});
</script>
