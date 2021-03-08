<template>
  <DataIterator :type="'Items'" :init-items="mediaArray">
    <slot></slot>
    <template v-if="isSelecting">
      <BaseButtonToolbar
        icon="check"
        color="success"
        title="Confirm"
        @click="onConfirm"
      />
      <BaseButtonToolbar
        icon="close"
        color="grey"
        title="Cancel"
        @click="onSwitchSelecting"
      />
    </template>
    <BaseButtonToolbar
      v-else
      color="error"
      icon="delete"
      @click="onSwitchSelecting"
    />
    <template #main="{ items: displayedMediaArray }">
      <MediaList :items="displayedMediaArray">
        <template #default="{ item: media }">
          <v-list-item-content class="text-h6 font-weight-regular">
            {{ media.name }}
          </v-list-item-content>
        </template>
        <template #actions="{ item: media }">
          <v-checkbox
            v-if="isSelecting"
            v-model="selectedMediaArray"
            :value="media"
          >
          </v-checkbox>
        </template>
      </MediaList>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import BaseButtonToolbar from './BaseButtonToolbar.vue';
import { Media } from '~/types/types';
export default Vue.extend({
  components: { BaseButtonToolbar },
  props: {
    mediaArray: {
      required: true,
      type: Array,
    } as PropOptions<Media[]>,
    isAdd: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isSelecting: this.isAdd,
      selectedMediaArray: [] as string[],
    };
  },
  methods: {
    onSwitchSelecting() {
      this.changeSelect();
      if (this.isAdd) this.$emit('onClose');
    },
    onConfirm() {
      this.changeSelect();
      this.$emit('onConfirm', this.selectedMediaArray);
    },
    changeSelect() {
      if (this.isAdd === false) this.isSelecting = !this.isSelecting;
    },
  },
});
</script>
