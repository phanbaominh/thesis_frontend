<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="6">
        <v-card class="pb-4">
          <v-card-title>Device report: {{ devices.length }} total</v-card-title>
          <DashboardChart
            :loaded="!$fetchState.pending && !$fetchState.error"
            :chart-data="chartData"
          />
        </v-card>
      </v-col>
      <v-col cols="6"></v-col>
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
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.status="{ item }">
            <div :class="item.status ? 'green--text' : 'red--text'">
              <span>{{ item.status ? 'Online' : 'Offline' }}</span>
              <v-icon></v-icon>
            </div>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
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
import { Device, ZoneDeviceLog } from '~/types/types';
export default Vue.extend({
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
    };
  },
  async fetch() {
    this.devices = (await this.$axios.$get(this.$apiUrl.devices)).devices;
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
  },
});
</script>
