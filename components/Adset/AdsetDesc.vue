<template>
  <v-list>
    <v-list-item
      v-for="(value, key) in displayedAdsetDesc"
      :key="key"
      class="text-body-1"
    >
      <span class="font-weight-bold mr-2">{{ key + ':' }}</span>
      {{ ` ${value}` }}
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue';
import { Adset, AdsetConst, AdsetGender } from '~/types/types';
type AdsetDesc = Omit<Adset, '_id' | 'name'>;
type AdsetKey = keyof AdsetDesc;
export default Vue.extend({
  props: {
    adSet: {
      type: Object,
      required: true,
    } as Vue.PropOptions<AdsetDesc>,
  },
  computed: {
    adsetDesc(): { [key: string]: string | undefined } {
      const ageLine = this.getLineDesc('ages', AdsetConst.ages);
      const dowLine = this.getLineDesc('daysOfWeek', AdsetConst.dows);
      const hodLine = this.getLineDesc('hoursOfDay', AdsetConst.hods);
      let genderLine;
      if (this.adSet.genders) {
        genderLine = this.adSet.genders.value
          .map((g) => (g === AdsetGender.Male ? 'Male' : 'Female'))
          .join(',');
        genderLine += this.adSet.genders.strict ? ' (strict)' : '';
      }

      return {
        Ages: ageLine,
        Gender: genderLine,
        'Days of week': dowLine,
        'Hours of day': hodLine,
      };
    },
    displayedAdsetDesc(): { [key: string]: string } {
      const desc = {} as { [key: string]: string };
      for (const [key, value] of Object.entries(this.adsetDesc)) {
        if (value) desc[key] = value;
      }
      return desc;
    },
  },
  methods: {
    getLineDesc(
      key: AdsetKey,
      adsetConst: (string | number)[]
    ): string | undefined {
      const adset = this.adSet;
      if (!adset[key]) return;
      let line = adset[key]!.value.map((val) => adsetConst[val]).join(', ');
      line += adset[key]!.strict ? ' (strict)' : '';
      return line;
    },
  },
});
</script>
