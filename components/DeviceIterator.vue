<template>
  <DataIterator
    main-component="DataIteratorCardMain"
    type="Devices"
    :init-items="devices"
  >
    <BaseButtonToolbar icon="plus" />
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
