<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn v-if="!isNotDialog" :color="color" text @click="$emit('close')">
      <slot name="close"></slot>
    </v-btn>
    <v-btn :color="color" text type="submit" :disabled="isDisabled">
      <slot></slot>
    </v-btn>
  </v-card-actions>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    color: {
      type: String,
      default: 'blue darken-1',
    },
    isNotDialog: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
