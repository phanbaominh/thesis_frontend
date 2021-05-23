<template>
  <v-card>
    <v-card-title class="subheading font-weight-bold"
      >{{ adset.name }}
      <v-spacer></v-spacer>

      <AdsetForm
        :init-adset="adset"
        title="Update Adset"
        :dialog="updateDialog"
        @submit="onUpdate"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-2"
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
      </AdsetForm>

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
    <v-spacer></v-spacer>
    <!-- <v-btn class="mr-2" color="primary" x-small fab depressed>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->

    <v-divider></v-divider>
    <v-card-text>
      <AdsetDesc :ad-set="adset" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Adset } from '~/types/types';
export default Vue.extend({
  props: {
    initAdset: {
      required: true,
      type: Object,
    } as PropOptions<Adset>,
  },
  data() {
    return {
      dialog: false,
      updateDialog: false,
      adset: this.initAdset,
    };
  },
  methods: {
    async onDelete() {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.adset(this.adset._id));
        this.$emit('delete', this.adset);
        this.dialog = false;
      });
    },
    async onUpdate(adset: Adset) {
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.adset(this.adset._id), adset);
        this.updateDialog = !this.updateDialog;
        this.adset = adset;
      });

      // this.$emit('submit', { name: this.name, desc: this.desc });
    },
  },
  // watch: {
  //   controlDialog() {
  //     this.dialog = false;
  //   },
  // },
});
</script>
