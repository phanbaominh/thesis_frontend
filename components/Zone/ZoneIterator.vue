<template>
  <DataIterator
    main-component="ZoneIteratorCardMain"
    type="Zones"
    :init-items="zones"
  >
    <v-btn small depressed fab color="blue" class="align-self-center">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Zone } from 'types/types';
export default Vue.extend({
  props: {
    zones: {
      required: true,
      type: Array,
    } as PropOptions<Zone[]>,
  },
});
</script>
