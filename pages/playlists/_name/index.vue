<template>
  <v-card class="pa-4">
    <EditableName
      :init-name="playlist.name"
      @updateName="playlist.name = $event"
    />
    <v-card outlined class="mt-2">
      <MediaAddDelete
        :media-array="playlist.mediaArray"
        type="Media"
        @add="onConfirmAdd"
        @delete="onConfirmDelete"
      />
    </v-card>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media, Playlist } from 'types/types';
export default Vue.extend({
  async asyncData({ route }) {
    // const zone = (
    //   await $axios.$get($apiUrl.getzone(route.params.zone.slice(1)))
    // ).zone;
    await Promise.resolve();
    let testArray = new Array(10).fill(0);
    testArray = testArray.map((_n, i) => ({ name: `Media${i}` }));
    const playlist = {
      name: route.params.name,
      mediaArray: testArray,
    };
    return { playlist };
  },
  data() {
    return {
      playlist: (null as any) as Playlist,
      allMediaArray: new Array(10)
        .fill(0)
        .map((_n, i) => ({ name: `New Media${i}` })),
    };
  },
  methods: {
    onConfirmDelete(deletedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) return;
      const deletedNames = deletedMediaArray.map((media) => media.name);
      this.playlist.mediaArray = this.playlist.mediaArray.filter(
        (media) => !deletedNames.includes(media.name)
      );
    },
    onConfirmAdd(addedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) this.playlist.mediaArray = [];
      addedMediaArray.forEach((media) => this.playlist.mediaArray!.push(media));
    },
  },
});
</script>
