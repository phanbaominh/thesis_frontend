<template>
  <BaseDialogForm
    :action="`${$apiUrl.adsets}`"
    :control-dialog="dialog"
    v-bind="$attrs"
    @submit="onSubmit"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <AdBelongToChips
      v-if="initAdset"
      :id="adset._id"
      key-name="adSet"
      class="mb-2"
    />
    <v-text-field
      v-model="adset.name"
      name="name"
      label="Name"
      outlined
      dense
      :rules="[(v) => !!v || 'Name is required']"
    >
    </v-text-field>

    <!-- <AdsetSelectMultiple
      name="age"
      label="Age ranges"
      :items="ages"
      :disabled="isUpdateForm"
      :menu-props="{ maxHeight: '400' }"
      hint="Limited ads to these age ranges"
      :rules="[(v) => v.length > 0 || 'Age range is required']"
      v-bind.sync="adset.ages"
    >
    </AdsetSelectMultiple>
    <AdsetSelectMultiple
      name="gender"
      label="Gender"
      :items="genders"
      :disabled="isUpdateForm"
      :menu-props="{ maxHeight: '400' }"
      hint="Limited ads to these genders"
      :rules="[(v) => v.length > 0 || 'Gender is required']"
      v-bind.sync="adset.genders"
      :multiple="null"
    >
    </AdsetSelectMultiple> -->
    <AdsetSelectMultiple
      name="dow"
      label="Days of week"
      :items="dows"
      :menu-props="{ maxHeight: '400' }"
      required-strict
      hint="Limited ads to these days of the week"
      :rules="[(v) => v.length > 0 || 'Day of week required']"
      v-bind.sync="adset.daysOfWeek"
    >
    </AdsetSelectMultiple>
    <AdsetSelectMultiple
      name="hod"
      label="Hours of day"
      :items="hods"
      :menu-props="{ maxHeight: '400' }"
      hint="Limited ads to these hours of day"
      :rules="[(v) => v.length > 0 || 'Hour of day is required']"
      v-bind.sync="adset.hoursOfDay"
    >
    </AdsetSelectMultiple>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { Adset, AdsetConst, Select } from '~/types/types';
export default Vue.extend({
  props: {
    initAdset: {
      default: null,
      type: Object,
    } as Vue.PropOptions<Adset | null>,
    dialog: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      ads: [] as { _id: string; name: string }[],
      adset: {
        name: '',
        daysOfWeek: { value: [] as number[], strict: true },
        hoursOfDay: { value: [] as number[], strict: false },
        ages: { value: [] as number[], strict: false },
        genders: { value: [] as number[], strict: false },
        ...this.initAdset,
      } as Omit<Adset, '_id'>,
      ages: [] as Select[],
      genders: [
        { text: 'Male', value: 10 },
        { text: 'Female', value: 11 },
      ] as Select[],
      dows: AdsetConst.dows.map((dow, i) => ({
        text: dow,
        value: i,
      })) as Select[],
      hods: AdsetConst.hods.map((hod) => ({
        text: `${hod}-${hod + 1}`,
        value: hod,
      })) as Select[],
    };
  },

  computed: {
    isUpdateForm(): boolean {
      return !!this.initAdset;
    },
  },
  created() {
    AdsetConst.ages.forEach((range, i) =>
      this.ages.push({ value: i, text: range })
    );
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.adset);
    },
  },
});
</script>
