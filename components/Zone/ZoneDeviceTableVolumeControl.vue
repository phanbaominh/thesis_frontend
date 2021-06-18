<template>
  <BaseDialogForm
    title="Set new default volume"
    :control-dialog="dialog"
    @submit="dialog = !dialog"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs">
        <v-btn
          depressed
          fab
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          color="blue"
          v-bind="attrs"
          class="align-self-center mr-2"
          v-on="on"
        >
          <v-icon>mdi-volume-low</v-icon>
        </v-btn>
      </slot>
    </template>
    <BaseVolumeControl
      v-bind="controlZone"
      :control-perm="controlPerm"
      @change="videoControlRequest"
    />
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    zone: {
      type: Object,
      required: true,
    },
    controlPerm: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    controlZone() {
      return this.zone.volumeVideo
        ? {
            ...this.zone,
            isMute: this.zone.isMuteVideo,
          }
        : {
            ...this.zone,
            volumeVideo: 50,
            isMute: this.zone.isMuteVideo,
          };
    },
  },
  methods: {
    videoControlRequest({
      eventName,
      payload,
    }: {
      eventName: string;
      payload?: { [key: string]: any };
    }) {
      this.$handleErrors(async () => {
        await this.$axios.$post(this.$apiUrl.videoControl, {
          eventName,
          payload: {
            zoneId: this.zone._id,
            ...payload,
          },
        });
      });
    },
  },
});
</script>
