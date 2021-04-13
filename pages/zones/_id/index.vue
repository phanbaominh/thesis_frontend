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
      <v-col cols="12" lg="6">
        <ZoneMediaControl class="cards" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" lg="6">
        <v-card class="cards pa-4">
          <v-card outlined>
            <ZoneMedia
              v-slot="{ media }"
              :media-array="zone.videoArray"
              :all-media-array="nonZoneVideoArray"
              type="Videos"
              @add="onAddVideos"
              @delete="onDeleteVideos"
            >
              <v-list-item-action>
                <MediaTabItemPlayDialog :media="media" />
              </v-list-item-action>
            </ZoneMedia>
          </v-card>
          <v-card outlined>
            <ZoneMedia
              :media-array="zone.playlistArray"
              :all-media-array="nonZonePlaylistArray"
              type="Playlists"
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Playlist, Video, Zone } from 'types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const zone = (await $axios.$get($apiUrl.zone(route.params.id))).zone;
    return { zone };
  },
  data() {
    return {
      zone: (null as any) as Zone,
      nonZoneVideoArray: [] as Video[],
      nonZonePlaylistArray: [] as Playlist[],
      allVideoArray: [] as Video[],
      allPlaylistArray: [] as Playlist[],
    };
  },
  async fetch() {
    this.allVideoArray = (await this.$axios.$get(this.$apiUrl.videos)).video;
    this.allPlaylistArray = (
      await this.$axios.$get(this.$apiUrl.playlists)
    ).playlist;
    this.updateNonZoneVideoArray();
    this.updateNonZonePlaylistArray();
  },
  methods: {
    async onDeleteVideos(deletedVideos: Video[]) {
      if (!this.zone.videoArray) return;
      const deletedIds = deletedVideos.map((media) => media._id);
      this.zone.videoArray = this.zone.videoArray.filter(
        (media) => !deletedIds.includes(media._id)
      );
      await this.updateZoneWithVideo();
    },
    async onAddVideos(addedVideos: Video[]) {
      if (!this.zone.videoArray) this.zone.videoArray = [];
      this.zone.videoArray = this.zone.videoArray.concat(addedVideos);
      await this.updateZoneWithVideo();
    },
    async updateZoneWithVideo() {
      await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone);
      this.updateNonZoneVideoArray();
    },
    onUpdateName(newName: string) {
      this.zone.name = newName;
    },
    updateNonZoneVideoArray() {
      this.nonZoneVideoArray = this.updateNonZoneArray(
        this.allVideoArray,
        this.zone.videoArray
      );
    },
    updateNonZonePlaylistArray() {
      this.nonZonePlaylistArray = this.updateNonZoneArray(
        this.allPlaylistArray,
        this.zone.playlistArray
      );
    },
    updateNonZoneArray<T>(nonZoneArray: T[], zoneArray: T[]): T[] {
      return nonZoneArray.filter((elem) => !zoneArray.includes(elem));
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
