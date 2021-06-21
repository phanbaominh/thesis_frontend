<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>
        <BaseBackButton @click="onBack"> </BaseBackButton>
        {{ initZone ? `Update zone ${initZone.name}` : 'Create a zone' }}
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
          :init-marker="zone.location"
          :disabled="hasAds"
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
        <!-- <v-text-field
          v-model="zone.pricePerTimePeriod"
          name="pricePerTimePeriod"
          label="Price per second"
          outlined
          dense
          type="number"
          :disabled="hasAds"
          :rules="[
            (v) => !!v || 'Price per second is required',
            (v) => (v && v >= 0) || 'Price per second has to be larger than 0',
          ]"
        ></v-text-field> -->
        <ZoneFormPrice
          :is-disabled="hasAds"
          :init-prices="zone.priceArray"
          @change="zone.priceArray = $event"
        />
        <BaseSubmitActions>
          {{ initZone ? 'Update' : 'Create' }}
        </BaseSubmitActions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from '~/types/types';
export default Vue.extend({
  props: {
    initZone: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: false,
      zone: {
        name: '',
        location: null as { lat: number; lng: number } | null,
        locationDesc: '',
        pricePerTimePeriod: 0,
        priceArray: [],
        ...this.initZone,
      } as Zone,
      errorMessages: '',
    };
  },
  computed: {
    hasAds(): boolean {
      return this.initZone && this.initZone.adArray.length > 0;
    },
  },
  methods: {
    async onSubmit() {
      if (!(this.$refs.form as any).validate()) return;
      if (!this.zone.location) {
        this.errorMessages = 'A marker is required';
        return;
      }
      this.zone.pricePerTimePeriod = this.zone.priceArray.find(
        (price) => price.desc === 'Normal hours'
      )?.value;
      await this.$handleErrors(async () => {
        const newZone = this.initZone
          ? ((
              await this.$axios.$put(
                this.$apiUrl.zone(this.initZone._id),
                this.zone
              )
            ).zone as Zone)
          : ((await this.$axios.$post(this.$apiUrl.zones, this.zone))
              .zone as Zone);
        this.$toast.success(
          `You have successfully ${
            this.initZone ? 'updated' : 'created a'
          } zone`
        );
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
