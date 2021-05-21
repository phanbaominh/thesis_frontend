<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>
        <v-btn small class="mr-2" color="white" depressed @click="onBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        Create a zone
      </v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        :action="$apiUrl.zone"
        method="post"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="zone.name"
          name="name"
          label="Name"
          outlined
          dense
          :rules="[(v) => !!v || 'Name is required']"
        ></v-text-field>
        <ZoneBuildingPlaceMap
          class="mb-2"
          :error-messages="errorMessages"
          @setMarker="onSetMarker"
        >
        </ZoneBuildingPlaceMap>
        <v-text-field
          v-model="zone.locationDesc"
          name="locationDesc"
          label="Description of location"
          outlined
          dense
          :rules="[(v) => !!v || 'Description of location is required']"
        ></v-text-field>
        <v-text-field
          v-model="zone.pricePerTimePeriod"
          name="pricePerTimePeriod"
          label="Price per second"
          outlined
          dense
          type="number"
          :rules="[
            (v) => !!v || 'Price per second is required',
            (v) => (v && v >= 0) || 'Price per second has to be larger than 0',
          ]"
        ></v-text-field>
        <BaseSubmitActions> Create </BaseSubmitActions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from '~/types/types';
export default Vue.extend({
  props: {},
  data() {
    return {
      valid: false,
      zone: {
        name: '',
        location: null as { lat: number; lng: number } | null,
        locationDesc: '',
        pricePerTimePeriod: 0,
      } as Zone,
      errorMessages: '',
    };
  },
  methods: {
    async onSubmit() {
      if (!(this.$refs.form as any).validate()) return;
      if (!this.zone.location) {
        this.errorMessages = 'A marker is required';
        return;
      }
      await this.$handleErrors(async () => {
        const newZone = (
          await this.$axios.$post(this.$apiUrl.zones, { ...this.zone })
        ).zone as Zone;
        this.$router.push(`/zones/${newZone._id}`);
      });
    },
    onSetMarker(marker: { lat: number; lng: number }) {
      this.errorMessages = '';
      this.zone.location = marker;
    },
    onBack() {
      this.$router.push('/zones');
    },
  },
});
</script>
