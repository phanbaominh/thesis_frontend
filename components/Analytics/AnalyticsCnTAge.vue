<template>
  <AnalyticsChartAndTable
    :headers="headers"
    :url="$apiUrl.analyticsAge"
    :value-select-items="valueSelectItems"
  />
</template>
<script lang="ts">
import Vue from 'vue';
import { AnalyticsValue } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      headers: [
        { text: 'Age group', value: 'name' },
        { text: 'Views', value: 'views' },
      ],
      valueSelectItems: [
        { text: 'Views by video', value: AnalyticsValue.Views },
      ],
    };
  },
});
</script>
