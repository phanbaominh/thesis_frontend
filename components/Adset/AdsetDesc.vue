<template>
  <v-list>
    <v-list-item
      v-for="(value, key) in adsetDesc"
      :key="key"
      class="text-body-1"
    >
      <span class="font-weight-bold mr-2">{{ key + ':' }}</span>
      {{ ` ${value || 'None'}` }}
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue';
import { Adset, AdsetConst, AdsetGender } from '~/types/types';
type AdsetKey = Exclude<keyof Adset, '_id' | 'name'>;
export default Vue.extend({
  props: {
    adSet: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Adset>,
  },
  computed: {
    adsetDesc(): { [key: string]: string } {
      const ageLine = this.getLineDesc('ages', AdsetConst.ages);
      const dowLine = this.getLineDesc('daysOfWeek', AdsetConst.dows);
      const hodLine = this.getLineDesc('hoursOfDay', AdsetConst.hods);
      let genderLine = this.adSet.genders.value
        .map((g) => (g === AdsetGender.Male ? 'Male' : 'Female'))
        .join(',');
      genderLine += this.adSet.genders.strict ? ' (strict)' : '';
      return {
        Ages: ageLine,
        Gender: genderLine,
        'Days of week': dowLine,
        'Hours of day': hodLine,
      };
    },
  },
  methods: {
    getLineDesc(key: AdsetKey, adsetConst: (string | number)[]) {
      const adset = this.adSet;
      let line = adset[key].value.map((val) => adsetConst[val]).join(', ');
      line += adset[key].strict ? ' (strict)' : '';
      return line;
    },
  },
});
</script>
