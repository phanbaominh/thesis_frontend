<template>
  <DataIterator type="Zones" :init-items="zones">
    <BaseButtonToolbar icon="plus" />
    <template #main="{ items: displayedZones }">
      <v-row>
        <v-col
          v-for="zone in displayedZones"
          :key="zone.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              <nuxt-link :to="`/zones/${zone.name}`">{{ zone.name }}</nuxt-link>
              <v-spacer></v-spacer>
              <v-btn class="mr-2" color="primary" x-small fab depressed>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" x-small fab depressed>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Zone } from 'types/types';
export default Vue.extend({
  props: {
    zones: {
      required: true,
      type: Array,
    } as PropOptions<Zone[]>,
  },
});
</script>
