<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn :color="color" text @click="$emit('close')">
      <slot name="close"></slot>
    </v-btn>
    <v-btn
      :color="color"
      text
      :type="isSubmit ? 'submit' : 'button'"
      @click="$emit('confirm')"
      @submit="onSubmit"
    >
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
    isSubmit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onSubmit(e: Event) {
      e.preventDefault();
      this.$emit('confirm');
    },
  },
});
</script>
