<template>
  <l-map
    ref="map"
    v-resize="onResize"
    :zoom="13"
    :center="[47.41322, -1.219482]"
  >
    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
    <l-marker :lat-lng="[47.41322, -1.219482]"></l-marker>
    <VGeosearch :options="geosearchOptions" @showlocation="onShowLocation" />
  </l-map>
</template>
<script lang="ts">
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import VGeosearch from 'vue2-leaflet-geosearch';

import Vue from 'vue';
export default Vue.extend({
  components: { VGeosearch },
  data() {
    return {
      geosearchOptions: {
        // Important part Here
        provider: new OpenStreetMapProvider(),
        style: 'bar',
      },
    };
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://unpkg.com/leaflet-geosearch@2.6.0/assets/css/leaflet.css',
        },
      ],
    };
  },
  mounted() {
    (this.$refs.map as any).mapObject.on(
      'geosearch/showlocation',
      (response: any) => {
        console.log(response);
      }
    );
  },
  methods: {
    onResize() {
      (this.$refs.map as any).mapObject._onResize();
    },
    onShowLocation(e: any) {
      console.log('abc', e);
    },
  },
});
</script>
