<template>
  <MediaSelector
    :media-array="mediaArray"
    :type="deleteType"
    :compact="compact"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
    :delete-perm="deletePerm"
    @confirm="onConfirmDelete"
  >
    <template #actions="{ media }">
      <slot :media="media"></slot>
    </template>
    <v-dialog
      v-if="addPerm"
      v-model="isAddDialog"
      width="1000"
      scrollable
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :hide-overlay="$vuetify.breakpoint.smAndDown"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          depressed
          fab
          color="blue"
          class="align-self-center mr-2"
          v-bind="attrs"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
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
import { Nameable } from 'types/types';
export default Vue.extend({
  props: {
    mediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Nameable[]>,
    allMediaArray: {
      type: Array,
      required: true,
    } as PropOptions<Nameable[]>,
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
    deletePerm: {
      default: true,
      type: Boolean,
    },
    addPerm: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      isAddDialog: false,
    };
  },
  methods: {
    onConfirmAdd(newMediaArray: Nameable[]) {
      this.$emit('add', newMediaArray);
      this.isAddDialog = false;
    },
    onConfirmDelete(deletedMediaArray: Nameable[]) {
      this.$emit('delete', deletedMediaArray);
    },
  },
});
</script>
