<template>
  <div>
    <v-text-field
      v-model="defaultPrice"
      name="pricePerTimePeriod"
      label="Price per second"
      outlined
      dense
      hint="This is default price for all hours"
      persistent-hint
      type="number"
      :disabled="isDisabled"
      :rules="[
        (v) => (!!v && v > 0) || 'Price per second has to be larger than 0',
      ]"
    >
      <template #append-outer>
        <ZoneFormPriceDialog
          :dialog="dialog"
          :init-prices="prices"
          @submit="onSubmit"
        />
      </template>
    </v-text-field>

    <BasePriceTable v-if="prices.length > 0" :prices="prices" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdsetConst, ZonePrice } from '~/types/types';
export default Vue.extend({
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    initPrices: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<ZonePrice[]>,
  },
  data() {
    return {
      // prices: this.initPrices as ZonePrice[],
      defaultPrice:
        this.initPrices.find((price) => price.desc === 'Normal hours')?.value ||
        0,
      prices: this.initPrices as ZonePrice[],
      dialog: false,
      tableHeaders: [
        { text: 'Hour range', value: 'hod' },
        { text: 'Price per second', value: 'price' },
        { text: 'Description', value: 'desc' },
      ],
    };
  },
  computed: {
    tableData() {
      const data = [] as { hod: string; price: number; desc: string }[];
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
              price: prevPrice.value,
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
  watch: {
    defaultPrice() {
      for (let i = 0; i < AdsetConst.hods.length; i++) {
        if (this.prices[i] && this.prices[i].desc === 'Normal hours') {
          this.$set(this.prices, i, {
            value: Number(this.defaultPrice),
            desc: 'Normal hours',
          });
        }
      }
      this.$emit('change', this.prices);
    },
  },
  methods: {
    onSubmit({ hods, prices }: { hods: number[][]; prices: ZonePrice[] }) {
      for (let i = 0; i < AdsetConst.hods.length; i++) {
        this.$set(this.prices, i, {
          value: Number(this.defaultPrice),
          desc: 'Normal hours',
        });
      }
      hods.forEach((hod, index) => {
        hod.forEach((h) => {
          this.$set(this.prices, h, prices[index]);
        });
      });
      this.dialog = !this.dialog;
      this.$emit('change', this.prices);
    },
  },
});
</script>
