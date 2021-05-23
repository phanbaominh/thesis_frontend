<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>Fetching ads</template>
    Some ads:
    <v-chip
      v-for="ad in ads"
      :key="ad._id"
      nuxt
      :to="`/ads/${ad._id}`"
      class="mr-1"
      small
    >
      {{ ad.name }}
    </v-chip>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad } from '~/types/types';
export default Vue.extend({
  props: {
    keyName: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ads: [] as Ad[],
    };
  },
  async fetch() {
    this.ads = (
      await this.$axios.$get(this.$apiUrl.adsBelongTo, {
        params: { key: this.keyName, id: this.id },
      })
    ).ads;
  },
});
</script>
