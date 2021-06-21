<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableData"
    :items-per-page="24"
    class="elevation-1"
    hide-default-footer
  >
  </v-data-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdsetConst, ZonePrice } from '~/types/types';
export default Vue.extend({
  props: {
    prices: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ZonePrice[]>,
  },
  data() {
    return {
      tableHeaders: [
        { text: 'Hour range', value: 'hod' },
        { text: 'Price per second', value: 'price' },
        { text: 'Description', value: 'desc' },
      ],
    };
  },
  computed: {
    tableData() {
      const data = [] as { hod: string; price: string; desc: string }[];
      if (this.prices.length > 0) {
        let prevPrice = this.prices[0];
        let prevIndex = 0;

        this.prices.forEach((price, curIndex) => {
          if (
            price.desc !== prevPrice.desc ||
            curIndex === AdsetConst.hods.length - 1
          ) {
            if (curIndex === AdsetConst.hods.length - 1) curIndex += 1;

            data.push({
              hod: `${prevIndex}-${curIndex}`,
              price: this.$utils.moneyFormat(prevPrice.value) + '/s',
              desc: prevPrice.desc,
            });
            prevPrice = price;
            prevIndex = curIndex;
          }
        });
      }
      return data;
    },
  },
});
</script>
