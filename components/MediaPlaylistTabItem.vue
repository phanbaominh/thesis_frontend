<template>
  <DataIterator
    main-component="MediaPlaylistTabItemMain"
    :type="'Playlist'"
    :init-items="playlistArray"
  >
    <BaseButtonToolbar icon="plus" />
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    playlistArray: {
      required: true,
      type: Array,
    } as PropOptions<{ title: string }[]>,
  },
});
</script>
