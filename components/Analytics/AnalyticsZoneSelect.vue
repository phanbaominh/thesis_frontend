<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>Lozoneing zones</template>
    <v-select v-model="selectedItem" outlined dense :items="items" label="Zone">
    </v-select>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone, Select } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      items: [] as Select[],
      selectedItem: this.$accessor.analytics.item,
    };
  },
  async fetch() {
    const zones = ((await this.$axios.$get(this.$apiUrl.zones))
      .zones as Zone[]).filter((zone) => zone.name !== 'General');
    this.items.push({ text: 'All', value: 'all' });
    zones.forEach((zone) =>
      this.items.push({ text: zone.name, value: zone._id })
    );
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_ITEM(this.selectedItem);
    },
  },
});
</script>
