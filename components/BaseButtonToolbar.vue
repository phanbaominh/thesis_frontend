<template>
  <v-btn small depressed fab color="blue" class="align-self-center">
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
