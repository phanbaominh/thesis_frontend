<template>
  <v-card outlined>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending>
        <span> Fetching {{ type }}...<LoadingSpinner /> </span>
      </template>
      <ZoneSingleMediaItem
        main-component="ZoneSingleMediaItemMain"
        :init-items="mediaArray"
        :type="type"
      />
    </BaseFetcher>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    type: {
      type: String,
      required: true,
    },
    zone: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      mediaArray: [] as { title: string }[],
    };
  },
  async fetch() {
    await Promise.resolve();
    let testArray = new Array(10).fill(0);
    testArray = testArray.map((_n, i) => ({ title: `${this.type}${i}` }));
    this.mediaArray = testArray;
    // TODO: fetch from zone
  },
});
</script>
