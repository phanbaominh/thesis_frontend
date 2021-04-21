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
import { ZoneDeviceLog } from '~/types/types';
export default Vue.extend({
  props: {
    devicesLog: {
      required: true,
      type: Array,
    } as PropOptions<ZoneDeviceLog[]>,
  },
  data() {
    return {
      headers: [
        { text: 'Device Name', value: 'name' },
        { text: 'Media Name', value: 'name' },
      ],
    };
  },
});
</script>
