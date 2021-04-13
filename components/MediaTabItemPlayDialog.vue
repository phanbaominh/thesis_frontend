<template>
  <v-dialog v-model="isPlayDialog" width="600">
    <template #activator="{ on, attrs }">
      <v-btn
        :small="!$vuetify.breakpoint.xs"
        :x-small="$vuetify.breakpoint.xs"
        fab
        depressed
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>{{ truncate(media.name) }} </span>
        <v-spacer></v-spacer>
        <BaseButton color="white" @click="isPlayDialog = false">
          <v-icon>mdi-close</v-icon>
        </BaseButton>
      </v-card-title>
      <video ref="video" controls width="600">
        <source :src="`http://${media.path}`" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Media } from '~/types/types';
export default Vue.extend({
  props: {
    media: {
      type: Object,
      required: true,
    } as PropOptions<Media>,
  },
  data() {
    return {
      isPlayDialog: false,
    };
  },
  watch: {
    isPlayDialog(newVal) {
      if (!newVal) {
        const videoElement = this.$refs.video as HTMLVideoElement;
        videoElement.currentTime = 0;
        videoElement.pause();
      }
    },
  },
  methods: {
    truncate(name: string): string {
      const length = 25;
      if (name.length > length) {
        return name.substring(0, length) + '...';
      }
      return name;
    },
  },
});
</script>
