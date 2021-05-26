<template>
  <AdDetailed :ad="ad">
    <template #top-left>
      <v-btn
        v-if="isIdle"
        class="ml-2"
        color="primary"
        x-small
        fab
        depressed
        nuxt
        :to="`/ads/${ad._id}/edit`"
        @click.native.stop
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <template #top-right>
      <v-btn
        :fab="$vuetify.breakpoint.smAndDown"
        depressed
        small
        :disabled="!isAnalyzable"
        color="primary"
        nuxt
        :to="`/analytics/ad?adOffer=${ad._id}`"
      >
        <v-icon>mdi-chart-line</v-icon>
        <span v-if="!$vuetify.breakpoint.smAndDown">Analytics</span>
      </v-btn>
    </template>
    <template #append>
      <v-card-actions>
        <v-spacer></v-spacer>
        <AdDetailedActionDialog v-if="isIdle" @confirm="onSend">
          <template #name>Send</template>
          Do you want to send this ad?
        </AdDetailedActionDialog>
        <AdDetailedRedeployForm
          v-if="isEmpty"
          :ad="ad"
          :dialog="dialog"
          @redeploy="onRedeploy"
        />
        <AdDetailedActionDialog v-if="isCancelable" @confirm="onCancel">
          <template #name>Cancel</template>
          Do you want to cancel this ad?
        </AdDetailedActionDialog>
        <AdDetailedActionDialog v-if="isDeletable" @confirm="onDelete">
          <template #name>Delete</template>
        </AdDetailedActionDialog>
      </v-card-actions>
    </template>
  </AdDetailed>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus, DetailedAd } from '~/types/types';
export default Vue.extend({
  async asyncData({ route, $axios, $apiUrl }) {
    const ad = (await $axios.$get($apiUrl.adDetailed(route.params.id))).adOffer;
    return { ad };
  },
  data() {
    return {
      ad: (null as any) as DetailedAd,
      dialog: false,
    };
  },
  computed: {
    isAnalyzable(): boolean {
      return (
        this.ad.status === AdStatus.Deployed ||
        this.ad.status === AdStatus.Finished
      );
    },
    isIdle(): boolean {
      return this.ad.status === AdStatus.Idle;
    },
    isEmpty(): boolean {
      return this.ad.status === AdStatus.Empty;
    },
    isDeletable(): boolean {
      return this.isIdle || this.ad.status === AdStatus.Finished;
    },

    isCancelable(): boolean {
      return (
        this.ad.status === AdStatus.Pending ||
        this.ad.status === AdStatus.Deployed ||
        this.isEmpty
      );
    },
  },
  methods: {
    async onSend() {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusSend(this.ad._id));
        this.ad.status = AdStatus.Pending;
      });
    },
    async onRedeploy(budget: number) {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusRedeploy(this.ad._id), {
          budget,
        });
        this.ad.status = AdStatus.Deployed;
      });
    },
    async onCancel() {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusCancel(this.ad._id))
        ).status as AdStatus;
        this.ad.status = newStatus;
      });
    },
    async onDelete() {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.ad(this.ad._id));
        this.$router.push('/ads');
      });
    },
  },
});
</script>
