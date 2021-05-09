<template>
  <v-list-item @click="setDate(value)">
    <v-list-item-title> {{ text }}</v-list-item-title>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  props: {
    text: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: Number,
    },
  },
  methods: {
    setDate(dist: number) {
      const end = dayjs();
      const start = end.subtract(dist, 'day');
      this.$accessor.SET_ANALYTICS_PERIOD({ start, end });
      this.$emit('selected', { text: this.text });
    },
  },
});
</script>
