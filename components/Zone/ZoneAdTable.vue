<template>
  <v-data-table
    :headers="headers"
    :items="adTableData"
    :search="search"
    item-key="_id"
    :loading="loading"
    class="elevation-3"
  >
    <template #top>
      <v-toolbar dark color="blue darken-3" class="mb-1">
        <v-row
          :class="{
            'mt-2': $vuetify.breakpoint.width < 300,
          }"
        >
          <v-card-title class="text-subtitle-1 text-sm-h6">
            {{ `Ads: ${adTableData.length}` }}
          </v-card-title>
          <slot></slot>
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
    <template #item.name="{ item: ad }">
      <BuildingAdLink :ad="ad" />
    </template>
    <template #item.cost="{ item: { cost } }">
      {{ $utils.moneyFormat(cost) }}
    </template>
    <template #item.status="{ item: ad }">
      <AdCardStatus
        :status="ad.status"
        class="ml-2"
        :time-status="ad.timeStatus"
      />
    </template>
  </v-data-table>
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
          text: 'Run time',
          value: 'runTime',
        },
        {
          text: 'Status',
          value: 'status',
        },
      ],
      search: '',
      adTableData: [],
      loading: true,
    };
  },
  async fetch() {
    this.adTableData = (
      await this.$axios.$get(this.$apiUrl.zoneAdTable(this.zone._id))
    ).adOffers;
    this.loading = false;
  },
});
</script>
