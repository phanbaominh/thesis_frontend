<template>
  <v-select v-model="selectedItem" outlined dense :items="items"> </v-select>
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
      selectedItem: AnalyticsFrequency.Monthly,
    };
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_VALUE(this.selectedItem);
    },
  },
});
</script>
