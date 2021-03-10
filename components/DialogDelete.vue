<template>
  <v-dialog v-model="dialog" max-width="290">
    <template #activator="{ on }">
      <v-btn
        v-bind="$attrs"
        fab
        depressed
        :small="!$vuetify.breakpoint.xs"
        :x-small="$vuetify.breakpoint.xs"
        v-on="on"
      >
        <slot></slot>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline"> Delete this? </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false"> No </v-btn>
        <v-btn color="green darken-1" text @click="onYes"> Yes </v-btn>
      </v-card-actions>
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
