<template>
  <AdForm :init-ad="ad" />
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad, AdStatus } from '~/types/types';
export default Vue.extend({
  middleware: ['checkUserIsAdManager'],
  async asyncData({ route, $axios, $apiUrl, redirect, $toast }) {
    const ad = (await $axios.$get($apiUrl.ad(route.params.id))).adOffer as Ad;
    if (ad.status === AdStatus.Pending || ad.status === AdStatus.Deployed) {
      $toast.error('You cannot edit a pending or deployed ad');
      return redirect(`/ads/${ad._id}`);
    }
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as Ad,
    };
  },
});
</script>
