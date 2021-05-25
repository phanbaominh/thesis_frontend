<template>
  <nuxt-link :to="`/adsets?q=${adset.name}`">
    {{ adset.name }}
  </nuxt-link>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    adset: {
      type: Object,
      required: true,
    },
  },
});
</script>
