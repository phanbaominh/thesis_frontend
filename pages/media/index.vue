<template>
  <v-card>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <MediaTabItem
          :media-array="videos"
          :type="'Videos'"
          @delete="onDeleteVideo"
        />
      </v-tab-item>
      <v-tab-item>
        <MediaTabItem :media-array="images" :type="'Images'" />
      </v-tab-item>
      <v-tab-item>
        <MediaTabItemPlaylist :playlists="playlists" @new="onNewPlaylist" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media } from '~/types/types';
// let testArray = new Array(10).fill(0);
// testArray = testArray.map((_n, i) => ({ title: `Video${i}` }));
export default Vue.extend({
  data() {
    return {
      tab: null,
      tabItems: ['Videos', 'Images', 'Playlists'],
      videos: [{ name: 'Video 1' }, { name: 'Video 2' }],
      images: [{ name: 'Image 1' }, { name: 'Image 2' }],
      playlists: [{ name: 'Playlist 1' }, { name: 'Playlist 2' }],
    };
  },
  methods: {
    onNewPlaylist(name: string) {
      this.playlists.push({ name });
    },
    onDeleteVideo(video: Media) {
      this.videos = this.videos.filter((m) => m.name !== video.name);
    },
  },
});
</script>
