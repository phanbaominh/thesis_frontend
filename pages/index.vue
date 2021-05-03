<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" lg="6"> <UserProfile /></v-col>
      <v-col cols="12" lg="6">
        <v-card class="pb-4">
          <v-card-title>Device report: {{ devices.length }} total</v-card-title>
          <DashboardChart
            :key="updateChart"
            :loaded="!$fetchState.pending && !$fetchState.error"
            :chart-data="chartData"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-card>
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

          <template #item.zoneId="{ item }">
            {{ item.zoneId || 'None' }}
          </template>
        </v-data-table>
      </BaseFetcher>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import UserProfile from '~/components/UserProfile.vue';
import { Device, ZoneDeviceLog } from '~/types/types';
export default Vue.extend({
  components: { UserProfile },
  data() {
    return {
      devices: [] as Device[],
      headers: [
        { text: 'Device Name', value: 'name' },
        { text: 'Zone Id', value: 'zoneId' },
        { text: 'Status', value: 'status' },
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
    console.log(this.$auth.user);
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
