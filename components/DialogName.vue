<template>
  <v-dialog v-model="dialog" max-width="290">
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs">
        <v-btn
          small
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-{{ icon }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card class="pt-2 px-4">
      <v-card-title>{{ title }}</v-card-title>

      <v-text-field
        ref="nameInput"
        v-model="name"
        outlined
        dense
      ></v-text-field>

      <BaseDialogActions @close="dialog = false" @confirm="onChangeName">
        Save
        <template #close> Close </template>
      </BaseDialogActions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    initName: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    icon: {
      type: String,
      default: 'plus',
    },
  },
  data() {
    return {
      name: this.initName,
      dialog: false,
    };
  },
  methods: {
    onOpenDialog() {
      (this.$refs.nameInput as any).focus();
    },
    onChangeName() {
      this.dialog = false;
      this.$emit('updateName', this.name);
    },
  },
});
</script>
