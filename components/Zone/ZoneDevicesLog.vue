<template>
  <v-data-table
    :headers="headers"
    :items="devicesLog"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Zone, ZoneDeviceLog, ZoneInfo } from '~/types/types';
export default Vue.extend({
  props: {
    zone: {
      type: Object,
      required: true,
    } as PropOptions<Zone>,
  },
  data() {
    return {
      headers: [
        { text: 'Device Name', value: 'name' },
        { text: 'Media Name', value: 'mediaName' },
        { text: 'Ad Name', value: 'adName' },
        { text: 'Time start', value: 'timeStart' },
        { text: 'Status', value: 'status' },
      ],
      devicesLog: [] as ZoneDeviceLog[],
    };
  },
  async fetch() {
    const rawLogs = (
      await this.$axios.$get(this.$apiUrl.zoneLogs(this.zone._id))
    ).logs as {
      _id: string;
      adOfferId: { name: string; _id: string };
      videoId: { name: string };
      deviceId: { name: string };
      timeStart: number;
    }[];
    this.devicesLog = rawLogs.map((log) => ({
      _id: log._id,
      timeStart: this.$utils.timeFormat(log.timeStart),
      adName: log.adOfferId.name,
      mediaName: log.videoId.name,
      name: log.deviceId.name,
      status: 'Played',
    }));
  },
  created() {
    this.$socket.on(
      `/receive/update/${this.zone._id}/infor-video`,
      this.newDeviceLog
    );
  },
  beforeDestroy() {
    this.$socket.off(
      `/receive/update/${this.zone._id}/infor-video`,
      this.newDeviceLog
    );
  },
  methods: {
    newDeviceLog(zoneInfo: ZoneInfo) {
      const name =
        this.zone.deviceArray.find((device) => device._id === zoneInfo.deviceId)
          ?.name || 'None';
      const mediaName = zoneInfo.media ? zoneInfo.mediaName : 'None';
      this.devicesLog.unshift({
        name,
        mediaName,
        status: zoneInfo.media ? 'Played' : 'Stopped',
        timeStart: this.$utils.timeFormat(zoneInfo.timeStart),
        adName: zoneInfo.adName,
      });
    },
  },
});
</script>
