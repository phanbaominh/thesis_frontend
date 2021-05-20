<template>
  <div>
    <GmapAutocomplete
      :options="{
        fields: ['geometry', 'formatted_address', 'address_components'],
      }"
      @place_changed="setPlace"
    />
    <button @click="addMarker">Add</button>
    <GmapMap :center="center" :zoom="12" style="width: 100%; height: 400px"
      ><GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.position"
        @click="center = m.position"
    /></GmapMap>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null as any,
      markers: [] as any[],
      places: [] as any[],
    };
  },
  methods: {
    setPlace(place: any) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
  },
});
</script>
