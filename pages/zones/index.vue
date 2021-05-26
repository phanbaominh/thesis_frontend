<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching zones... </template>
    <ZoneTable :init-zone-table-data="zoneTableData"> </ZoneTable>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      zones: [] as Zone[],
      zoneTableData: [],
    };
  },
  async fetch() {
    this.zoneTableData = (
      await this.$axios.$get(this.$apiUrl.zonesTableFormat)
    ).zones;
  },
});
</script>
