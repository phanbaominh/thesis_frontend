<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <v-card-title>
          {{ zone.name }}
        </v-card-title>
        <v-btn fab small depressed color="blue" class="align-self-center">
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn fab small depressed color="blue" class="align-self-center mr-2">
          <v-icon> mdi-sync </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="6">
        <ZoneSingleMediaControl class="cards" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-card class="cards pa-4">
          <ZoneSingleMediaFetcher type="Videos" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from 'types/types';
export default Vue.extend({
  async asyncData({ route }) {
    // const zone = (
    //   await $axios.$get($apiUrl.getzone(route.params.zone.slice(1)))
    // ).zone;
    await Promise.resolve();
    const zone = {
      name: route.params.name,
    };
    return { zone };
  },
  data() {
    return {
      zone: (null as any) as Zone,
    };
  },
});
</script>
<style scoped>
.cards {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
