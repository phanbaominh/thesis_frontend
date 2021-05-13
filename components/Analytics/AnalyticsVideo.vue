<template>
  <AnalyticsChartAndTable :headers="headers" :url="$apiUrl.analyticsAdOffer" />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      headers: [
        { text: 'Video', value: 'name' },
        { text: 'Views', value: 'views' },
        { text: 'Run time', value: 'runTime' },
      ],
    };
  },
});
</script>
