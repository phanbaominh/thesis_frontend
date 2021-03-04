<template>
  <DataIterator
    main-component="MediaTabItemMain"
    :type="type"
    :init-items="mediaArray"
  />
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
