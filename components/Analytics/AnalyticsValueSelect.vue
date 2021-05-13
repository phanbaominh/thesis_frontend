<template>
  <v-select v-model="selectedItem" outlined dense :items="items"> </v-select>
</template>
<script lang="ts">
import Vue from 'vue';
import { AnalyticsValue, Select } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      items: [
        { text: 'Views by video', value: AnalyticsValue.Views },
        { text: 'Run times by video', value: AnalyticsValue.RunTime },
      ] as Select[],
      selectedItem: this.$accessor.analytics.value,
    };
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_VALUE(this.selectedItem);
    },
  },
});
</script>
