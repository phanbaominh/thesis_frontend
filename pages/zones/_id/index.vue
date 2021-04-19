<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <v-card-title class="text-subtitle-1 text-sm-h6">
          {{ zone.name }}
        </v-card-title>
        <DialogName
          :init-name="zone.name"
          title="Change zone name:"
          icon="pencil"
          @updateName="onUpdateName"
        />

        <v-spacer></v-spacer>
        <v-dialog v-model="deviceDialog" width="1000" scrollable>
          <template #activator="{ on, attrs }">
            <v-btn
              depressed
              fab
              color="blue"
              class="align-self-center mr-2"
              v-bind="attrs"
              :small="!$vuetify.breakpoint.xs"
              :x-small="$vuetify.breakpoint.xs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <MediaAddDelete
              :media-array="zone.deviceArray"
              :all-media-array="nonZoneDeviceArray"
              type="Device"
              @add="onAddDevice"
              @delete="onDelete('device', $event)"
            />
          </v-card>
        </v-dialog>
        <v-btn fab small depressed color="blue" class="align-self-center mr-2">
          <v-icon> mdi-sync </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="12" lg="6">
        <ZoneMediaControl class="cards" :zone-info="zoneInfo" />
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
              @add="onAdd('video', $event)"
              @delete="onDelete('video', $event)"
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
              @add="onAdd('playlist', $event)"
              @delete="onDelete('playlist', $event)"
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import {
  Device,
  Nameable,
  Playlist,
  Video,
  Zone,
  ZoneArrayable,
  ZoneArrayType,
  ZoneInfo,
} from 'types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const zone = (await $axios.$get($apiUrl.zone(route.params.id))).zone;
    return { zone };
  },
  data() {
    return {
      deviceDialog: false,
      zoneInfo: {} as ZoneInfo,
      zone: (null as any) as Zone,
      nonZoneVideoArray: [] as Video[],
      nonZonePlaylistArray: [] as Playlist[],
      nonZoneDeviceArray: [] as Device[],
      allDeviceArray: [] as Device[],
      allVideoArray: [] as Video[],
      allPlaylistArray: [] as Playlist[],
    };
  },
  async fetch() {
    this.allVideoArray = (await this.$axios.$get(this.$apiUrl.videos)).videos;
    this.allPlaylistArray = (
      await this.$axios.$get(this.$apiUrl.playlists)
    ).playlists;
    this.allDeviceArray = (
      await this.$axios.$get(this.$apiUrl.devices)
    ).devices.filter((device: Device) => device.zoneId === null);
    console.log(
      (
        await this.$axios.$post(this.$apiUrl.videoInfo, {
          zoneId: this.zone._id,
        })
      ).result
    );

    this.updateNonZoneArray('video');
    this.updateNonZoneArray('playlist');
    this.updateNonZoneArray('device');
  },
  created() {
    this.$socket.on(
      `/recive/update/${this.zone._id}/infor-video`,
      (payload) => {
        this.zoneInfo = payload;
        console.log('info', this.zoneInfo);
      }
    );
  },
  beforeDestroy() {
    this.$socket.off(`/recive/update/${this.zone._id}/infor-video`);
  },
  methods: {
    async onDelete(type: ZoneArrayable, deletedArray: Nameable[]) {
      if (!this.zone.videoArray) return;
      const deletedIds = deletedArray.map((media) => media._id);
      const key = `${type}Array` as ZoneArrayType;

      this.zone[key] = (this.zone[key] as Array<any>).filter(
        (media) => !deletedIds.includes(media._id)
      );
      await this.updateZone(type);
    },
    async onAdd(type: ZoneArrayable, addedVideos: Nameable[]) {
      if (!this.zone.videoArray) this.zone.videoArray = [];
      const key = `${type}Array` as ZoneArrayType;
      this.zone[key] = (this.zone[key] as Array<any>).concat(addedVideos);
      await this.updateZone(type);
    },
    async updateZone(type: ZoneArrayable) {
      await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone);
      this.updateNonZoneArray(type);
    },
    async onUpdateName(newName: string) {
      if (newName === this.zone.name) return;
      this.zone.name = newName;
      await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone);
    },
    updateNonZoneArray(type: ZoneArrayable) {
      const captializedType = type.charAt(0).toUpperCase() + type.slice(1);
      const nonZoneKey = `nonZone${captializedType}Array` as `nonZone${Capitalize<ZoneArrayable>}Array`;
      const allKey = `all${captializedType}Array` as `all${Capitalize<ZoneArrayable>}Array`;
      const zoneKey = `${type}Array` as ZoneArrayType;
      const zoneIds = (this.zone[zoneKey] as Array<any>).map(
        (elem: { _id: string }) => elem._id
      );
      this[nonZoneKey] = (this[allKey] as Array<any>).filter(
        (elem) => !zoneIds.includes(elem._id)
      );
    },
    async onAddDevice(devices: Device[]) {
      for (const device of devices) {
        await this.$axios.$post(this.$apiUrl.zoneAddDevice, {
          zoneId: this.zone._id,
          deviceId: device._id,
        });
        this.zone.deviceArray.push(device);
      }
      this.updateNonZoneArray('device');
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
