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
    deviceId: {
      type: String,
      required: true,
    },
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
    async videoControlRequest(
      eventName: string,
      payload?: { [key: string]: any }
    ) {
      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControlDevice, {
          eventName,
          payload: {
            deviceId: this.deviceId,
            ...payload,
          },
        });
      });
    },
    async onMute() {
      const event = this.dataIsMute ? 'unmute-video' : 'mute-video';
      this.dataIsMute = !this.dataIsMute;
      await this.videoControlRequest(event);
    },
    async onVolume(endVolume: number) {
      await this.videoControlRequest('volume-video', {
        volumeVideo: endVolume,
      });
    },
  },
});
</script>
