<template>
  <BaseDialogForm
    action="/"
    :title="title"
    :icon="icon"
    :control-dialog="dialog"
    @submit="onChangeName"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attr="attrs"> </slot>
    </template>
    <v-text-field
      v-model="name"
      outlined
      dense
      autofocus
      :rules="[(v) => !!v || 'Name is required']"
    ></v-text-field>
  </BaseDialogForm>
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
      dialog: true,
      valid: false,
    };
  },
  methods: {
    onChangeName() {
      this.dialog = false;
      this.$emit('updateName', this.name);
    },
  },
});
</script>
