<template>
  <v-card>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <MediaTabItem :media-array="videoArray" :type="'Videos'" />
      </v-tab-item>
      <v-tab-item>
        <MediaTabItem :media-array="imageArray" :type="'Images'" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
// let testArray = new Array(10).fill(0);
// testArray = testArray.map((_n, i) => ({ title: `Video${i}` }));
export default Vue.extend({
  data() {
    return {
      tab: null,
      tabItems: ['Videos', 'Images'],
      videoArray: [{ title: 'Video 1' }, { title: 'Video 2' }],
      imageArray: [{ title: 'Image 1' }, { title: 'Image 2' }],
    };
  },
});
</script>
