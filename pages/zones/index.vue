<template>
  <v-card>
    <ZoneIterator :zones="zones"> </ZoneIterator>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
let testArray = new Array(10).fill(0);
testArray = testArray.map((_n, i) => ({
  name: `Zone${i}`,
}));
export default Vue.extend({
  data() {
    return {
      zones: testArray,
    };
  },
});
</script>
