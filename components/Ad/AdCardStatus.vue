<template>
  <v-chip :color="color" text-color="white"> {{ status }}</v-chip>
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
  },
  computed: {
    color() {
      if (this.status === AdStatus.Pending) {
        return 'blue';
      } else if (this.status === AdStatus.Running) {
        return 'green';
      } else {
        return 'red';
      }
    },
  },
});
</script>
