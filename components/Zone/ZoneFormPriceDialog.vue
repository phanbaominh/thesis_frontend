<template>
  <BaseDialogForm
    title="Set special price:"
    :action="''"
    :control-dialog="dialog"
    :max-width="1000"
    @submit="onSubmit"
    @click="onClickOutside"
  >
    <template #activator="{ on }">
      <v-icon title="Add special price for specific hours" v-on="on">
        mdi-plus
      </v-icon>
    </template>
    <template #title.append>
      <v-btn
        class="ml-2"
        color="primary"
        x-small
        fab
        depressed
        nuxt
        @click="addPrice"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card flat outlined class="pa-4">
      <v-row v-for="(hod, i) in hods" :key="hod[0]">
        <v-col cols="4">
          <v-select
            v-model="hods[i]"
            multiple
            dense
            name="hod"
            label="Hours of day"
            :items="hodItems"
            :menu-props="{ maxHeight: '400' }"
            hint="Limited price to these hours of day"
            :rules="[(v) => v.length > 0 || 'Hour of day is required']"
            @change="onSelectHours(hods[i])"
            @click.stop="onClickSelectHour(hods[i])"
          >
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="prices[i].value"
            name="hourPrice"
            label="Price of hour"
            outlined
            dense
            type="number"
            :rules="[
              (v) => !!v || 'Price of hour is required',
              (v) => (v && v >= 0) || 'Price of hour has to be larger than 0',
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="prices[i].desc"
            name="hourDesc"
            label="Description of hour"
            outlined
            dense
            :rules="[(v) => !!v || 'Description of hour is required']"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            color="error"
            x-small
            fab
            depressed
            nuxt
            @click="removePrice(i)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
        <v-divider v-if="i !== hods.length - 1"></v-divider>
      </v-row>
    </v-card>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdsetConst, Select, ZonePrice } from '~/types/types';
export default Vue.extend({
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    initPrices: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ZonePrice[]>,
  },
  data() {
    return {
      count: 0,
      hods: (this.initPrices ? [] : [[]]) as number[][],
      prices: (this.initPrices ? [] : [{ value: 0, desc: '' }]) as ZonePrice[],
      // prices: this.initPrices as ZonePrice[],
      allHodItems: AdsetConst.hods.map((hod) => ({
        text: `${hod}-${hod + 1}`,
        value: hod,
      })) as Select[],
      hodItems: [] as Select[],
      selectedHods: [] as number[],
    };
  },
  created() {
    this.initPrices.forEach((initPrice, h) => {
      if (initPrice.desc !== 'Normal hours') {
        const index = this.prices.findIndex(
          (price) => price.desc === initPrice.desc
        );
        if (index >= 0) {
          this.hods[index].push(h);
        } else {
          this.hods.push([h]);
          this.prices.push(initPrice);
        }
      }
    });
    this.setHodItems();
  },
  methods: {
    setHodItemsSpecific(state: boolean) {
      this.hodItems = this.hodItems.map((item) => ({
        ...item,
        disabled: this.selectedHods.includes(item.value)
          ? state
          : item.disabled,
      }));
    },
    setHodItems() {
      let selectedHods = [] as number[];
      for (let i = 0; i < this.hods.length; i++) {
        selectedHods = [...selectedHods, ...this.hods[i]];
      }
      this.hodItems = this.allHodItems.map((item) => ({
        ...item,
        disabled: selectedHods.includes(item.value),
      }));
    },
    addPrice() {
      this.hods.push([]);
      this.prices.push({ value: 0, desc: '' });
    },
    removePrice(index: number) {
      this.hods = this.hods.filter((_, curIndex) => curIndex !== index);
      this.prices = this.prices.filter((_, curIndex) => curIndex !== index);
    },
    onSubmit() {
      this.$emit('submit', { hods: this.hods, prices: this.prices });
    },
    onSelectHours(currentSelectedHod: number[]) {
      this.selectedHods = currentSelectedHod;
    },
    onClickSelectHour(currentSelectedHod: number[]) {
      this.selectedHods = currentSelectedHod;
      this.setHodItemsSpecific(false);
    },
    onClickOutside() {
      this.setHodItemsSpecific(true);
      this.selectedHods = [];
    },
  },
});
</script>
