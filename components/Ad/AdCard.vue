<template>
  <v-card link @click="onClickCard">
    <v-card-title class="subheading font-weight-bold">
      {{ ad.name }}
      <AdCardStatus :status="ad.status" class="ml-2" />
      <v-spacer></v-spacer>

      <!-- <AdForm
        :init-ad="ad"
        title="Update Ad"
        :dialog="updateDialog"
        @submit="onUpdate"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="blue"
            x-small
            fab
            depressed
            v-bind="attrs"
            dark
            v-on="on"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </AdForm> -->

      <DialogDelete v-if="!isDeletable" @delete="onCancel">
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
      <DialogDelete v-else @delete="onDelete">
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
    </v-card-title>
    <!-- <v-card-subtitle><AdCardStatus :status="ad.status" /></v-card-subtitle> -->
    <v-spacer></v-spacer>
    <v-divider></v-divider>
    <v-card-text>
      <v-list-item v-for="(value, key) in adDesc" :key="key">
        <span class="font-weight-bold">{{ key + ':' }}</span>

        {{ ` ${value || 'None'}` }}
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import dayjs from 'dayjs';
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
  },
  data() {
    return {
      dialog: false,
      updateDialog: false,
      ad: this.initAd,
    };
  },
  computed: {
    isDeletable(): boolean {
      return (
        this.ad.status === AdStatus.Canceled ||
        this.ad.status === AdStatus.Rejected
      );
    },
    adDesc(): { [key: string]: any } {
      const statusKey = `Time when ${this.ad.status}`;
      return {
        'Remaining budget': this.ad.remainingBudget,
        'Creation time': dayjs(this.ad.timeDeploy).format(
          'YYYY/MM/DD -- HH:MM'
        ),
        [statusKey]: dayjs(this.ad.timeStatus).format('YYYY/MM/DD -- HH:MM'),
      };
    },
  },
  methods: {
    async onCancel() {
      try {
        await this.$axios.$put(this.$apiUrl.adStatusCancel(this.ad._id));
        this.ad.status = AdStatus.Canceled;
        this.$emit('cancel', this.ad);
        this.dialog = false;
      } catch {}
    },
    async onDelete() {
      try {
        await this.$axios.$delete(this.$apiUrl.ad(this.ad._id));
        this.$emit('delete', this.ad);
        this.dialog = false;
      } catch {}
    },
    onClickCard() {
      this.$router.push({ path: this.to });
    },
    // async onUpdate(adset: Adset) {
    //   try {
    //     await this.$axios.$put(this.$apiUrl.adset(this.adset._id), adset);
    //     this.updateDialog = !this.updateDialog;
    //     this.adset = adset;
    //   } catch (err) {}

    //   // this.$emit('submit', { name: this.name, desc: this.desc });
    // },
  },
});
</script>
