<template>
  <v-data-table
    :headers="headers"
    hide-default-header
    :items="zones"
    item-key="_id"
    class="elevation-1"
  >
    <template #header>
      <thead>
        <tr>
          <th v-for="hd in headers" :key="hd.text">
            <span class="text-h6">{{ hd.text }}</span>
            <span class="text-subtitle-2">
              {{ hd.metric ? `(${hd.metric})` : '' }}
            </span>
          </th>
        </tr>
      </thead>
    </template>
    <template #item.locationDesc="{ item }">
      {{ item.locationDesc }}
      <ZoneMapDialog class="ml-2" :location="item.location" />
    </template>
    <template #item.priceArray="{ item: { priceArray, pricePerTimePeriod } }">
      <BasePriceCell
        :price-array="priceArray"
        :price-per-time-period="pricePerTimePeriod"
      />
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    zones: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Price', value: 'priceArray', metric: 'VND/s' },
        { text: 'Location', value: 'locationDesc' },
      ],
    };
  },
});
</script>
