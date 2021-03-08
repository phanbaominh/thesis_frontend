<template>
  <DataIterator :type="'Items'" :init-items="mediaArray">
    <slot></slot>
    <template v-if="isDeleting">
      <BaseButtonToolbar
        icon="check"
        color="success"
        title="Confirm delete"
        @click="onConfirm"
      />
      <BaseButtonToolbar
        icon="close"
        color="grey"
        title="Cancel"
        @click="onDeleteSwitching"
      />
    </template>
    <BaseButtonToolbar
      v-else
      color="error"
      icon="delete"
      @click="onDeleteSwitching"
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
            v-if="isDeleting"
            v-model="selectedMediaArray"
            :value="media.name"
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
export default Vue.extend({
  components: { BaseButtonToolbar },
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
  data() {
    return {
      isDeleting: false,
      selectedMediaArray: [] as string[],
    };
  },
  methods: {
    onDeleteSwitching() {
      this.isDeleting = !this.isDeleting;
    },
    onConfirm() {
      this.isDeleting = !this.isDeleting;
      this.$emit('onConfirm', this.selectedMediaArray);
    },
  },
});
</script>
