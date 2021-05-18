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
                :add-perm="canWriteDevice"
                :delete-perm="canDeleteDevice"
                @add="onAddDevice"
                @delete="onDeleteDevice"
              />
            </v-card>
            <v-card>
              <ZonePermIterator :zone-id="zone._id" />
            </v-card>
          </v-card>
        </v-dialog>
        <BaseButtonToolbar
          v-if="canWriteZone"
          icon="sync"
          @click="updateZone"
        />
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="12" lg="6">
        <ZoneMediaControl
          class="cards"
          :zone="zone"
          :playlist-videos="playlistVideos"
          :control-perm="canControlZone"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col v-if="canReadAd" cols="12" lg="6">
        <v-card outlined>
          <MediaAddDelete
            :media-array="zone.adArray"
            :all-media-array="nonZoneAdArray"
            type="Ads"
            compact
            :add-perm="canWriteAd"
            :delete-perm="canDeleteAd"
            @add="onAdd"
            @delete="onDelete"
          >
            <!-- <v-list-item-action>
              <BaseButton color="primary" dark @click="onPlayVideo(media)">
                <v-icon>mdi-play</v-icon>
              </BaseButton>
            </v-list-item-action> -->
          </MediaAddDelete>
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
  Ad,
  AdStatus,
  Device,
  Permission,
  Playlist,
  Video,
  Zone,
  ZoneArrayable,
  ZoneArrayType,
  ZonePermissionGroup,
} from '~/types/types';

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

      nonZoneDeviceArray: [] as Device[],
      nonZoneAdArray: [] as Ad[],
      allAdArray: [] as Ad[],
      allDeviceArray: [] as Device[],

      playlistVideos: [] as { id: string; videos: Video[] }[],
    };
  },
  async fetch() {
    this.allAdArray = ((await this.$axios.$get(this.$apiUrl.adsBdManager))
      .adOffers as Ad[]).filter((ad) => ad.status === AdStatus.Deployed);
    this.allDeviceArray = (
      await this.$axios.$get(this.$apiUrl.devices)
    ).devices.filter((device: Device) => device.zoneId === null);

    this.updateNonZoneArray();
  },
  computed: {
    canGeneralReadZone(): Boolean {
      return this.$permission.canGeneralReadZone();
    },
    canGeneralWriteZone(): Boolean {
      return this.$permission.canGeneralWriteZone();
    },
    canReadDevice(): Boolean {
      return (
        this.canGeneralReadZone ||
        this.$permission.check(this.$permission.DevicePermissions, {
          zoneId: this.zone._id,
        })
      );
    },
    canReadAd(): Boolean {
      return (
        this.canGeneralReadZone ||
        this.$permission.check(this.$permission.MediaPermissions, {
          zoneId: this.zone._id,
        })
      );
    },
    canWriteAd(): Boolean {
      return (
        this.canGeneralWriteZone ||
        this.$permission.check(Permission.WriteAd, { zoneId: this.zone._id })
      );
    },
    canDeleteAd(): Boolean {
      return this.$permission.check(Permission.DeleteAd, {
        zoneId: this.zone._id,
      });
    },
    canWriteDevice(): Boolean {
      return (
        this.canGeneralWriteZone ||
        this.$permission.check(Permission.WriteDevice, {
          zoneId: this.zone._id,
        })
      );
    },
    canDeleteDevice(): Boolean {
      return this.$permission.check(Permission.DeleteDevice, {
        zoneId: this.zone._id,
      });
    },
    canControlZone(): Boolean {
      return (
        this.$permission.check(Permission.ControlZone) ||
        this.$permission.check(Permission.ControlZone, {
          zoneId: this.zone._id,
        })
      );
    },
    canWriteZone(): Boolean {
      return this.canGeneralWriteZone || this.canWriteAd;
    },
  },
  beforeDestroy() {
    this.$socket.off(`/receive/update/${this.zone._id}/infor-video`);
  },
  methods: {
    onDelete(deletedArray: Ad[]) {
      const deletedIds = deletedArray.map((media) => media._id);

      this.zone.adArray = this.zone.adArray.filter(
        (ad) => !deletedIds.includes(ad._id)
      );
      this.updateNonZoneArray();
    },
    onAdd(addedAds: Ad[]) {
      if (!this.zone.videoArray) this.zone.videoArray = [];
      this.zone.adArray = this.zone.adArray.concat(addedAds);
      this.updateNonZoneArray();
    },
    async updateZone() {
      await this.$handleErrors(async () => {
        this.zone = (
          await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone)
        ).zone;
        this.$toast.success('Sucessfully updated Zone');
      });
    },
    async onUpdateName(newName: string) {
      if (newName === this.zone.name) return;
      const oldName = this.zone.name;
      this.zone.name = newName;
      await this.$handleErrors(
        async () => {
          await this.$axios.$put(this.$apiUrl.zone(this.zone._id), this.zone);
        },
        (_err) => (this.zone.name = oldName)
      );
    },
    updateNonZoneArray(type = 'ad') {
      const captializedType = type.charAt(0).toUpperCase() + type.slice(1);
      const nonZoneKey = `nonZone${captializedType}Array` as `nonZone${Capitalize<ZoneArrayable>}Array`;
      const allKey = `all${captializedType}Array` as `all${Capitalize<ZoneArrayable>}Array`;
      const zoneKey = `${type}Array` as ZoneArrayType;
      const zoneIds = (this.zone[zoneKey] as any[]).map(
        (elem: { _id: string }) => elem._id
      );
      this[nonZoneKey] = (this[allKey] as Array<any>).filter(
        (elem) => !zoneIds.includes(elem._id)
      );
    },
    async onAddDevice(devices: Device[]) {
      for (const device of devices) {
        await this.$handleErrors(async () => {
          await this.$axios.$post(this.$apiUrl.zoneAddDevice, {
            zoneId: this.zone._id,
            deviceId: device._id,
          });
          this.zone.deviceArray.push(device);
        });
      }
      this.updateNonZoneArray('device');
    },
    async onDeleteDevice(devices: Device[]) {
      for (const device of devices) {
        await this.$handleErrors(async () => {
          await this.$axios.$post(this.$apiUrl.zoneDeleteDevice, {
            zoneId: this.zone._id,
            deviceId: device._id,
          });
          this.zone.deviceArray = this.zone.deviceArray.filter(
            (d) => d._id !== device._id
          );
        });
      }
      this.updateNonZoneArray('device');
      this.$axios.$post(this.$apiUrl.videoInfo, {
        zoneId: this.zone._id,
      });
    },
    async onPlayVideo(video: Video) {
      this.warn();
      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName: 'play-video',
          payload: {
            zoneId: this.zone._id,
            videoId: video._id,
          },
        });
      });
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
      await this.$handleErrors(async () => {
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
      });
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
