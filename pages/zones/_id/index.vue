<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <v-card-title class="text-subtitle-1 text-sm-h6">
          {{ zone.name }}
        </v-card-title>
        <v-btn
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          nuxt
          :to="`${zone._id}/edit`"
          dark
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <!-- <v-btn
          depressed
          fab
          color="blue"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          @click="onPlayZone"
        >
          <v-icon> mdi-play </v-icon>
        </v-btn> -->
        <v-spacer></v-spacer>
        <v-dialog
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
              <v-icon>mdi-account-key</v-icon>
            </v-btn>
          </template>
          <v-card class="cards pa-4">
            <BaseDialogTitle @close="deviceDialog = false">
              Granted Permissions
            </BaseDialogTitle>
            <v-card>
              <ZonePermIterator :zone-id="zone._id" />
            </v-card>
          </v-card>
        </v-dialog>
        <!-- <BaseButtonToolbar
          v-if="canWriteZone"
          icon="sync"
          @click="updateZone"
        /> -->
      </v-row>
    </v-toolbar>
    <!-- <v-row class="mt-2">
      <v-col cols="12" lg="6">
        <ZoneMediaControl
          class="cards"
          :zone="zone"
          :playlist-videos="playlistVideos"
          :control-perm="canControlZone"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col v-if="canReadAd" cols="12" lg="6"> </v-col>
    </v-row> -->
    <v-card class="mt-10">
      <ZoneDeviceTable :init-zone="zone" />
    </v-card>
    <v-card class="mt-10">
      <!-- <DataIterator type="Ads" :init-items="zone.adArray" compact>
        <template #main="{ items: displayedAdArray }">
          <MediaList :items="displayedAdArray">
            <template #default="{ item: ad }">
              <v-list-item-title
                class="text-subtitle-1 text-sm-h6 font-weight-regular"
              >
                <BuildingAdLink :ad="ad" />
                <v-chip v-if="isEmpty(ad)" color="red" text-color="white">
                  {{ ad.status }}
                </v-chip>
              </v-list-item-title>
            </template>
          </MediaList>
        </template>
      </DataIterator> -->
      <ZoneAdTable :zone="zone" />
    </v-card>
    <v-card class="mt-10">
      <v-card-title>Device Log (past 24h)</v-card-title>
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
  Video,
  Zone,
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
      .adOffers as Ad[]).filter(
      (ad) => ad.status === AdStatus.Deployed || ad.status === AdStatus.Empty
    );
  },
  computed: {
    canGeneralReadZone(): Boolean {
      return this.$permission.canGeneralReadZone();
    },
    canGeneralWriteZone(): Boolean {
      return this.$permission.canGeneralWriteZone();
    },
    canReadAd(): Boolean {
      return (
        this.canGeneralReadZone ||
        this.$permission.check(this.$permission.AdPermissions, {
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
    isEmpty(ad: Ad): boolean {
      return ad.status === AdStatus.Empty;
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
    warn() {
      if (!this.$accessor.isSocketConnected) {
        this.$toast.info('Need a socket connection to server');
      } else if (this.zone.deviceArray.length === 0) {
        this.$toast.info('Please add device to zone');
      }
    },
    async onPlayZone() {
      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName: 'play-video-auto',
          payload: {
            zoneId: this.zone._id,
          },
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
