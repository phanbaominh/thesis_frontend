<template>
  <v-dialog v-model="dialog" width="500px">
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
      <div style="height: 500px">
        <l-map ref="map" v-resize="onResize" :zoom="20" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker :lat-lng="center"></l-marker>
        </l-map>
      </div>
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
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      dialog: false,
      center: this.location,
    };
  },
  methods: {
    onResize() {
      (this.$refs.map as any).mapObject._onResize();
    },
  },
});
</script>
