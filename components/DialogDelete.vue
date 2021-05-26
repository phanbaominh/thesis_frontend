<template>
  <v-dialog v-model="dialog" :max-width="maxWidth">
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs">
        <v-btn
          v-bind="$attrs"
          fab
          depressed
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          :color="color"
          v-on="on"
        >
          <v-icon>mdi-delete</v-icon>
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
  props: {
    color: {
      type: String,
      default: 'error',
    },
    maxWidth: {
      type: Number,
      default: 350,
    },
  },
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
