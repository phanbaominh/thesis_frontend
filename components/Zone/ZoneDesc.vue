<template>
  <v-list>
    <v-list-item v-for="(value, key) in zoneDesc" :key="key">
      <v-list-item-title>
        <span class="font-weight-bold mr-1">{{ key + ':' }}</span>
        {{ `${value}` }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-title>
        <span class="font-weight-bold mr-1">Location:</span>
        {{ `${zone.locationDesc}` }}
        <ZoneMapDialog class="ml-2" :location="zone.location" />
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from '~/types/types';
export default Vue.extend({
  props: {
    zone: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Zone>,
  },
  computed: {
    zoneDesc(): { [key: string]: string } {
      return {
        'Price per second': `${this.zone.pricePerTimePeriod.toString()} VND/s`,
      };
    },
  },
});
</script>
