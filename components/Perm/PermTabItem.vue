<template>
  <v-list>
    <PermItem
      v-for="(enabled, permName) in permTabItem"
      :key="permName"
      :enabled="enabled"
      :name="permName"
      :disabled="disabled"
    />
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue';
import { PermissionTabItem } from '~/types/types';
export default Vue.extend({
  props: {
    permTabItem: {
      required: true,
      type: Object,
    } as Vue.PropOptions<PermissionTabItem>,
    disabled: {
      required: true,
      type: Boolean,
    },
  },
});
</script>
