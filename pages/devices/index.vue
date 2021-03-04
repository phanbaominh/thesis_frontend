<template>
  <v-card>
    <DeviceIterator :devices="devices">
      <v-btn small depressed fab color="blue" class="align-self-center">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </DeviceIterator>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import DeviceIterator from '~/components/DeviceIterator.vue';
let testArray = new Array(10).fill(0);
testArray = testArray.map((_n, i) => ({
  name: `Device${i}`,
  serial: '123456789',
  type: 'Digital Signage',
}));
export default Vue.extend({
  components: { DeviceIterator },
  data() {
    return {
      devices: testArray,
    };
  },
});
</script>
