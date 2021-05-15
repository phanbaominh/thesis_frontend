<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="data"
    item-key="name"
    show-select
    class="elevation-1"
  >
    <template #body.prepend>
      <tr>
        <td
          v-for="(header, i) in headers"
          :key="header.value"
          class="text-h6"
          :colspan="i === 0 ? 2 : 1"
        >
          <span v-if="i === 0" class="">Totals </span>
          <span v-else> {{ getTotals(header.value) }}</span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { AnalyticsData, AnalyticsDataHeader } from '~/types/types';
export default Vue.extend({
  props: {
    headers: {
      type: Array,
      required: true,
    } as Vue.PropOptions<{ text: string; value: AnalyticsDataHeader }[]>,
    data: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AnalyticsData[]>,
  },
  data() {
    return {
      selected: [],
    };
  },
  watch: {
    selected() {
      this.$emit('select', this.selected);
    },
  },
  methods: {
    getTotals(key: AnalyticsDataHeader) {
      return this.data.map((d) => d[key]!).reduce((acc, ele) => acc + ele);
    },
  },
});
</script>
