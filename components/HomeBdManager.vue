<template>
  <div>
    <HomeOverview
      :link="$apiUrl.bdAnalyticsOverview"
      cost-header-text="Profit"
      class="mb-4"
      name-key="Zone"
    >
      <template #link="{ item: zone }">
        <ZoneLink :zone="zone" />
      </template>
    </HomeOverview>
    <v-row>
      <v-col cols="12" lg="6">
        <v-card v-if="$permission.canGeneralReadDevice()">
          <v-card-title>Device report</v-card-title>
          <BaseFetcher :fetch-state="$fetchState">
            <v-data-table
              :headers="headers"
              :items="devices"
              :items-per-page="5"
              class="elevation-1"
            >
              <template #item.status="{ item }">
                <div :class="item.status ? 'green--text' : 'red--text'">
                  <span>{{ item.status ? 'Online' : 'Offline' }}</span>
                  <v-icon></v-icon>
                </div>
              </template>
              <template #item.zone="{ item }">
                {{ item.zoneId.name || 'None' }}
              </template>
              <template #item.timeStatusChange="{ item }">
                {{ $utils.timeFormat(item.timeStatusChange) }}
              </template>
            </v-data-table>
          </BaseFetcher>
        </v-card></v-col
      ><v-col cols="12" lg="6">
        <v-card v-if="$permission.canGeneralReadDevice()" class="pb-4">
          <v-card-title>Device report: {{ devices.length }} total</v-card-title>
          <DashboardChart
            :key="updateChart"
            :loaded="!$fetchState.pending && !$fetchState.error"
            :chart-data="chartData"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Device, ZoneDeviceLog } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      devices: [] as Device[],
      headers: [
        { text: 'Device Name', value: 'name' },
        { text: 'Zone', value: 'zone' },
        { text: 'Status', value: 'status' },
        { text: 'Time status change', value: 'timeStatusChange' },
      ],
      devicesLog: [] as ZoneDeviceLog[],
      chartData: {},
      updateChart: false,
    };
  },
  async fetch() {
    this.devices = (await this.$axios.$get(this.$apiUrl.devices)).devices;
  },
  watch: {
    devices() {
      const numOfConnected = this.devices.filter((device) => device.status)
        .length;
      const numOfDisconnected = this.devices.length - numOfConnected;
      this.chartData = {
        labels: [`Offline`, `Online`],
        datasets: [
          {
            label: 'Device status',
            data: [numOfDisconnected, numOfConnected],
            backgroundColor: ['rgb(220, 53, 69)', '#4CAF50'],
            hoverOffset: 4,
          },
        ],
      };
      this.updateChart = !this.updateChart;
    },
  },
  created() {
    this.$socket.on('/receive/update/socket/disconnect', (device) => {
      this.replaceDevice(device);
    });
    this.$socket.on('/receive/update/socket/connect', (device) => {
      this.replaceDevice(device);
    });
  },
  beforeDestroy() {
    this.$socket.off('/receive/update/socket/disconnect');
    this.$socket.off('/receive/update/socket/connect');
  },
  methods: {
    replaceDevice(device: Device) {
      const index = this.devices.findIndex((d) => d._id === device._id);
      this.$set(this.devices, index, device);
    },
  },
});
</script>
