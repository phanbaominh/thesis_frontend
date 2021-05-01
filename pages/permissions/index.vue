<template>
  <v-card>
    <v-tabs v-model="tab" grow class="mb-2">
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <PermGroupIterator />
      </v-tab-item>
      <v-tab-item>
        <PermUserIterator />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      tab: this.$accessor.permTab,
      tabItems: ['Permissions', 'Users'],
    };
  },
  watch: {
    tab() {
      this.$accessor.SET_PERM_TAB(this.tab);
    },
  },
});
</script>
