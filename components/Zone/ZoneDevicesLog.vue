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
      ],
      devicesLog: [] as ZoneDeviceLog[],
    };
  },
  created() {
    this.$socket.on(
      `/recive/update/${this.zone._id}/infor-video`,
      (payload) => {
        console.log('log', payload);
        this.newDeviceLog(payload);
      }
    );
  },
  methods: {
    newDeviceLog(zoneInfo: ZoneInfo) {
      const name =
        this.zone.deviceArray.find((device) => device._id === zoneInfo.deviceId)
          ?.name || 'None';
      const mediaName =
        this.zone.videoArray.find((video) => video._id === zoneInfo.videoId)
          ?.name || 'None';
      this.devicesLog.push({ name, mediaName });
    },
  },
});
</script>
