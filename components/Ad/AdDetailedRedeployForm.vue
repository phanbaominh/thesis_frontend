<template>
  <BaseDialogForm
    :action="`/adoffers/${ad._id}/redeploy`"
    title="Set new budget"
    :control-dialog="dialog"
    @submit="onRedeploy"
  >
    <template #activator="{ on, attrs }">
      <v-btn color="blue darken-1" text v-bind="attrs" v-on="on">
        Redeploy
      </v-btn>
    </template>
    <v-text-field
      v-model="newBudget"
      outlined
      dense
      autofocus
      type="number"
      :rules="[(v) => !!v || 'Budget is required']"
    ></v-text-field>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { DetailedAd } from '~/types/types';
export default Vue.extend({
  props: {
    ad: {
      type: Object,
      required: true,
    } as Vue.PropOptions<DetailedAd>,
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      newBudget: 0,
    };
  },
  methods: {
    onRedeploy() {
      this.$emit('redeploy', this.newBudget);
    },
  },
});
</script>
