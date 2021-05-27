<template>
  <v-list-item two-line>
    <v-list-item-content>
      <v-list-item-title class="text-h6">{{ title }}</v-list-item-title>
      <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    title: {
      type: [String, Number],
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
});
</script>
