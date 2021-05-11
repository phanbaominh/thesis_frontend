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
      <v-list-item v-for="(value, key) in adsetDesc" :key="key">
        <span class="font-weight-bold">{{ key + ':' }}</span>

        {{ ` ${value || 'None'}` }}
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Adset, AdsetConst, AdsetGender } from '~/types/types';
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
  computed: {
    adsetDesc(): { [key: string]: string } {
      const ageLine = this.adset.ages.value
        .map((age) => AdsetConst.ranges[age])
        .join(', ');
      const dowLine = this.adset.daysOfWeek.value
        .map((dow) => AdsetConst.dows[dow])
        .join(', ');
      const hodLine = this.adset.hoursOfDay.value
        .map((hod) => AdsetConst.hods[hod])
        .join(', ');
      const genderLine = this.adset.genders.value
        .map((g) => (g === AdsetGender.Male ? 'Male' : 'Female'))
        .join(',');
      return {
        Ages: ageLine,
        Gender: genderLine,
        DoW: dowLine,
        HoD: hodLine,
      };
    },
  },
  methods: {
    async onDelete(adset: Adset) {
      try {
        await this.$axios.$delete(this.$apiUrl.adset(adset._id));
        this.$emit('delete', adset);
        this.dialog = false;
      } catch {}
    },
    async onUpdate(adset: Adset) {
      try {
        await this.$axios.$put(this.$apiUrl.adset(this.adset._id), adset);
        this.updateDialog = !this.updateDialog;
        this.adset = adset;
      } catch (err) {}

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
