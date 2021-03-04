<template>
  <DataIterator
    main-component="DeviceIteratorMain"
    type="Devices"
    :init-items="devices"
  >
    <slot></slot>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Device } from 'types/types';
export default Vue.extend({
  props: {
    devices: {
      required: true,
      type: Array,
    } as PropOptions<Device[]>,
  },
});
</script>
