<template>
  <v-card nuxt :to="`buildingads/${ad._id}`">
    <v-card-title class="subheading font-weight-bold"
      >{{ ad.name }} <AdCardStatus :status="ad.status" class="ml-2" />
      <v-spacer></v-spacer>
      <DialogDelete
        v-slot="{ on: on2, attrs: attrs2 }"
        @delete="onDelete"
        @click.prevent
      >
        <v-btn color="error" x-small fab depressed v-bind="attrs2" v-on="on2">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
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
import { Ad } from '~/types/types';
export default Vue.extend({
  props: {
    initAd: {
      required: true,
      type: Object,
    } as PropOptions<Ad>,
  },
  data() {
    return {
      dialog: false,
      updateDialog: false,
      ad: this.initAd,
    };
  },
  computed: {
    adDesc(): { [key: string]: string } {
      return {};
    },
  },
  methods: {
    async onDelete(ad: Ad) {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.ad(ad._id));
        this.$emit('delete', ad);
        this.dialog = false;
      });
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
