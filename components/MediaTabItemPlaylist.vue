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
          small
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </DialogName>
      <template #main="{ items: displayedPlaylists }">
        <MediaList :items="displayedPlaylists">
          <template #default="{ item: playlist }">
            <v-list-item-content class="text-h6 font-weight-regular">
              <nuxt-link :to="`/playlists/${playlist.name}`">
                {{ playlist.name }}
              </nuxt-link>
            </v-list-item-content>
          </template>
          <template #actions="{ item: playlist }">
            <DialogDelete v-slot="{ on, attrs }" @delete="onDelete(playlist)">
              <v-btn fab depressed small color="error" v-bind="attrs" v-on="on"
                ><v-icon>mdi-delete</v-icon>
              </v-btn>
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
      mediaArray: [{ name: `Video${i}` }],
    }));
  },
  methods: {
    onNew(name: string) {
      this.playlists.push({ name });
    },
    onDelete(playlist: Playlist) {
      this.playlists = this.playlists.filter((m) => m.name !== playlist.name);
    },
  },
});
</script>
