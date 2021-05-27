<template>
  <v-dialog v-model="dialog" width="350">
    <template #activator="{ on }">
      <v-btn text color="primary" small v-on="on"> Time </v-btn>
    </template>
    <v-card>
      <v-card-title>Pick a time:</v-card-title>
      <v-time-picker
        v-model="time"
        format="24hr"
        scrollable
        full-width
        class="elevation-3"
      ></v-time-picker>
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
      time: '',
      dialog: false,
    };
  },
  methods: {
    onConfirm() {
      this.$emit('pick', this.time);
      this.dialog = false;
    },
  },
});
</script>
