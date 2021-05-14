<template>
  <v-select
    v-model="selectedItem"
    outlined
    dense
    :items="items"
    label="Frequency"
  >
  </v-select>
</template>
<script lang="ts">
import Vue from 'vue';
import { AnalyticsFrequency, Select } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      items: [
        { text: 'Daily', value: AnalyticsFrequency.Daily },
        { text: 'Monthly', value: AnalyticsFrequency.Monthly },
      ] as Select[],
      selectedItem: this.$accessor.analytics.frequency,
    };
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_FREQUENCY(this.selectedItem);
    },
  },
});
</script>
