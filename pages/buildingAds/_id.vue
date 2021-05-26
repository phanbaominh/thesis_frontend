<template>
  <AdDetailed :ad="ad">
    <template #append>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template v-if="isPending && $permission.canGeneralWriteAd()">
          <AdDetailedActionDialog @confirm="onAccept">
            <template #name>Accept</template>
            Do you want to accept and deploy this ad?
          </AdDetailedActionDialog>
          <AdDetailedActionDialog @confirm="onReject">
            <template #name>Reject</template>
            Do you want to reject this ad?
          </AdDetailedActionDialog>
        </template>
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
    };
  },
  computed: {
    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
    isDeletable(): boolean {
      return (
        this.ad.status === AdStatus.Finished &&
        this.$permission.canGeneralDeleteAd()
      );
    },
    isCancelable(): boolean {
      return (
        (this.ad.status === AdStatus.Deployed ||
          this.ad.status === AdStatus.Empty) &&
        this.$permission.canGeneralWriteAd()
      );
    },
  },
  created() {
    this.$socket.on('cancel-pending-offer', ({ id }) => {
      if (id === this.ad._id) {
        this.$toast.info(`Ad ${this.ad.name} was just canceled`);
        this.$router.push('/buildingads');
      }
    });
  },
  beforeDestroy() {
    this.$socket.off('cancel-pending-offer');
  },
  methods: {
    // async changeStatus(status: AdStatus) {
    //   await this.$handleErrors(async () => {
    //     await this.$axios.$put(this.$apiUrl.adStatus(this.ad._id), { status });
    //     this.ad.status = status;
    //   });
    // },
    async onAccept() {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusDeploy(this.ad._id));
        this.ad.status = AdStatus.Deployed;
      });
    },
    async onReject() {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusReject(this.ad._id));
        this.ad.status = AdStatus.Idle;
      });
      this.$router.push('/buildingads');
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
        this.$router.push('/buildingads');
      });
    },
  },
});
</script>
