<template>
  <v-dialog v-model="dialog" max-width="350">
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs">
        <v-btn
          v-bind="$attrs"
          fab
          depressed
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          v-on="on"
        >
        </v-btn>
      </slot>
    </template>
    <v-card>
      <BaseDialogTitle @close="dialog = false">
        <slot name="title">Do you want to delete this?</slot>
      </BaseDialogTitle>
      <BaseDialogActions @close="dialog = false" @confirm="onYes">
        Yes
        <template #close> No </template>
      </BaseDialogActions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    onYes() {
      this.$emit('delete');
      this.dialog = false;
    },
  },
});
</script>
