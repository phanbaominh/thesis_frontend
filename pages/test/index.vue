<template>
  <div>
    <BaseTest :color="'red'" title="haha" />
    <AdsetForm />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  auth: false,
});
</script>
