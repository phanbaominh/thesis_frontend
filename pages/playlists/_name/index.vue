<template>
  <v-card>
    <v-card-title> {{ playlist.name }}</v-card-title>
    <v-card-actions>
      <v-btn color="primary">
        <v-icon> mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card outlined class="mx-2">
      <PlaylistMain
        :type="'Items'"
        :media-array="playlist.mediaArray"
        @onConfirm="onConfirmDelete"
      >
        <BaseButtonToolbar icon="plus" />
      </PlaylistMain>
    </v-card>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { Playlist } from 'types/types';
import BaseButtonToolbar from '~/components/BaseButtonToolbar.vue';
export default Vue.extend({
  components: { BaseButtonToolbar },
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
    };
  },
  methods: {
    onConfirmDelete(deletedMediaArray: string[]) {
      this.playlist.mediaArray = this.playlist.mediaArray.filter(
        (media) => !deletedMediaArray.includes(media.name)
      );
    },
  },
});
</script>
