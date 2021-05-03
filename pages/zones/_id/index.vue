<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <v-card-title class="text-subtitle-1 text-sm-h6">
          {{ zone.name }}
        </v-card-title>
        <DialogName
          v-if="$permission.canGeneralWriteZone()"
          :init-name="zone.name"
          title="Change zone name:"
          icon="pencil"
          @updateName="onUpdateName"
        />

        <v-spacer></v-spacer>
        <v-dialog
          v-if="canReadDevice"
          v-model="deviceDialog"
          width="1000"
          scrollable
          :fullscreen="$vuetify.breakpoint.smAndDown"
          :hide-overlay="$vuetify.breakpoint.smAndDown"
        >
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
          <v-card class="cards pa-4">
            <BaseDialogTitle @close="deviceDialog = false">
              Devices
            </BaseDialogTitle>
            <v-card class="mb-4">
              <MediaAddDelete
                :media-array="zone.deviceArray"
                :all-media-array="nonZoneDeviceArray"
                type="Device"
                @add="onAddDevice"
                @delete="onDeleteDevice"
              />
            </v-card>
            <v-card>
              <ZonePermIterator :zone-id="zone._id" />
            </v-card>
          </v-card>
        </v-dialog>
        <BaseButtonToolbar icon="sync" @click="updateZone" />
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="12" lg="6">
        <ZoneMediaControl
          class="cards"
          :zone="zone"
          :playlist-videos="playlistVideos"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col v-if="canReadMedia" cols="12" lg="6">
        <v-card class="cards pa-4">
          <v-card outlined>
            <MediaAddDelete
              v-slot="{ media }"
              :media-array="zone.videoArray"
              :all-media-array="nonZoneVideoArray"
              type="Videos"
              compact
              @add="onAdd('video', $event)"
              @delete="onDelete('video', $event)"
            >
              <v-list-item-action>
                <BaseButton color="primary" dark @click="onPlayVideo(media)">
                  <v-icon>mdi-play</v-icon>
                </BaseButton>
              </v-list-item-action>
            </MediaAddDelete>
            <!-- <ZoneMedia
              v-slot="{ media }"
              :media-array="zone.videoArray"
              :all-media-array="nonZoneVideoArray"
              type="Videos"
              @add="onAdd('video', $event)"
              @delete="onDelete('video', $event)"
            >
              <v-list-item-action>
                <BaseButton color="primary" dark @click="onPlayVideo(media)">
                  <v-icon>mdi-play</v-icon>
                </BaseButton>
              </v-list-item-action>
            </ZoneMedia> -->
          </v-card>
          <v-card outlined>
            <ZoneMedia
              v-slot="{ media }"
              :media-array="zone.playlistArray"
              :all-media-array="nonZonePlaylistArray"
              type="Playlists"
              @add="onAdd('playlist', $event)"
              @delete="onDelete('playlist', $event)"
            >
              <v-list-item-action>
                <BaseButton color="primary" dark @click="onPlayPlaylist(media)">
                  <v-icon>mdi-play</v-icon>
                </BaseButton>
              </v-list-item-action>
            </ZoneMedia>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-10">
      <v-card-title>Media Log</v-card-title>
      <ZoneDevicesLog :zone="zone" />
    </v-card>
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
  ZonePermissionGroup,
} from 'types/types';

export default Vue.extend({
  middleware({ route, $auth, redirect, $toast, $permission }) {
    const hasPermissionOfZone = !!(
      $auth.user &&
      ($auth.user.zonePermissionGroups as ZonePermissionGroup[]).find(
        (zpg) => zpg.zone._id === route.params.id
      )
    );
    if (!(hasPermissionOfZone || $permission.canGeneralReadZone())) {
      $toast.error("You don't have permission");
      redirect('/');
    }
  },
  async asyncData({ route, $axios, $apiUrl }) {
    const zone = (await $axios.$get($apiUrl.zone(route.params.id))).zone;
    return { zone };
  },
  data() {
    return {
      deviceDialog: false,
      zone: (null as any) as Zone,
      nonZoneVideoArray: [] as Video[],
      nonZonePlaylistArray: [] as Playlist[],
      nonZoneDeviceArray: [] as Device[],
      allDeviceArray: [] as Device[],
      allVideoArray: [] as Video[],
      allPlaylistArray: [] as Playlist[],
      playlistVideos: [] as { id: string; videos: Video[] }[],
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

    this.updateNonZoneArray('video');
    this.updateNonZoneArray('playlist');
    this.updateNonZoneArray('device');
  },
  computed: {
    canGeneralReadZone(): Boolean {
      return this.$permission.canGeneralReadZone();
    },
    canReadDevice(): Boolean {
      return (
        this.canGeneralReadZone ||
        this.$permission.check(this.$permission.DevicePermissions, {
          zoneId: this.zone._id,
        })
      );
    },
    canReadMedia(): Boolean {
      return (
        this.canGeneralReadZone ||
        this.$permission.check(this.$permission.MediaPermissions, {
          zoneId: this.zone._id,
          isLogging: true,
        })
      );
    },
  },
  beforeDestroy() {
    this.$socket.off(`/receive/update/${this.zone._id}/infor-video`);
  },
  methods: {
    onDelete(type: ZoneArrayable, deletedArray: Nameable[]) {
      if (!this.zone.videoArray) return;
      const deletedIds = deletedArray.map((media) => media._id);
      const key = `${type}Array` as ZoneArrayType;

      this.zone[key] = (this.zone[key] as Array<any>).filter(
        (media) => !deletedIds.includes(media._id)
      );
      if (type === 'playlist') {
        this.playlistVideos = this.playlistVideos.filter(
          (pl) => !deletedIds.includes(pl.id)
        );
      }
      this.updateNonZoneArray(type);
    },
    onAdd(type: ZoneArrayable, addedVideos: Nameable[]) {
      if (!this.zone.videoArray) this.zone.videoArray = [];
      const key = `${type}Array` as ZoneArrayType;
      this.zone[key] = (this.zone[key] as Array<any>).concat(addedVideos);
      this.updateNonZoneArray(type);
    },
    async updateZone() {
      try {
        this.zone = (
          await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone)
        ).zone;
        this.$toast.success('Sucessfully updated Zone');
      } catch {
        // DO NOTHING
      }
    },
    async onUpdateName(newName: string) {
      if (newName === this.zone.name) return;
      const oldName = this.zone.name;
      this.zone.name = newName;
      try {
        await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone);
      } catch {
        this.zone.name = oldName;
      }
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
        try {
          await this.$axios.$post(this.$apiUrl.zoneAddDevice, {
            zoneId: this.zone._id,
            deviceId: device._id,
          });
          this.zone.deviceArray.push(device);
        } catch {
          // DO NOTHING
        }
      }
      this.updateNonZoneArray('device');
    },
    async onDeleteDevice(devices: Device[]) {
      for (const device of devices) {
        try {
          await this.$axios.$post(this.$apiUrl.zoneDeleteDevice, {
            zoneId: this.zone._id,
            deviceId: device._id,
          });
          this.zone.deviceArray = this.zone.deviceArray.filter(
            (d) => d._id !== device._id
          );
        } catch {
          // DO NOTHING
        }
      }
      this.updateNonZoneArray('device');
      this.$axios.$post(this.$apiUrl.videoInfo, {
        zoneId: this.zone._id,
      });
    },
    async onPlayVideo(video: Video) {
      this.warn();
      try {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName: 'play-video',
          payload: {
            zoneId: this.zone._id,
            videoId: video._id,
          },
        });
      } catch {
        // DO NOTHING
      }
    },
    warn() {
      if (!this.$accessor.isSocketConnected) {
        this.$toast.info('Need a socket connection to server');
      } else if (this.zone.deviceArray.length === 0) {
        this.$toast.info('Please add device to zone');
      }
    },
    async onPlayPlaylist(playlist: Playlist) {
      this.warn();
      try {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName: 'play-playlist-video',
          payload: {
            zoneId: this.zone._id,
            playlistVideoId: playlist._id,
          },
        });
        this.playlistVideos.push({
          id: playlist._id,
          videos: (
            await this.$axios.$get(this.$apiUrl.videoArray, {
              params: {
                videoIds: playlist.mediaArray,
              },
            })
          ).video,
        });
      } catch {
        // DO NOTHING
      }
    },
  },
});
</script>
<style scoped>
.cards {
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.cards > * {
  margin-bottom: 10px;
}
</style>
