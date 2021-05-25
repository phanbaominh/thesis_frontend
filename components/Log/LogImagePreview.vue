<template>
  <v-dialog
    v-model="dialog"
    width="500"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-btn color="primary" x-small fab depressed v-bind="attrs" v-on="on">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    <v-card>
      <BaseDialogTitle @close="dialog = false">
        First frame from camera
      </BaseDialogTitle>
      <v-img
        :src="link"
        alt="The first frame captured by camera"
        max-width="500"
      >
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
});
</script>
