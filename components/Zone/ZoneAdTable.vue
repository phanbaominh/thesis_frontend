<template>
  <v-data-table
    :headers="headers"
    :items="adTableData"
    :search="search"
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
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdTableRow } from '~/types/types';
export default Vue.extend({
  props: {
    initAdTableData: {
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
          text: 'Run time',
          value: 'runTime',
        },
      ],
      search: '',
      adTableData: this.initAdTableData,
    };
  },
  watch: {
    initAdTableData() {
      this.adTableData = this.initAdTableData;
    },
  },
});
</script>
