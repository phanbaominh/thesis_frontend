<template>
  <nuxt-link :to="`/playlists?q=${content.name}`">
    {{ content.name }}
  </nuxt-link>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
});
</script>
