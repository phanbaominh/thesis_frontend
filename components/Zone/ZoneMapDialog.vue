<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" x-small fab depressed v-bind="attrs" v-on="on">
        <v-icon>mdi-map</v-icon>
      </v-btn>
    </template>
    <v-card>
      <BaseDialogTitle @close="dialog = false"> Zone location </BaseDialogTitle>
      <!-- <GmapMap
        :center="center"
        :zoom="20"
        :options="{ gestureHandling: 'none', zoomControl: false }"
        style="width: 100%; height: 400px"
        class="mt-2"
      >
        <GmapMarker :position="center" />
      </GmapMap> -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      center: this.location,
    };
  },
});
</script>
