<template>
  <MediaAddDelete
    v-slot="{ media }"
    :media-array="mediaArray"
    :all-media-array="allMediaArray"
    :type="type"
    compact
    @add="onAdd"
    @delete="onDelete"
  >
    <slot :media="media"></slot>
  </MediaAddDelete>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Nameable, Media } from '~/types/types';
export default Vue.extend({
  props: {
    type: {
      required: true,
      type: String,
    },
    mediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Nameable[]>,
    allMediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Nameable[]>,
  },
  methods: {
    onDelete(deletedMediaArray: Nameable[]) {
      this.$emit('delete', deletedMediaArray);
    },
    onAdd(addedMediaArray: Nameable[]) {
      this.$emit('add', addedMediaArray);
    },
    onPlay(_media: Media) {
      // TODO
    },
  },
});
</script>
