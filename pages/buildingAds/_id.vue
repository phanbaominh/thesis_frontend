<template>
  <AdDetailed :ad="ad">
    <template v-if="$permission.canGeneralWriteAd()" #append>
      <BaseDialogActions v-if="isPending" @close="onReject" @confirm="onAccept">
        Accept
        <template #close> Reject </template>
      </BaseDialogActions>
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
  },
});
</script>
