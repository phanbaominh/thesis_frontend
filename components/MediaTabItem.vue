<template>
  <DataIterator
    main-component="MediaTabItemMain"
    :type="type"
    :init-items="mediaArray"
  >
    <v-btn depressed class="align-self-center" color="blue" x-large>
      Upload {{ type }}
      <v-icon class="ml-2" large> mdi-cloud-upload </v-icon>
    </v-btn>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    mediaArray: {
      required: true,
      type: Array,
    } as PropOptions<{ title: string }[]>,
    type: {
      required: true,
      type: String,
    },
  },
});
</script>
