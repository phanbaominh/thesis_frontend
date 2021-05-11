<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching adsets... </template>
    <DataIterator :type="'Adsets'" :init-items="adsets" :compact="false">
      <AdsetForm title="Create an adset:" :dialog="newDialog" @submit="onNew" />
      <template #main="{ items: displayedAdsets }">
        <v-row class="mt-2">
          <v-col
            v-for="adset in displayedAdsets"
            :key="adset._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AdsetCard :init-adset="adset" @delete="onDelete(adset)" />
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Adset } from '~/types/types';
export default Vue.extend({
  middleware: 'checkUserIsAdManager',
  auth: false,
  data() {
    return {
      adsets: [
        // {
        //   _id: '123',
        //   name: 'test',
        //   ages: { value: [1, 2, 3], strict: true },
        //   genders: { value: [10], strict: true },
        //   daysOfWeek: { value: [1, 2], strict: true },
        //   hoursOfDay: {
        //     value: [1, 2],
        //     strict: false,
        //   },
        // },
      ] as Adset[],
      newDialog: false,
    };
  },
  async fetch() {
    this.adsets = (await this.$axios.$get(this.$apiUrl.adsets)).adsets;
  },
  methods: {
    async onNew(adset: Adset) {
      try {
        await this.$axios.$post(this.$apiUrl.adsets, adset);
        this.newDialog = !this.newDialog;
        this.adsets.push(adset);
      } catch (err) {}
    },
    onDelete(adset: Adset) {
      this.adsets = this.adsets.filter((a) => a._id !== adset._id);
    },
  },
});
</script>
