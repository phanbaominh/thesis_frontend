<template>
  <v-card class="pt-4 pb-4">
    <div class="d-flex justify-center">
      <v-img max-height="150px" max-width="150px" src="/compact-disk.svg">
      </v-img>
    </div>
    <!-- <div v-else class="d-flex justify-center">
      <video ref="video" width="400px" muted>
        <source :src="`http://${video.path}`" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div> -->
    <v-card-title :title="video ? video.name : 'Media name'">{{
      mediaName
    }}</v-card-title>
    <v-card-subtitle> {{ subtitle }}</v-card-subtitle>
    <v-slider
      v-model="progress"
      track-color="light-grey"
      :max="zoneInfo.durationFull"
      :messages="timestamp"
      class="mt-n2 px-2"
      disabled
      @end="onProgress"
    ></v-slider>
    <!-- :disabled="!controlPerm" -->
    <v-row>
      <v-container class="d-flex justify-center mt-2">
        <v-btn fab x-small depressed :disabled="isDisabled" @click="onPause">
          <v-icon> mdi-{{ zoneInfo.isPause ? 'play' : 'pause' }} </v-icon>
        </v-btn>
        <!-- <v-btn fab x-small depressed :disabled="!controlPerm" @click="onLoop">
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
            <path
              d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z"
              :fill="loopColor"
            ></path>
          </svg>
        </v-btn> -->
      </v-container>
    </v-row>
    <v-divider class="mt-4"></v-divider>
    <v-card-text>
      <v-slider
        v-model="volume"
        track-color="light-grey"
        :disabled="isDisabled"
        @end="onVolume"
      >
        <template #prepend>
          <v-icon :disabled="!controlPerm" @click="onMute">
            {{ volumeIcon }}
          </v-icon>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Ad, AdStatus, Video, Zone, ZoneInfo } from '~/types/types';
// const exampleZI: ZoneInfo = {
//   loopMode: 0,
//   isMute: false,
//   isPause: false,
//   zoneId: '607fb34f4108621b8b64b2cf',
//   durationFull: 90,
//   position: 0,
//   volumeVideo: 50,
//   isFinishInit: false,
//   isScheduleRunning: false,
//   scheduleId: '',
//   isVideoPlaying: true,
//   isPlaylistRunning: false,
//   videoId: '607fb1afeca9500c39e591c1',
// };
export default Vue.extend({
  props: {
    // zoneInfo: {
    //   type: Object,
    //   required: true,
    // } as PropOptions<ZoneInfo>,
    zone: {
      type: Object,
      required: true,
    } as PropOptions<Zone>,
    playlistVideos: {
      type: Array,
      required: true,
    } as PropOptions<{ id: string; videos: Video[] }[]>,
    controlPerm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      zoneInfo: { isPause: true } as ZoneInfo,
      progress: 0 as number,
      volume: 0 as number,
      videoPlayer: null as HTMLVideoElement | null,
      prevProgressInterval: null as any,
    };
  },
  computed: {
    mediaName(): string {
      return this.zoneInfo.mediaName
        ? this.$truncate(this.zoneInfo.mediaName)
        : 'Media Name';
    },
    subtitle(): string {
      if (this.zone.adArray.length === 0) {
        return `Please add ads to zone`;
      } else if (this.deployedAdArray.length === 0) {
        return `All ads are empty`;
      } else if (this.zoneInfo.isPause) {
        return 'Paused';
      } else if (this.zoneInfo.isPlaylistRunning) {
        const playlistName =
          this.zone.playlistArray.find(
            (pl) => pl._id === this.zoneInfo.playlistVideoId
          )?.name || 'None';
        return `Playing from playlist ${playlistName}...`;
      } else if (this.zoneInfo.videoId) {
        return `Playing video...`;
      } else return 'Click play to start playing ads in zone';
    },
    timestamp(): string {
      return `${this.time(this.progress)}/${this.time(
        this.zoneInfo.durationFull
      )}`;
    },
    loopColor(): string {
      if (this.zoneInfo.loopMode === 2) {
        return 'green';
      } else if (this.zoneInfo.loopMode === 1) {
        return 'blue';
      } else {
        return 'rgba(0, 0, 0, 0.87)';
      }
    },
    volumeIcon(): string {
      if (this.volume <= 0 || this.zoneInfo.isMute) {
        return 'mdi-volume-off';
      } else if (this.volume <= 25) {
        return 'mdi-volume-low';
      } else if (this.volume <= 50) {
        return 'mdi-volume-medium';
      } else {
        return 'mdi-volume-high';
      }
    },
    video(): Video | undefined {
      for (const pl of this.playlistVideos) {
        const found = pl.videos.find(
          (video) => video._id === this.zoneInfo.videoId
        );
        if (found) return found;
      }
      return this.zone.videoArray.find(
        (video) => video._id === this.zoneInfo.videoId
      );
    },
    loadFromServer(): boolean {
      return this.volume !== this.zoneInfo.volumeVideo && process.server;
    },
    deployedAdArray(): Ad[] {
      return this.zone.adArray.filter((ad) => ad.status === AdStatus.Deployed);
    },
    isDisabled(): boolean {
      return !this.controlPerm || this.deployedAdArray.length === 0;
    },
  },
  watch: {
    zoneInfo() {
      this.progress = this.zoneInfo.position;
      this.volume = this.zoneInfo.volumeVideo;
    },
    // video() {
    //   this.updatePlayer();
    // },
    'zoneInfo.position'() {
      this.resetProgressInterval();
    },
  },
  created() {
    this.progress = this.zoneInfo.position;
    this.volume = this.zoneInfo.volumeVideo;
    this.getInfo();
    this.$socket.on(
      `/receive/update/${this.zone._id}/infor-video`,
      (payload) => {
        this.zoneInfo = payload;
      }
    );
    if (this.video) {
      // this.updatePlayer();
      if (this.zoneInfo.videoId && !this.zoneInfo.isPause) {
        this.setProgressInterval();
      }
    }
  },
  beforeDestroy() {
    this.clearProgressInterval();
  },
  methods: {
    // updatePlayer() {
    //   if (this.video) {
    //     this.$nextTick(() => {
    //       this.videoPlayer = this.$refs.video as HTMLVideoElement;
    //       this.playVideo();
    //       this.muteVideo();
    //       this.seekVideo();
    //       this.loopVideo();
    //     });
    //   }
    // },
    // playVideo() {
    //   !this.zoneInfo.isPause
    //     ? this.videoPlayer?.play()
    //     : this.videoPlayer?.pause();
    // },
    // muteVideo() {
    //   if (!this.videoPlayer) return;
    //   this.zoneInfo.isMute
    //     ? (this.videoPlayer.muted = true)
    //     : (this.videoPlayer.muted = false);
    // },
    // seekVideo() {
    //   if (this.videoPlayer) {
    //     this.videoPlayer.currentTime = this.zoneInfo.position;
    //   }
    // },
    // loopVideo() {
    //   if (this.videoPlayer) {
    //     this.zoneInfo.loopMode === 1
    //       ? (this.videoPlayer.loop = true)
    //       : (this.videoPlayer.loop = false);
    //   }
    // },
    getInfo() {
      this.$handleErrors(() => {
        this.$axios.$post(this.$apiUrl.videoInfo, {
          zoneId: this.zone._id,
        });
      });
    },
    setProgressInterval() {
      this.prevProgressInterval = setInterval(() => {
        this.progress += 1;
      }, 1000);
    },
    clearProgressInterval() {
      if (this.prevProgressInterval) clearInterval(this.prevProgressInterval);
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
    async videoControlRequest(
      eventName: string,
      payload?: { [key: string]: any }
    ) {
      await this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName,
          payload: {
            zoneId: this.zoneInfo.zoneId,
            ...payload,
          },
        });
      });
    },
    async onVolume(endVolume: number) {
      await this.videoControlRequest('volume-video', {
        volumeVideo: endVolume,
      });
    },
    async onProgress(endProgress: number) {
      this.resetProgressInterval();
      await this.videoControlRequest('seek-video', {
        position: endProgress,
      });
    },
    async onPause() {
      const event = this.zoneInfo.isPause ? 'play-video-auto' : 'pause-video';
      this.zoneInfo.isPause
        ? this.setProgressInterval()
        : this.clearProgressInterval();
      this.zoneInfo.isPause = !this.zoneInfo.isPause;

      await this.videoControlRequest(event, {
        zoneId: this.zone._id,
      });
    },
    async onMute() {
      const event = this.zoneInfo.isMute ? 'unmute-video' : 'mute-video';
      this.zoneInfo.isMute = !this.zoneInfo.isMute;
      await this.videoControlRequest(event);
    },
    async onLoop() {
      let event = 'unloop-video';
      if (this.zoneInfo.loopMode === 0) {
        event = 'loop-one-video';
      } else if (this.zoneInfo.loopMode === 1) {
        event = 'loop-all-video';
      }
      this.zoneInfo.loopMode = (this.zoneInfo.loopMode + 1) % 3;
      await this.videoControlRequest(event);
    },
  },
});
</script>
