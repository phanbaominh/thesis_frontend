<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Loading ad set</template>
    <v-select
      v-model="selectedZoneIds"
      dense
      outlined
      label="Zone"
      name="zone"
      hint="Pick muliple zones"
      persistent-hint
      multiple
      chips
      deletable-chips
      :items="zoneSelects"
      :rules="[(v) => !!v || 'Zone is required']"
    >
      <template #item="{ on, attrs, item }">
        <v-list-item two-line v-bind="attrs" v-on="on">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name + ' - ' + item.pricePerTimePeriod + ' VND/s' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $truncate(item.locationDesc, 30) }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-select>
    <AdDetailedZoneTable
      v-if="selectedZones.length > 0"
      :zones="selectedZones"
    />
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Select } from '~/types/types';
type ZoneInfo = {
  _id: string;
  name: string;
  location: string;
  locationDesc: string;
  pricePerTimePeriod: number;
};
export default Vue.extend({
  props: {
    bdManagerId: {
      type: String,
      required: true,
    },
    zoneIds: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<string[]>,
  },
  data() {
    return {
      zonesInfo: [] as ZoneInfo[],
      zoneSelects: [] as Select[],
      selectedZoneIds: this.zoneIds as string[],
    };
  },
  async fetch() {
    this.zonesInfo = (
      await this.$axios.$get(this.$apiUrl.bdManagerZoneInfo(this.bdManagerId))
    ).zones as ZoneInfo[];
    this.zoneSelects = this.zonesInfo.map((zone) => ({
      text: zone.name,
      value: zone._id,
      ...zone,
    }));
  },
  computed: {
    selectedZones(): ZoneInfo[] {
      return this.zonesInfo.filter((zone) =>
        this.selectedZoneIds.includes(zone._id)
      );
    },
  },
  watch: {
    bdManagerId() {
      this.$fetch();
    },
    selectedZones() {
      this.$emit('update:zoneIds', this.selectedZoneIds);
    },
  },
});
</script>
