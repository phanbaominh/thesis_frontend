<template>
  <div>
    <p v-if="fetchState.pending">
      <slot name="pending"></slot>
      <LoadingSpinner />
    </p>
    <slot v-else-if="fetchState.error" name="error">Error fetching!</slot>
    <slot v-else></slot>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { FetchState } from '~/types/types';

export default Vue.extend({
  props: {
    fetchState: {
      required: true,
      type: Object,
    } as PropOptions<FetchState>,
  },
});
</script>
