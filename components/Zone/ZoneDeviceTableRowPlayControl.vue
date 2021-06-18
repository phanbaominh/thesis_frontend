<template>
  <v-slider
    v-model="progress"
    track-color="light-grey"
    :max="durationFull || 90"
    :messages="timestamp"
    disabled
  >
    <template #prepend>
      <v-icon :disabled="!controlPerm" @click="onPause">
        mdi-{{ isPause ? 'play' : 'pause' }}
      </v-icon>
    </template>
  </v-slider>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    deviceId: {
      type: String,
      required: true,
    },
    durationFull: {
      type: Number,
      default: null,
    },
    position: {
      type: Number,
      required: true,
    },
    isPause: {
      type: Boolean,
      required: true,
    },
    controlPerm: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      progress: this.position,
      dataIsPause: this.isPause,
      prevProgressInterval: null as any,
    };
  },
  computed: {
    timestamp(): string {
      return `${this.time(this.progress)}/${this.time(this.durationFull)}`;
    },
  },
  watch: {
    position() {
      this.progress = this.position;
      this.resetProgressInterval();
    },
    isPause() {
      this.dataIsPause = this.isPause;
      if (this.dataIsPause) this.clearProgressInterval();
    },
  },
  created() {
    this.progress = this.position;
    if (!this.isPause) {
      // this.updatePlayer();

      this.setProgressInterval();
    }
  },
  beforeDestroy() {
    this.clearProgressInterval();
  },
  methods: {
    setProgressInterval() {
      this.prevProgressInterval = setInterval(() => {
        this.progress += 1;
      }, 1000);
    },
    clearProgressInterval() {
      if (this.prevProgressInterval) {
        this.progress = 0;
        clearInterval(this.prevProgressInterval);
      }
    },
    resetProgressInterval() {
      this.clearProgressInterval();
      this.setProgressInterval();
    },
    time(value: number): string {
      return new Date(value ? value * 1000 : '0000')
        .toISOString()
        .substr(14, 5);
    },
    async onPause() {
      const eventName = this.dataIsPause ? 'play-video-auto' : 'quit-video';
      this.dataIsPause
        ? this.setProgressInterval()
        : this.clearProgressInterval();
      this.dataIsPause = !this.dataIsPause;

      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControlDevice, {
          eventName,
          payload: {
            deviceId: this.deviceId,
          },
        });
      });
    },
  },
});
</script>
