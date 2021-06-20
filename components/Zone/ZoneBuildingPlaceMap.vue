<template>
  <div>
    <v-text-field
      ref="input"
      v-model="locationLabel"
      outlined
      dense
      name="location"
      placeholder="Location of zone"
      hint="Search in the text box on the map or double click on map to add a marker"
      persistent-hint
      :error-messages="errorMessages"
    >
    </v-text-field>
    <l-map
      ref="map"
      v-resize="onResize"
      :zoom="zoomLevel"
      :center="center"
      style="height: 400px; z-index: 0"
    >
      <l-tile-layer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        :attribution="attribution"
      ></l-tile-layer>
      <l-marker v-if="marker" :lat-lng="marker"></l-marker>
      <VGeosearch v-if="!disabled" :options="geosearchOptions" />
    </l-map>
  </div>
</template>
<script lang="ts">
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import VGeosearch from 'vue2-leaflet-geosearch';
import Vue from 'vue';
export default Vue.extend({
  components: { VGeosearch },
  props: {
    errorMessages: {
      type: String,
      required: true,
    },
    initMarker: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      geosearchOptions: {
        // Important part Here
        provider: new OpenStreetMapProvider({
          params: {
            countrycodes: 'vn',
          },
        }),
        style: 'bar',
        showMarker: false,
        autoClose: true,
      },
      center: { lat: 11, lng: 107 },
      currentPlace: null as any,
      zoomLevel: this.initMarker ? 20 : 10,
      marker: this.initMarker
        ? this.$L.latLng(this.initMarker) // ({ ...this.initMarker } as { lat: number; lng: number })
        : null,
      locationLabel: '',
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
  computed: {
    locationRules(): ((v: any) => string | boolean)[] {
      const isMarker = !!this.marker;

      return [(v: any) => !!v || isMarker || 'A marker is required'];
    },
  },
  watch: {
    marker() {
      this.$emit('setMarker', this.marker);
    },
  },
  created() {
    if (!this.initMarker) this.geolocate();
    else this.center = this.$L.latLng(this.initMarker);
  },
  mounted() {
    const mapObject = (this.$refs.map as any).mapObject;
    mapObject.on('geosearch/showlocation', (response: any) => {
      this.marker = this.$L.latLng({
        lng: response.location.x,
        lat: response.location.y,
      });

      this.center = this.marker;
      this.locationLabel = response.location.label;
    });

    mapObject.on('dblclick', (e: any) => {
      if (!this.disabled) {
        this.marker = this.$L.latLng({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        this.locationLabel = 'Marked';
      }
    });
  },
  methods: {
    onResize() {
      (this.$refs.map as any).mapObject._onResize();
    },
    onClickMarker() {
      if (this.marker) this.center = this.marker;
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
});
</script>
