<template>
  <MediaAddDelete
    v-slot="{ media }"
    :media-array="mediaArray"
    :type="type"
    compact
    @add="onAdd"
    @delete="onDelete"
  >
    <v-list-item-action>
      <v-btn fab depressed small color="primary" @click="onPlay(media)">
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </v-list-item-action>
  </MediaAddDelete>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Media } from '~/types/types';
export default Vue.extend({
  props: {
    type: {
      required: true,
      type: String,
    },
    mediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Media[]>,
  },
  methods: {
    onDelete(deletedMediaArray: Media[]) {
      this.$emit('delete', deletedMediaArray);
    },
    onAdd(addedMediaArray: Media[]) {
      this.$emit('add', addedMediaArray);
    },
    onPlay(_media: Media) {
      // TODO
    },
  },
});
</script>
