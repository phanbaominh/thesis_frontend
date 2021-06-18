<template>
  <DataIterator :type="type" :init-items="items" :compact="compact">
    <template v-if="!readOnly">
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
        <slot name="toolbar"></slot>
        <BaseButtonToolbar
          color="error"
          icon="delete"
          @click="onSwitchSelecting"
        />
      </template>
    </template>
    <template #main="{ items: displayedItems }">
      <v-list>
        <slot name="headers"></slot>
        <template v-for="item in displayedItems">
          <v-list-item :key="item._id">
            <v-list-item-content
              class="text-subtitle-1 text-sm-h6 font-weight-regular"
            >
              <v-row>
                <slot :item="item"></slot>
                <v-col class="perm-item-actions">
                  <v-checkbox
                    v-if="isSelecting"
                    v-model="selectedItems"
                    :value="item"
                  >
                  </v-checkbox>
                  <slot v-else name="actions" :item="item"></slot>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <!--eslint-disable-next-line vue/valid-v-for-->
          <v-divider class="mx-2" />
        </template>
      </v-list>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import BaseButtonToolbar from './BaseButtonToolbar.vue';
import { Nameable } from '~/types/types';
export default Vue.extend({
  components: { BaseButtonToolbar },
  props: {
    items: {
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
    readOnly: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isSelecting: this.isAdd,
      selectedItems: [] as Nameable[],
    };
  },
  methods: {
    onSwitchSelecting() {
      this.changeSelect();
      if (this.isAdd) this.$emit('close');
    },
    onConfirm() {
      this.changeSelect();
      this.$emit('confirm', this.selectedItems);
    },
    changeSelect() {
      if (this.isAdd === false) this.isSelecting = !this.isSelecting;
    },
  },
});
</script>
<style>
.perm-item-actions {
  display: flex;
  flex-direction: row-reverse;
}
.perm-item-actions .v-input__slot {
  flex-direction: row-reverse;
  margin-bottom: 0 !important;
}
.perm-item-actions .v-input--selection-controls {
  padding-top: 0 !important;
  margin-top: 0 !important;
}
</style>
