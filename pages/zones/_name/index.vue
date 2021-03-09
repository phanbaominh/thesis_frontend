<template>
  <v-container>
    <v-toolbar dark color="blue darken-3">
      <v-row>
        <EditableName :init-name="zone.name" @updateName="onUpdateName" />
        <!-- <v-card-title>
          {{ zone.name }}
        </v-card-title>
        <v-btn fab small depressed color="blue" class="align-self-center">
          <v-icon> mdi-pencil </v-icon>
        </v-btn> -->
        <v-spacer></v-spacer>
        <v-btn fab small depressed color="blue" class="align-self-center mr-2">
          <v-icon> mdi-sync </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <ZoneSingleMediaControl class="cards" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6">
        <v-card class="cards pa-4">
          <v-card outlined><MediaTabItem type="Videos" compact /></v-card>
          <v-card outlined><MediaTabItemPlaylist compact /></v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone } from 'types/types';
import MediaTabItemPlaylist from '~/components/MediaTabItemPlaylist.vue';
export default Vue.extend({
  components: { MediaTabItemPlaylist },
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
  methods: {
    onUpdateName(newName: string) {
      this.zone.name = newName;
    },
  },
});
</script>
<style scoped>
.cards {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.cards > * {
  margin-bottom: 10px;
}
</style>
