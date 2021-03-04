<template>
  <v-text-field
    class="search-box"
    :value="value"
    outlined
    height="20px"
    prepend-inner-icon="mdi-magnify"
    :placeholder="`Search ${type}`"
    @input="$emit('input', $event)"
  >
  </v-text-field>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    value: {
      required: true,
    },
    type: {
      required: true,
      type: String,
    },
  },
});
</script>
<style scoped>
.search-box {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
