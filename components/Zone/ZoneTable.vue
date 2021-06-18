<template>
  <v-data-table
    :headers="headers"
    :items="zoneTableData"
    :search="search"
    class="elevation-3"
    item-key="_id"
  >
    <template #top>
      <v-toolbar dark color="blue darken-3" class="mb-1">
        <v-row
          :class="{
            'mt-2': $vuetify.breakpoint.width < 300,
          }"
        >
          <v-card-title class="text-subtitle-1 text-sm-h6">
            {{ `Zones: ${zoneTableData.length}` }}
          </v-card-title>
          <v-btn
            depressed
            fab
            :color="'blue'"
            class="align-self-center mr-2"
            :small="!$vuetify.breakpoint.xs"
            :x-small="$vuetify.breakpoint.xs"
            dark
            nuxt
            to="/zones/create"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-col :cols="$vuetify.breakpoint.xsOnly ? 5 : 6" md="3">
            <v-text-field
              v-if="$vuetify.breakpoint.smAndUp"
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-text-field
        v-if="!$vuetify.breakpoint.smAndUp"
        v-model="search"
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
    </template>
    <template #header.avgViews>
      <th title="Average views per video shown">Average views</th>
    </template>
    <template #item.name="{ item: zone }">
      <ZoneLink :zone="zone" />
    </template>
    <template #item.actions="{ item: zone }">
      <ZoneTableActions :zone="zone" @delete="onDelete" />
    </template>
    <template #item.cost="{ item: { cost } }">
      {{ $utils.moneyFormat(cost) }}
    </template>
    <template #item.avgViews="{ item: { avgViews } }">
      {{ avgViews.toFixed(2) }}
    </template>
    <template #item.location="{ item: zone }">
      {{ `${zone.locationDesc}` }}
      <lazy-zone-map-dialog class="ml-2" :location="zone.location" />
    </template>
    <template #item.pricePerTimePeriod="{ item: { pricePerTimePeriod } }">
      {{ $utils.moneyFormat(pricePerTimePeriod) }}
    </template>
    <template #item.adCount="{ item: { adArray } }">
      {{ adArray.length }}
    </template>
    <template #item.deviceCount="{ item: { deviceArray } }">
      {{ deviceArray.length }}
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdTableRow } from '~/types/types';
export default Vue.extend({
  props: {
    initZoneTableData: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AdTableRow[]>,
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Profit',
          value: 'cost',
        },
        {
          text: 'Views',
          value: 'views',
        },
        {
          text: 'Ads',
          value: 'adCount',
        },
        {
          text: 'Price per second',
          value: 'pricePerTimePeriod',
        },
        // {
        //   text: 'Profit per view',
        //   value: 'costPerView',
        // },
        {
          text: 'Average view',
          value: 'avgViews',
        },
        // {
        //   text: 'Average run time',
        //   value: 'avgRunTime',
        // },
        {
          text: 'Devices',
          value: 'deviceCount',
        },
        {
          text: 'Location',
          value: 'location',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      search: '',
      zoneTableData: this.initZoneTableData,
    };
  },
  watch: {
    initZoneTableData() {
      this.zoneTableData = this.initZoneTableData;
    },
  },
  methods: {
    async onDelete(deletedZoneId: string) {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.zone(deletedZoneId));
        this.zoneTableData = this.zoneTableData.filter(
          (zone) => deletedZoneId !== zone._id
        );
        this.$toast.success('Succesfully deleted zone!');
      });
    },
  },
});
</script>
