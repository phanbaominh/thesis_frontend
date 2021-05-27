<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching zones... </template>
    <ZoneTable :init-zone-table-data="zoneTableData"> </ZoneTable>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone, ZonePermissionGroup } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      zones: [] as Zone[],
      zoneTableData: [] as { [key: string]: any; _id: string }[],
    };
  },
  async fetch() {
    this.zoneTableData = (
      await this.$axios.$get(this.$apiUrl.zonesTableFormat)
    ).zones;
    if (this.$auth.user?.adminId) {
      const zoneIds = (this.$auth.user
        ?.zonePermissionGroups as ZonePermissionGroup[]).map(
        (zpg) => zpg.zone._id
      );
      this.zoneTableData = this.zoneTableData.filter(
        (zone) =>
          zoneIds.includes(zone._id) &&
          zone._id !== this.$auth.user?.generalZoneId
      );
    } else {
      this.zoneTableData = this.zoneTableData.filter(
        (zone) => zone._id !== this.$auth.user?.generalZoneId
      );
    }
  },
});
</script>
