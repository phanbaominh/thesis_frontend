<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" scrollable persistent>
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs">
        <v-btn
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          v-bind="attrs"
          dark
          :disabled="disabled"
          v-on="on"
        >
          <v-icon>mdi-{{ icon }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card
      class="pt-2 px-4 card-focus"
      :ripple="false"
      @click="$emit('click')"
    >
      <BaseDialogTitle @close="onCloseDialog">
        {{ title }}
        <slot name="title.append"></slot>
      </BaseDialogTitle>

      <v-form
        ref="form"
        v-model="valid"
        :action="action"
        method="post"
        :disabled="disabled"
        @submit.prevent="onSubmit"
      >
        <slot></slot>
        <BaseSubmitActions @close="onCloseDialog">
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
    title: {
      required: true,
      type: String,
    },
    action: {
      default: '',
      type: String,
    },
    controlDialog: {
      required: true,
      type: Boolean,
    },
    icon: {
      default: 'plus',
      type: String,
    },
    maxWidth: {
      default: 350,
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      valid: false,
    };
  },
  watch: {
    controlDialog() {
      this.dialog = false;
    },
  },
  methods: {
    onSubmit() {
      if (!(this.$refs.form as any).validate()) return;
      this.$emit('submit');
    },
    onCloseDialog() {
      this.$emit('close');
      this.dialog = false;
    },
  },
});
</script>
