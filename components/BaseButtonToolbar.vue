<template>
  <v-btn
    small
    depressed
    fab
    :color="color"
    class="align-self-center mr-2"
    @click="$emit('click', $event)"
  >
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
    color: {
      default: 'blue',
      type: String,
    },
  },
});
</script>
