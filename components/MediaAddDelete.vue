<template>
  <MediaSelector
    :media-array="mediaArray"
    :type="deleteType"
    :compact="compact"
    @confirm="$emit('delete', $event)"
  >
    <template #actions="{ media }">
      <slot :media="media"></slot>
    </template>
    <v-dialog v-model="isAddDialog" width="1000" scrollable>
      <template #activator="{ on, attrs }">
        <v-btn
          small
          depressed
          fab
          color="blue"
          class="align-self-center mr-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <MediaSelector
          is-add
          :media-array="allMediaArray"
          :type="type"
          @confirm="onConfirmAdd($event)"
          @close="isAddDialog = false"
        />
      </v-card>
    </v-dialog>
  </MediaSelector>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Media } from 'types/types';
export default Vue.extend({
  props: {
    mediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Media[]>,
    compact: {
      default: false,
      type: Boolean,
    },
    type: {
      required: true,
      type: String,
    },
    deleteType: {
      default(): string {
        return this.type;
      },
      type: String,
    },
  },
  data() {
    return {
      isAddDialog: false,
      allMediaArray: new Array(10)
        .fill(0)
        .map((_n, i) => ({ name: `New Media${i}` })),
    };
  },
  methods: {
    onConfirmAdd(newMediaArray: Media[]) {
      this.$emit('add', newMediaArray);
      this.isAddDialog = false;
    },
  },
});
</script>
