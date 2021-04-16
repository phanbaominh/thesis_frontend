<template>
  <v-card>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <MediaTabItem :type="'Videos'" />
      </v-tab-item>
      <v-tab-item>
        <MediaTabItemPlaylist />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      tab: this.$accessor.mediaTab,
      tabItems: ['Videos', 'Playlists'],
    };
  },
  watch: {
    tab(newTab) {
      this.$accessor.SET_MEDIA_TAB(newTab);
    },
  },
  created() {
    this.$socket.emit('test', 'abc');
  },
});
</script>
