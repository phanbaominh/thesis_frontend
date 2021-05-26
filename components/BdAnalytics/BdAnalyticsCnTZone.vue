<template>
  <AnalyticsChartAndTable
    :headers="headers"
    :url="$apiUrl.bdAnalyticsZone"
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
        { text: 'Ad', value: 'name' },
        { text: 'Profit', value: 'cost' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
        { text: 'Average run time', value: 'avgRunTime' },
        { text: 'Average views', value: 'avgViews' },
      ],
      valueSelectItems: [
        { text: 'Views by zone', value: AnalyticsValue.Views },
        { text: 'Run times by zone', value: AnalyticsValue.RunTime },
        { text: 'Profit by zone', value: AnalyticsValue.Cost },
      ],
    };
  },
});
</script>
