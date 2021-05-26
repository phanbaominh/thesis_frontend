<template>
  <nuxt-link :to="`/zones/${zone._id}`">{{ zone.name }}</nuxt-link>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    zone: {
      required: true,
      type: Object,
    },
  },
});
</script>
