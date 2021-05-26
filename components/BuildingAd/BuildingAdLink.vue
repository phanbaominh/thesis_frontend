<template>
  <nuxt-link :to="`/buildingads/${ad._id}`">{{ ad.name }}</nuxt-link>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    ad: {
      type: Object,
      required: true,
    },
  },
});
</script>
