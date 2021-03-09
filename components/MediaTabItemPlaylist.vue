<template>
  <DataIterator :type="'Playlist'" :init-items="playlists">
    <DialogName
      v-slot="{ on, attrs }"
      init-name=""
      title="Create a playlist:"
      @updateName="$emit('new', $event)"
    >
      <v-btn
        small
        depressed
        fab
        :color="'blue'"
        class="align-self-center mr-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </DialogName>
    <template #main="{ items: displayedPlaylists }">
      <MediaList :items="displayedPlaylists">
        <template #default="{ item: playlist }">
          <v-list-item-content class="text-h6 font-weight-regular">
            <nuxt-link :to="`/playlists/${playlist.name}`">
              {{ playlist.name }}
            </nuxt-link>
          </v-list-item-content>
        </template>
      </MediaList>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    playlists: {
      required: true,
      type: Array,
    } as PropOptions<{ name: string }[]>,
  },
});
</script>
