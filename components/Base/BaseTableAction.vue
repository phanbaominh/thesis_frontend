<template>
  <v-btn x-small fab depressed class="mr-2" v-bind="$attrs" @click.native.stop>
    <v-icon>mdi-{{ icon }}</v-icon>
  </v-btn>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    icon: {
      required: true,
      type: String,
    },
  },
});
</script>
