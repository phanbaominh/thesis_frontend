<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching playlists... </template>
    <DataIterator :type="'Playlist'" :init-items="playlists" :compact="compact">
      <DialogName
        v-slot="{ on, attrs }"
        init-name=""
        title="Create a playlist:"
        @updateName="onNew"
      >
        <v-btn
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </DialogName>
      <template #main="{ items: displayedPlaylists }">
        <MediaList :items="displayedPlaylists">
          <template #default="{ item: playlist }">
            <nuxt-link :to="`/playlists/${playlist.name}`">
              {{ playlist.name }}
            </nuxt-link>
          </template>
          <template #actions="{ item: playlist }">
            <DialogDelete color="error" @delete="onDelete(playlist)">
              <v-icon>mdi-delete</v-icon>
            </DialogDelete>
          </template>
        </MediaList>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Playlist } from '~/types/types';
export default Vue.extend({
  props: {
    compact: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      playlists: (null as any) as Playlist[],
    };
  },
  async fetch() {
    await Promise.resolve();
    const testArray = new Array(10).fill(0);
    this.playlists = testArray.map((_n, i) => ({
      name: `Playlist${i}`,
      mediaArray: [{ name: `Video${i}`, path: 'kakaka' }],
      type: 'Video',
    }));
  },
  methods: {
    async onNew(name: string) {
      try {
        const newPlaylist = await this.$axios.$post(this.$apiUrl.playlists, {
          name,
          type: 'video',
          mediaArray: [],
        });
        this.playlists.push(newPlaylist);
      } catch (error) {
        console.log(error);
      }
    },
    onDelete(playlist: Playlist) {
      this.playlists = this.playlists.filter((m) => m.name !== playlist.name);
    },
  },
});
</script>
