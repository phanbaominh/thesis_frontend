<template>
  <v-list>
    <PermItem
      v-for="permItem in permItems"
      :key="permItem.value"
      :perm-item="permItem"
    />
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    permItems: {
      required: true,
      type: Array,
    } as Vue.PropOptions<{ name: string; enabled: boolean; value: number }[]>,
  },
});
</script>
