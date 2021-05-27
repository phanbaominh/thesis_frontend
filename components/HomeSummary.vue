<template>
  <v-card max-width="300px">
    <v-card-title>Summary of last 24h</v-card-title>
    <v-divider></v-divider>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending> Loading data... </template>
      <v-row>
        <v-col>
          <HomeSummaryItem :title="data.views || 0" subtitle="Views" />
        </v-col>
        <v-col>
          <HomeSummaryItem :title="data.runTime || 0" subtitle="Run time" />
        </v-col>
        <v-col> </v-col>
      </v-row>
      <v-divider></v-divider>

      <HomeSummaryItem
        :title="$utils.moneyFormat(data.cost || 0)"
        :subtitle="costName"
      />
    </BaseFetcher>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    link: {
      required: true,
      type: String,
    },
    costName: {
      default: 'Cost',
      type: String,
    },
  },
  data() {
    return {
      data: { views: 0, runTime: 0, cost: 0 },
    };
  },
  async fetch() {
    this.data = (await this.$axios.$get(this.link)).data;
  },
});
</script>
