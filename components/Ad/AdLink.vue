<template>
  <nuxt-link :to="`/ads/${ad._id}`">{{ ad.name }}</nuxt-link>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    ad: {
      required: true,
      type: Object,
    },
  },
});
</script>
