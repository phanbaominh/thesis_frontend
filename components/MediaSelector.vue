<template>
  <DataIterator :type="type" :init-items="mediaArray" :compact="compact">
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
    <template v-else>
      <slot></slot>
      <BaseButtonToolbar
        v-if="deletePerm"
        color="error"
        icon="delete"
        @click="onSwitchSelecting"
      />
    </template>
    <template #main="{ items: displayedMediaArray }">
      <MediaList :items="displayedMediaArray">
        <template #default="{ item: media }">
          <v-list-item-content
            class="text-subtitle-1 text-sm-h6 font-weight-regular"
          >
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
          <slot v-else name="actions" :media="media"></slot>
        </template>
      </MediaList>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Nameable } from '~/types/types';
export default Vue.extend({
  props: {
    mediaArray: {
      required: true,
      type: Array,
    } as PropOptions<Nameable[]>,
    isAdd: {
      default: false,
      type: Boolean,
    },
    compact: {
      default: false,
      type: Boolean,
    },
    type: {
      required: true,
      type: String,
    },
    deletePerm: {
      default: true,
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
      if (this.isAdd) this.$emit('close');
    },
    onConfirm() {
      this.changeSelect();
      this.$emit('confirm', this.selectedMediaArray);
      this.selectedMediaArray = [];
    },
    changeSelect() {
      if (this.isAdd === false) this.isSelecting = !this.isSelecting;
    },
  },
});
</script>
