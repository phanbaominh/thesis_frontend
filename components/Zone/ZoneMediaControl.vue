<template>
  <v-card class="pt-4">
    <div class="d-flex justify-center">
      <v-img max-height="150px" max-width="150px" src="/compact-disk.svg">
      </v-img>
    </div>
    <v-card-title>Media Name</v-card-title>
    <v-card-subtitle>Author Name</v-card-subtitle>
    <v-slider
      v-model="progress"
      track-color="light-grey"
      max="100"
      :messages="timestamp"
      class="mt-n2 px-2"
    ></v-slider>
    <v-row>
      <v-container class="d-flex justify-center mt-2">
        <v-btn fab x-small depressed @click="isPlayed = !isPlayed">
          <v-icon> mdi-{{ isPlayed ? 'pause' : 'play' }} </v-icon>
        </v-btn>
      </v-container>
    </v-row>
    <v-divider class="mt-4"></v-divider>
    <v-card-text>
      <v-slider
        v-model="volume"
        track-color="light-grey"
        prepend-icon="mdi-volume-high"
      ></v-slider>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      progress: 0,
      volume: 0,
      isPlayed: false,
    };
  },
  computed: {
    timestamp(): string {
      return new Date(this.progress * 1000).toISOString().substr(14, 5);
    },
  },
});
</script>
