<template>
  <v-slider
    v-model="volume"
    track-color="light-grey"
    :disabled="!controlPerm"
    @end="onVolume"
  >
    <template #prepend>
      <v-icon :disabled="!controlPerm" @click="onMute">
        {{ volumeIcon }}
      </v-icon>
    </template>
  </v-slider>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    volumeVideo: {
      type: Number,
      required: true,
    },
    isMute: {
      type: Boolean,
      required: true,
    },
    controlPerm: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      volume: this.volumeVideo,
      prevVolume: this.volumeVideo,
      dataIsMute: this.isMute,
    };
  },
  computed: {
    volumeIcon(): string {
      if (this.volume <= 0 || this.dataIsMute) {
        return 'mdi-volume-off';
      } else if (this.volume <= 25) {
        return 'mdi-volume-low';
      } else if (this.volume <= 50) {
        return 'mdi-volume-medium';
      } else {
        return 'mdi-volume-high';
      }
    },
  },
  watch: {
    volumeVideo() {
      this.volume = this.volumeVideo;
    },
    isMute() {
      this.dataIsMute = this.isMute;
    },
  },
  methods: {
    onMute() {
      const eventName = this.dataIsMute ? 'unmute-video' : 'mute-video';
      this.dataIsMute = !this.dataIsMute;
      if (this.dataIsMute) {
        this.prevVolume = this.volume;
        this.volume = 0;
      } else this.volume = this.prevVolume;
      this.$emit('change', { eventName });
    },
    onVolume(endVolume: number) {
      this.$emit('change', {
        eventName: 'volume-video',
        volumeVideo: endVolume,
      });
    },
  },
});
</script>
