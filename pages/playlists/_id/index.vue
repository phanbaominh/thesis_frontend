<template>
  <v-card class="pa-4">
    <BaseDialogTitle @close="$emit('closeDialog')">
      <div class="mr-2">{{ $truncate(playlist.name) }}</div>
      <DialogName
        :init-name="playlist.name"
        title="Change playlist name:"
        icon="pencil"
        @updateName="playlist.name = $event"
      />
    </BaseDialogTitle>
    <v-card outlined class="mt-2">
      <BaseFetcher :fetch-state="$fetchState">
        <MediaAddDelete
          :media-array="playlist.mediaArray"
          :all-media-array="allMediaArray"
          type="Media"
        />
      </BaseFetcher>
    </v-card>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { Playlist } from 'types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const playlist = (await $axios.$get($apiUrl.playlist(route.params.id)))
      .playlists;
    return { playlist };
  },
  data() {
    return {
      playlist: (null as any) as Playlist,
      allMediaArray: [],
    };
  },
  async fetch() {
    this.allMediaArray = (await this.$axios.$get(this.$apiUrl.videos)).video;
  },
  methods: {
    // onConfirmDelete(deletedMediaArray: Media[]) {
    //   if (!this.playlist.mediaArray) return;
    //   const deletedNames = deletedMediaArray.map((media) => media.name);
    //   // this.playlist.mediaArray = this.playlist.mediaArray.filter(
    //   //   (media) => !deletedNames.includes(media.name)
    //   // );
    // },
    // onConfirmAdd(addedMediaArray: Media[]) {
    //   if (!this.playlist.mediaArray) this.playlist.mediaArray = [];
    //   addedMediaArray.forEach((media) => this.playlist.mediaArray!.push(media));
    // },
  },
});
</script>
