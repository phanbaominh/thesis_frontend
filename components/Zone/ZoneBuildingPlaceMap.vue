<template>
  <div>
    <GmapAutocomplete
      :options="{
        fields: ['geometry', 'formatted_address', 'address_components'],
      }"
      @place_changed="setPlace"
    >
      <template #input="{ attrs, listeners }">
        <v-row>
          <v-col>
            <v-text-field
              ref="input"
              outlined
              dense
              name="location"
              placeholder="Location of zone"
              hint="Search or right click on map to select location"
              persistent-hint
              :error-messages="errorMessages"
              @attrs="attrs"
              @listeners="listeners"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-btn :disabled="!currentPlace" @click="onAddMarker">
              Add Marker
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </GmapAutocomplete>

    <GmapMap
      :center="center"
      :zoom="zoomLevel"
      style="width: 100%; height: 400px"
      class="mt-2"
      @rightclick="onRightClickMap"
    >
      <GmapMarker v-if="marker" :position="marker" @click="onClickMarker" />
    </GmapMap>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    errorMessages: {
      type: String,
      required: true,
    },
    initMarker: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      center: { lat: 0, lng: 0 },
      currentPlace: null as any,
      zoomLevel: this.initMarker ? 20 : 12,
      marker: this.initMarker
        ? ({ ...this.initMarker } as { lat: number; lng: number })
        : null,
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
  mounted() {
    if (!this.initMarker) this.geolocate();
    else this.center = { ...this.initMarker };
  },
  methods: {
    setPlace(place: any) {
      this.currentPlace = place;
    },
    onAddMarker() {
      if (this.currentPlace) {
        this.marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.center = this.marker;
        this.zoomLevel = 20;
      }
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
    onRightClickMap(mouseArgs: any) {
      this.marker = {
        lat: mouseArgs.latLng.lat(),
        lng: mouseArgs.latLng.lng(),
      };
    },
  },
});
</script>
