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
        <v-row class="mt-2">
          <v-col
            v-for="playlist in displayedPlaylists"
            :key="playlist._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MediaTabItemPlaylistDialog
              :init-playlist="playlist"
              @update:playlist="updatePlaylist"
              @delete="onDelete(playlist)"
            />
          </v-col>
        </v-row>
        <!-- <MediaList :items="displayedPlaylists">
          <template #default="{ item: playlist }">
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
        </MediaList> -->
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
    this.playlists = (await this.$axios.$get(this.$apiUrl.playlists)).playlists;
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
      } catch {
        // DO NOTHING
      }
    },
    async onDelete(playlist: Playlist) {
      try {
        await this.$axios.$delete(this.$apiUrl.playlist(playlist._id));
        this.playlists = this.playlists.filter((m) => m._id !== playlist._id);
      } catch {
        // DO NOTHING
      }
    },
    updatePlaylist(newPlaylist: Playlist) {
      this.playlists = this.playlists.map((playlist) =>
        playlist._id === newPlaylist._id ? newPlaylist : playlist
      );
    },
  },
});
</script>
<style scoped>
.playlist_card {
  border: 1px solid #adbbd4;
}
</style>
