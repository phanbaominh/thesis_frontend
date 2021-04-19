<template>
  <BaseFetcher :fetch-state="$fetchState">
    <DataIterator type="Zones" :init-items="zones">
      <DialogName
        v-slot="{ on, attrs }"
        init-name=""
        title="Create a zone:"
        @updateName="onNewZone"
      >
        <v-btn
          small
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </DialogName>
      <template #main="{ items: displayedZones }">
        <v-row>
          <v-col
            v-for="zone in displayedZones"
            :key="zone._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <nuxt-link :to="`/zones/${zone._id}`">{{
                  zone.name
                }}</nuxt-link>
                <v-spacer></v-spacer>
                <!-- <v-btn class="mr-2" color="primary" x-small fab depressed>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->
                <DialogDelete
                  v-slot="{ on, attrs }"
                  @delete="onDeleteZone(zone)"
                >
                  <v-btn
                    color="error"
                    x-small
                    fab
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </DialogDelete>
              </v-card-title>
              <v-divider></v-divider>
              <v-container class="d-flex flex-column">
                <v-icon x-large color="primary" class="align-self-center">
                  mdi-monitor
                </v-icon>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      zones: [] as Zone[],
    };
  },
  async fetch() {
    this.zones = (await this.$axios.$get(this.$apiUrl.zones)).zones;
  },
  methods: {
    async onNewZone(name: string) {
      try {
        const newZone = (await this.$axios.$post(this.$apiUrl.zones, { name }))
          .zone;
        this.zones.push(newZone);
        this.$toast.success('Succesfully created a zone!');
      } catch (error) {
        console.log(error);
      }
    },
    async onDeleteZone(deletedZone: Zone) {
      await this.$axios.$delete(this.$apiUrl.zone(deletedZone._id));
      this.zones = this.zones.filter((zone) => deletedZone._id !== zone._id);
      this.$toast.success('Succesfully deleted zone!');
    },
  },
});
</script>
