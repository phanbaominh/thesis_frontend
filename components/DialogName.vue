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

      <v-form ref="form" v-model="valid" @submit.prevent="onChangeName">
        <v-text-field
          v-model="name"
          outlined
          dense
          autofocus
          :rules="[(v) => !!v || 'Name is required']"
        ></v-text-field>
        <BaseSubmitActions @close="dialog = false">
          Save
          <template #close> Close </template>
        </BaseSubmitActions>
      </v-form>
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
      valid: false,
    };
  },
  methods: {
    onChangeName() {
      if (!(this.$refs.form as any).validate()) return;
      this.dialog = false;
      this.$emit('updateName', this.name);
    },
  },
});
</script>
