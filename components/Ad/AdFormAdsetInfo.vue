<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Loading ad set</template>
    <v-card flat> <AdsetDesc :ad-set="adset" /> </v-card>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Adset } from '~/types/types';
export default Vue.extend({
  props: {
    adsetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      adset: null as Adset | null,
    };
  },
  async fetch() {
    this.adset = (
      await this.$axios.$get(this.$apiUrl.adset(this.adsetId))
    ).adset;
  },
  watch: {
    adsetId() {
      this.$fetch();
    },
  },
});
</script>
