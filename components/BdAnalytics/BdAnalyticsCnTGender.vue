<template>
  <AnalyticsChartAndTable
    :headers="headers"
    :url="$apiUrl.bdAnalyticsGender"
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
        { text: 'Gender', value: 'name' },
        { text: 'Views', value: 'views' },
      ],
      valueSelectItems: [
        { text: 'Views by zone', value: AnalyticsValue.Views },
      ],
    };
  },
});
</script>
