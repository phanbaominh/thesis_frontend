<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="data"
    item-key="name"
    show-select
    class="elevation-1"
  >
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    headers: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  watch: {
    selected() {
      this.$emit('select', this.selected);
    },
  },
});
</script>
