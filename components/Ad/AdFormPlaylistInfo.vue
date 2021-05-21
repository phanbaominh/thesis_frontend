<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Loading ad set</template>
    <PlaylistPreview :content="playlist" />
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Playlist } from '~/types/types';
export default Vue.extend({
  props: {
    playlistId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      playlist: null as Playlist | null,
    };
  },
  async fetch() {
    this.playlist = (
      await this.$axios.$get(this.$apiUrl.playlist(this.playlistId))
    ).playlist;
  },
  watch: {
    playlist() {
      this.$fetch();
    },
  },
});
</script>
