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
            <!-- <nuxt-link :to="`/playlists/${playlist._id}`">
              {{ playlist.name }}
            </nuxt-link> -->
            <MediaTabItemPlaylistDialog
              :init-playlist="playlist"
              @update:playlist="updatePlaylist"
            />
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
    this.playlists = (await this.$axios.$get(this.$apiUrl.playlists)).playlist;
  },
  methods: {
    async onNew(name: string) {
      try {
        const newPlaylist = (
          await this.$axios.$post(this.$apiUrl.playlists, {
            name,
            type: 'video',
            mediaArray: [],
          })
        ).playlist;
        this.playlists.push(newPlaylist);
      } catch (error) {
        console.log(error);
      }
    },
    async onDelete(playlist: Playlist) {
      await this.$axios.$delete(this.$apiUrl.playlist(playlist._id));
      this.playlists = this.playlists.filter((m) => m._id !== playlist._id);
    },
    updatePlaylist(newPlaylist: Playlist) {
      this.playlists = this.playlists.map((playlist) =>
        playlist._id === newPlaylist._id ? newPlaylist : playlist
      );
    },
  },
});
</script>
