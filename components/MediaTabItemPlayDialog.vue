<template>
  <v-dialog
    v-model="isPlayDialog"
    width="600"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-on="on">
        <v-btn
          :small="!xsmall && !$vuetify.breakpoint.xs"
          :x-small="xsmall || $vuetify.breakpoint.xs"
          fab
          depressed
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <BaseDialogTitle @close="isPlayDialog = false">
        <span>{{ $truncate(media.name) }} </span>
      </BaseDialogTitle>

      <video ref="video" controls width="600">
        <source :src="`http://${media.path}`" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    media: {
      type: Object,
      required: true,
    } as PropOptions<{ name: string; path: string }>,
    xsmall: {
      type: Boolean,
      default: false,
    },
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
});
</script>
