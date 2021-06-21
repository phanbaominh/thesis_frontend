<template>
  <v-dialog v-model="dialog" width="500px">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" x-small fab depressed v-bind="attrs" v-on="on">
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
    </template>
    <v-card>
      <BaseDialogTitle @close="dialog = false"> Price table </BaseDialogTitle>
      <!-- <GmapMap
        :center="center"
        :zoom="20"
        :options="{ gestureHandling: 'none', zoomControl: false }"
        style="width: 100%; height: 400px"
        class="mt-2"
      >
        <GmapMarker :position="center" />
      </GmapMap> -->
      <BasePriceTable :prices="prices" />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { ZonePrice } from '~/types/types';
export default Vue.extend({
  props: {
    prices: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ZonePrice[]>,
  },
  data() {
    return {
      dialog: false,
    };
  },
});
</script>
