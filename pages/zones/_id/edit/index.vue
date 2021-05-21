<template>
  <ZoneCreateForm :init-zone="zone" />
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from 'types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const zone = (await $axios.$get($apiUrl.zone(route.params.id))).zone;
    return { zone };
  },
  data() {
    return {
      zone: (null as any) as Zone,
    };
  },
});
</script>
