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
      <AdLink :ad="ad" />
    </template>
    <template #item.status="{ item: ad }">
      <AdCardStatus
        :status="ad.status"
        class="ml-2"
        :time-status="ad.timeStatus"
      />
    </template>
    <template #item.actions="{ item: ad }">
      <AdTableAction
        :init-ad="ad"
        :is-bd="isBd"
        :to="`ads/${ad._id}`"
        @delete="onDelete"
        @cancel="onCancel"
      />
    </template>
    <template #header.avgRunTime>
      <th title="Average run time of video shown">Average run times</th>
    </template>
    <template #header.avgViews>
      <th title="Average views per video shown">Average views</th>
    </template>
    <template #item.cost="{ item: { cost } }">
      {{ $utils.moneyFormat(cost) }}
    </template>
    <template #item.remainingBudget="{ item: { remainingBudget } }">
      {{ $utils.moneyFormat(remainingBudget) }}
    </template>
    <template #item.costPerView="{ item: { cost, views } }">
      {{ $utils.moneyFormat(cost / (views || 1)) }}
    </template>
    <template #item.timeCreate="{ item }">
      {{ $utils.timeFormat(item.timeCreate) }}
    </template>
    <template #item.avgViews="{ item: { avgViews } }">
      {{ avgViews.toFixed(2) }}
    </template>
    <template #item.avgRunTime="{ item: { avgRunTime } }">
      <span>{{ avgRunTime.toFixed(2) }}</span>
    </template>
    <template #item.bdManager="{ item: { bdManagerId } }">
      {{ bdManagerId.username }}
    </template>
    <template #item.adset="{ item: { adSetId } }">
      <AdLinkAdset :adset="adSetId" />
    </template>
    <template #item.content="{ item: { contentId } }">
      {{ contentId.name }}
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad, AdTableRow } from '~/types/types';
export default Vue.extend({
  props: {
    initAdTableData: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AdTableRow[]>,
    isBd: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Cost',
          value: 'cost',
        },
        {
          text: 'Remaining budget',
          value: 'remainingBudget',
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
        {
          text: 'Creation time',
          value: 'timeCreate',
        },
        {
          text: 'Cost per view',
          value: 'costPerView',
        },
        {
          text: 'Average view',
          value: 'avgViews',
        },
        {
          text: 'Average run time',
          value: 'avgRunTime',
        },
        {
          text: 'Building Manager',
          value: 'bdManager',
        },
        {
          text: 'Content',
          value: 'content',
        },
        {
          text: 'Adset',
          value: 'adset',
        },
        {
          text: 'Actions',
          value: 'actions',
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
  methods: {
    onDelete(deletedAd: Ad) {
      this.adTableData = this.adTableData.filter(
        (ad) => ad._id !== deletedAd._id
      );
    },
    onCancel(canceledAd: Ad) {
      const foundAd = this.adTableData.find((ad) => ad._id === canceledAd._id);
      foundAd!.status = canceledAd.status;
    },
  },
});
</script>
