<template>
  <v-chip :color="color" text-color="white" :title="title">
    {{ status }}
  </v-chip>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdStatus } from '~/types/types';
export default Vue.extend({
  props: {
    status: {
      required: true,
      type: String,
    } as Vue.PropOptions<AdStatus>,
    timeStatus: {
      required: true,
      type: String,
    },
  },
  computed: {
    color() {
      if (this.status === AdStatus.Pending) {
        return 'blue';
      } else if (this.status === AdStatus.Deployed) {
        return 'green';
      } else if (this.status === AdStatus.Idle) {
        return 'amber accent-3';
      } else if (this.status === AdStatus.Empty) {
        return 'red';
      } else {
        return 'grey lighten-1';
      }
    },
    title() {
      return `Status was changed to ${this.status} at ${this.$utils.timeFormat(
        this.timeStatus
      )}`;
    },
  },
});
</script>
