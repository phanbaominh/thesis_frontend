<template>
  <v-dialog
    v-model="dialog"
    width="1000"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        class="ml-2"
        fab
        dark
        depressed
        color="blue"
        v-bind="attrs"
        x-small
        v-on="on"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending> Fetching videos... </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-card-title class="text-subtitle-1 text-sm-h6">
            Videos: {{ playlistMediaArray.length }}
          </v-card-title>
        </v-toolbar>
        <MediaList :items="playlistMediaArray">
          <template #default="{ item: media }">
            <v-list-item-content
              class="text-subtitle-1 text-sm-h6 font-weight-regular"
            >
              {{ media.name }}
            </v-list-item-content>
          </template>
          <template #actions="{ item: media }">
            <v-list-item-action>
              <MediaTabItemPlayDialog :media="media" />
            </v-list-item-action>
          </template>
        </MediaList>
      </v-card>
    </BaseFetcher>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media, Playlist } from '~/types/types';
export default Vue.extend({
  props: {
    content: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Playlist>,
  },
  data() {
    return {
      dialog: false,
      playlistMediaArray: [] as Media[],
    };
  },
  async fetch() {
    this.playlistMediaArray = (
      await this.$axios.$get(this.$apiUrl.videoArray, {
        params: { videoIds: this.content.mediaArray },
      })
    ).video;
  },
});
</script>
