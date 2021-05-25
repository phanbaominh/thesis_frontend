<template>
  <AnalyticsChartAndTable
    :headers="headers"
    :url="$apiUrl.analyticsBdManager"
  />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      headers: [
        { text: 'Building Manager', value: 'name' },
        { text: 'Cost', value: 'cost' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
      ],
    };
  },
});
</script>
