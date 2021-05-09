<template>
  <v-dialog
    v-model="dialog"
    width="600"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :small="!$vuetify.breakpoint.xs"
        :x-small="$vuetify.breakpoint.xs"
        fab
        depressed
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <MediaTabItemUploadForm
      :media="media"
      @submit="dialog = false"
      @close="dialog = false"
    />
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    media: { required: true, type: Object },
  },
  data() {
    return {
      dialog: false,
    };
  },
});
</script>
