<template>
  <BaseVolumeControl
    v-bind="device"
    :control-perm="controlPerm"
    @change="videoControlRequest"
  />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    device: {
      type: Object,
      required: true,
    },
    controlPerm: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    async videoControlRequest({
      eventName,
      payload,
    }: {
      eventName: string;
      payload?: { [key: string]: any };
    }) {
      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControlDevice, {
          eventName,
          payload: {
            deviceId: this.device.deviceId,
            ...payload,
          },
        });
      });
    },
  },
});
</script>
