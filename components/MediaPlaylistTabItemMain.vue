<template>
  <MediaList :items="items">
    <template #default="{ item: playlist }">
      <v-list-item-content class="text-h6 font-weight-regular">
        <nuxt-link :to="`/playlists/${playlist.name}`">
          {{ playlist.name }}
        </nuxt-link>
      </v-list-item-content>
    </template>
  </MediaList>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<{ name: string }[]>,
  },
});
</script>
