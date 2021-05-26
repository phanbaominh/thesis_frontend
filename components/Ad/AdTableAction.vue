<template>
  <v-row>
    <v-btn
      v-if="!isBd && isIdle"
      class="mr-2"
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
    <!-- <BaseCardButton
      color="green"
      title="Accept and deploy this ad offer"
      @click="onAccept"
    >
      <v-icon>mdi-checkmark</v-icon>
    </BaseCardButton>
    <BaseCardButton color="red" title="Reject this ad offer" @click="onReject">
      <v-icon>mdi-close</v-icon>
    </BaseCardButton> -->
    <AdDetailedRedeployForm
      v-if="isEmpty"
      v-slot="{ on, attrs }"
      :ad="ad"
      :dialog="dialog"
      @redeploy="onRedeploy"
    >
      <v-btn
        x-small
        fab
        depressed
        color="green"
        class="mr-2"
        v-bind="attrs"
        v-on="on"
        @click.native.stop
      >
        <v-icon>mdi-sync</v-icon>
      </v-btn>
    </AdDetailedRedeployForm>
    <div v-if="isBd && isPending && $permission.canGeneralWriteAd()">
      <AdTableActionDialog color="green" icon="check" dark @confirm="onAccept">
        Do you want to accept and deploy this ad?
      </AdTableActionDialog>
      <AdTableActionDialog color="red" icon="close" dark @confirm="onReject">
        Do you want to reject this ad?
      </AdTableActionDialog>
    </div>
    <AdTableActionDialog
      v-if="!isBd && isIdle"
      color="primary"
      icon="send"
      @confirm="onSend"
    >
      Do you want to send this ad?
    </AdTableActionDialog>
    <AdTableActionDialog
      v-if="isCancelable"
      color="grey lighten-3"
      icon="close"
      @confirm="onCancel"
    >
      Do you want to cancel this?
    </AdTableActionDialog>
    <AdTableActionDialog
      v-else-if="isDeletable"
      icon="delete"
      color="error"
      @confirm="onDelete"
    />
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Ad, AdStatus } from '~/types/types';
export default Vue.extend({
  props: {
    ad: {
      required: true,
      type: Object,
    } as PropOptions<Ad>,
    to: {
      required: true,
      type: String,
    },
    isBd: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
      updateDialog: false,
      // ad: this.initAd,
    };
  },
  computed: {
    isEmpty(): boolean {
      return this.ad.status === AdStatus.Empty;
    },
    isPending(): boolean {
      return this.ad.status === AdStatus.Pending;
    },
    isIdle(): boolean {
      return this.ad.status === AdStatus.Idle;
    },
    isDeletable(): boolean {
      if (this.isBd && !this.$permission.canGeneralDeleteAd()) return false;
      return this.isIdle || this.ad.status === AdStatus.Finished;
    },

    isDeployed(): boolean {
      return this.ad.status === AdStatus.Deployed;
    },
    isCancelable(): boolean {
      if (this.isBd && !this.$permission.canGeneralWriteAd()) return false;
      return (this.isPending && !this.isBd) || this.isDeployed || this.isEmpty;
    },
  },
  methods: {
    emitChange(newStatus: AdStatus) {
      this.$emit('change', { newStatus, adId: this.ad._id });
    },
    emitDelete() {
      this.$emit('delete', this.ad._id);
    },
    async onCancel() {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusCancel(this.ad._id))
        ).status as AdStatus;
        this.emitChange(newStatus);
      });
    },
    async onDelete() {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.ad(this.ad._id));
        this.emitDelete();
      });
    },
    onClickCard() {
      this.$router.push({ path: this.to });
    },
    async onSend() {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusSend(this.ad._id))
        ).status as AdStatus;
        this.emitChange(newStatus);
      });
    },
    async onReject() {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adStatusReject(this.ad._id));
        this.emitDelete();
      });
    },
    async onAccept() {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusDeploy(this.ad._id))
        ).status as AdStatus;
        this.emitChange(newStatus);
      });
    },
    async onRedeploy(budget: number) {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusRedeploy(this.ad._id), {
            budget,
          })
        ).status as AdStatus;
        this.emitChange(newStatus);
        this.dialog = false;
      });
    },
  },
});
</script>
