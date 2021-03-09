<template>
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
import Vue from 'vue';
let testArray = new Array(10).fill(0);
testArray = testArray.map((_n, i) => ({
  name: `Zone${i}`,
}));
export default Vue.extend({
  data() {
    return {
      zones: testArray,
    };
  },
  methods: {
    onNewZone(name: string) {
      this.zones.push({ name });
    },
  },
});
</script>
