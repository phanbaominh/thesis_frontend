<template>
  <DialogDelete :max-width="500" @delete="$emit('confirm')">
    <template #title><slot></slot></template>
    <template #default="{ on }">
      <v-btn
        x-small
        fab
        depressed
        class="mr-2"
        v-bind="$attrs"
        v-on="on"
        @click.native.stop
      >
        <v-icon>mdi-{{ icon }}</v-icon>
      </v-btn>
    </template>
  </DialogDelete>
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
