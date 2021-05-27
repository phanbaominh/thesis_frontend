<template>
  <v-dialog v-model="dialog" width="350">
    <template #activator="{ on }">
      <v-btn text color="primary" small v-on="on"> Date </v-btn>
    </template>
    <v-card>
      <v-card-title>Pick a date:</v-card-title>

      <v-date-picker v-model="date" elevation="3" full-width></v-date-picker>

      <BaseDialogActions @close="dialog = false" @confirm="onConfirm">
        Apply
        <template #close> No </template>
      </BaseDialogActions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      date: '',
      dialog: false,
    };
  },
  methods: {
    onConfirm() {
      this.$emit('pick', this.date);
      this.dialog = false;
    },
  },
});
</script>
