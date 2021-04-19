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
      :max="zoneInfo.durationFull"
      :messages="timestamp"
      class="mt-n2 px-2"
      @end="onDuration"
    ></v-slider>
    <v-row>
      <v-container class="d-flex justify-center mt-2">
        <v-btn fab x-small depressed @click="isPlayed = !isPlayed">
          <v-icon> mdi-{{ zoneInfo.isPause ? 'pause' : 'play' }} </v-icon>
        </v-btn>
      </v-container>
    </v-row>
    <v-divider class="mt-4"></v-divider>
    <v-card-text>
      <v-slider
        v-model="volume"
        track-color="light-grey"
        prepend-icon="mdi-volume-high"
        @end="onVolume"
      ></v-slider>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ZoneInfo } from '~/types/types';
export default Vue.extend({
  props: {
    zoneInfo: {
      type: Object,
      required: true,
    } as PropOptions<ZoneInfo>,
  },
  data() {
    return {
      progress: this.zoneInfo.position,
      volume: this.zoneInfo.volumeVideo,
      isPlayed: false,
    };
  },
  computed: {
    timestamp(): string {
      return `${this.time(this.progress)}/${this.time(
        this.zoneInfo.durationFull
      )}`;
    },
  },
  methods: {
    time(value: number): string {
      console.log(value);
      return new Date(value ? value * 1000 : '0000')
        .toISOString()
        .substr(14, 5);
    },
    async onVolume(endVolume: number) {
      await this.$axios.$post(this.$apiUrl.videoControl, {
        eventName: 'volume-video',
        payload: { zoneId: this.zoneInfo.zoneId, volumeVideo: endVolume },
      });
    },
    onDuration() {},
  },
});
</script>
