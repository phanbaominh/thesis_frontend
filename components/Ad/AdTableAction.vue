<template>
  <v-row>
    <v-btn
      v-if="!isBd"
      class="mr-2"
      color="primary"
      x-small
      fab
      depressed
      nuxt
      :to="`/ads/${ad._id}/edit`"
      :disabled="!isIdle"
      @click.native.stop
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <DialogDelete v-if="isCancelable" @delete="onCancel">
      <template #title>Do you want to cancel this?</template>
      <template #default="{ on: on2, attrs: attrs2 }">
        <v-btn
          color="grey lighten-3"
          x-small
          fab
          depressed
          v-bind="attrs2"
          v-on="on2"
          @click.native.stop
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </DialogDelete>
    <DialogDelete v-else-if="isDeletable" @delete="onDelete">
      <template #default="{ on: on2, attrs: attrs2 }">
        <v-btn
          color="error"
          x-small
          fab
          depressed
          v-bind="attrs2"
          v-on="on2"
          @click.native.stop
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </DialogDelete>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Ad, AdStatus } from '~/types/types';
export default Vue.extend({
  props: {
    initAd: {
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
      ad: this.initAd,
    };
  },
  computed: {
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
      return (
        (this.ad.status === AdStatus.Pending && !this.isBd) ||
        this.isDeployed ||
        this.ad.status === AdStatus.Empty
      );
    },
  },
  methods: {
    async onCancel() {
      await this.$handleErrors(async () => {
        const newStatus = (
          await this.$axios.$put(this.$apiUrl.adStatusCancel(this.ad._id))
        ).status as AdStatus;
        this.ad.status = newStatus;
        this.$emit('cancel', this.ad);
        this.dialog = false;
      });
    },
    async onDelete() {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.ad(this.ad._id));
        this.$emit('delete', this.ad);
        this.dialog = false;
      });
    },
    onClickCard() {
      this.$router.push({ path: this.to });
    },
    // async onUpdate(adset: Adset) {
    //   await this.$handleErrors(async () => {
    //     await this.$axios.$put(this.$apiUrl.adset(this.adset._id), adset);
    //     this.updateDialog = !this.updateDialog;
    //     this.adset = adset;
    //   } catch (err) {}

    //   // this.$emit('submit', { name: this.name, desc: this.desc });
    // },
  },
});
</script>
