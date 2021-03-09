<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <EditableName :init-name="zone.name" @updateName="onUpdateName" />
        <v-spacer></v-spacer>
        <v-btn fab small depressed color="blue" class="align-self-center mr-2">
          <v-icon> mdi-sync </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <ZoneMediaControl class="cards" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6">
        <v-card class="cards pa-4">
          <v-card outlined>
            <ZoneMedia
              :media-array="zone.videos"
              type="Videos"
              @add="onAddVideos"
              @delete="onDeleteVideos"
            />
          </v-card>
          <v-card outlined>
            <ZoneMedia :media-array="zone.playlists" type="Playlists" />
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media, Zone } from 'types/types';
export default Vue.extend({
  async asyncData({ route }) {
    // const zone = (
    //   await $axios.$get($apiUrl.getzone(route.params.zone.slice(1)))
    // ).zone;
    await Promise.resolve();
    const zone = {
      name: route.params.name,
      playlists: new Array(10)
        .fill(0)
        .map((_n, i) => ({ name: `Playlist${i}` })),
      videos: new Array(10).fill(0).map((_n, i) => ({ name: `Video${i}` })),
    };
    return { zone };
  },
  data() {
    return {
      zone: (null as any) as Zone,
    };
  },
  methods: {
    onDeleteVideos(deletedVideos: Media[]) {
      if (!this.zone.videos) return;
      const deletedNames = deletedVideos.map((media) => media.name);
      this.zone.videos = this.zone.videos.filter(
        (media) => !deletedNames.includes(media.name)
      );
    },
    onAddVideos(addedVideos: Media[]) {
      if (!this.zone.videos) this.zone.videos = [];
      addedVideos.forEach((media) => this.zone.videos!.push(media));
    },
    onUpdateName(newName: string) {
      this.zone.name = newName;
    },
  },
});
</script>
<style scoped>
.cards {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.cards > * {
  margin-bottom: 10px;
}
</style>
