<template>
  <span v-if="priceArray && priceArray.length > 0">
    {{ $utils.moneyFormat(pricePerTimePeriod) }}/s
    <BasePriceDisplay :prices="priceArray" />
  </span>
  <span v-else>{{ $utils.moneyFormat(pricePerTimePeriod) }}/s</span>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    pricePerTimePeriod: {
      type: Number,
      required: true,
    },
    priceArray: {
      type: Array,
      default: null,
    },
  },
});
</script>
