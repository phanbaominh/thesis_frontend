<template>
  <v-list-item>
    <v-list-item-content> {{ permItem.name }}</v-list-item-content>
    <v-list-item-action>
      <v-checkbox v-model="isChecked" :value="permItem.value"> </v-checkbox
    ></v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    permItem: {
      required: true,
      type: Object,
    } as Vue.PropOptions<{ name: string; enabled: boolean; value: number }>,
  },
  data() {
    return {
      isChecked: this.permItem.enabled,
    };
  },
});
</script>
