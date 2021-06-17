<template>
  <v-data-table
    :headers="headers"
    :items="deviceTableData"
    :search="search"
    class="elevation-3"
  >
    <template #top>
      <v-toolbar dark color="blue darken-3" class="mb-1">
        <v-row
          :class="{
            'mt-2': $vuetify.breakpoint.width < 300,
          }"
        >
          <v-card-title class="text-subtitle-1 text-sm-h6">
            {{ `Devices: ${deviceTableData.length}` }}
          </v-card-title>
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
                :color="'blue'"
                class="align-self-center mr-2"
                :small="!$vuetify.breakpoint.xs"
                :x-small="$vuetify.breakpoint.xs"
                dark
                nuxt
                to="/devices/create"
                v-bind="attrs"
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
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <v-col :cols="$vuetify.breakpoint.xsOnly ? 5 : 6" md="3">
            <v-text-field
              v-if="$vuetify.breakpoint.smAndUp"
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-text-field
        v-if="!$vuetify.breakpoint.smAndUp"
        v-model="search"
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
    </template>
    <template #header.avgViews>
      <th title="Average views per video shown">Average views</th>
    </template>
    <!-- <template #item.name="{ item: device }">
      <DeviceLink :device="device" />
    </template> -->
    <template #item.actions="{ item: device }">
      <BaseTableAction
        :icon="device.isPause ? 'play' : 'pause'"
        @delete="onPlay(device)"
      />
      <!-- <BaseTableAction icon="delete" @delete="onDelete(device._id)" /> -->
    </template>
    <template #item.cost="{ item: { cost } }">
      {{ $utils.moneyFormat(cost) }}
    </template>
    <template #item.avgViews="{ item: { avgViews } }">
      {{ avgViews.toFixed(2) }}
    </template>
    <template #item.media="{ item: device }">
      {{ `${device.media ? device.media.name : 'None'}` }}
      <MediaTabItemPlayDialog
        v-if="device.media"
        class="ml-2"
        :media="device.media"
      />
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { Device, DeviceTableRow, Permission, Zone } from '~/types/types';
export default Vue.extend({
  props: {
    initZone: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Zone>,
    initDeviceTableData: {
      type: Array,
      required: true,
    } as Vue.PropOptions<DeviceTableRow[]>,
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Profit',
          value: 'cost',
        },
        {
          text: 'Views',
          value: 'views',
        },
        {
          text: 'Ad',
          value: 'ad',
        },
        // {
        //   text: 'Profit per view',
        //   value: 'costPerView',
        // },
        {
          text: 'Average view',
          value: 'avgViews',
        },
        // {
        //   text: 'Average run time',
        //   value: 'avgRunTime',
        // },
        // {
        //   text: 'Location',
        //   value: 'location',
        // },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      search: '',
      nonZoneDeviceArray: [] as Device[],
      allDeviceArray: [] as Device[],
      deviceTableData: this.initDeviceTableData,
      deviceDialog: false,
      zone: this.initZone,
    };
  },
  async fetch() {
    this.allDeviceArray = (
      await this.$axios.$get(this.$apiUrl.devices)
    ).devices.filter((device: Device) => !device.zoneId);

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
  },
  watch: {
    initDeviceTableData() {
      this.deviceTableData = this.initDeviceTableData;
    },
  },
  methods: {
    // async onDelete(deletedDeviceId: string) {
    //   await this.$handleErrors(async () => {
    //     await this.$axios.$delete(this.$apiUrl.device(deletedDeviceId));
    //     this.deviceTableData = this.deviceTableData.filter(
    //       (device) => deletedDeviceId !== device._id
    //     );
    //     this.$toast.success('Succesfully deleted device!');
    //   });
    // },
    async onPlay(device: DeviceTableRow) {
      console.log(device.name);
      await Promise.resolve();
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
      this.updateNonZoneArray();
    },
    updateNonZoneArray() {
      const zoneIds = this.zone.deviceArray.map(
        (elem: { _id: string }) => elem._id
      );
      this.nonZoneDeviceArray = (this.allDeviceArray as Array<any>).filter(
        (elem) => !zoneIds.includes(elem._id)
      );
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
      this.updateNonZoneArray();
      this.$axios.$post(this.$apiUrl.videoInfo, {
        zoneId: this.zone._id,
      });
    },
  },
});
</script>
