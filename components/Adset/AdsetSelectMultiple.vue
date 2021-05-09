<template>
  <v-row>
    <v-col cols="8">
      <v-select
        v-model="selectedValue"
        outlined
        dense
        :menu-props="{ maxHeight: '400' }"
        multiple
        persistent-hint
        v-bind="$attrs"
      >
      </v-select>
    </v-col>
    <v-col>
      <v-checkbox
        v-model="selectedStrict"
        class="select-box"
        :label="`Strict`"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    value: {
      required: true,
      type: [Array, Number],
    },
    strict: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      selectedValue: this.value,
      selectedStrict: this.strict,
    };
  },
  watch: {
    selectedValue() {
      this.$emit('update:value', this.selectedValue);
    },
    selectedStrict() {
      this.$emit('update:strict', this.selectedStrict);
    },
  },
});
</script>
<style scoped>
.select-box {
  margin-top: 0 !important;
}
.select-box .v-input--selection-controls {
  padding-top: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
