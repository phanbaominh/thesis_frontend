<template>
  <v-select v-model="selectedItem" outlined dense :items="items"> </v-select>
</template>
<script lang="ts">
import Vue from 'vue';
import { Select } from '~/types/types';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as Vue.PropOptions<Select[]>,
  },
  data() {
    return {
      selectedItem: this.$accessor.analytics.value,
    };
  },
  watch: {
    selectedItem() {
      this.$accessor.SET_ANALYTICS_VALUE(this.selectedItem);
    },
  },
});
</script>
