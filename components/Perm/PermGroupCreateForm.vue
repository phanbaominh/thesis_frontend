<template>
  <BaseDialogForm
    :action="`${$apiUrl.permGroups}`"
    :control-dialog="dialog"
    title="Create a permission:"
    @submit="onSubmit"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        depressed
        fab
        :color="'blue'"
        class="align-self-center mr-2"
        :small="!$vuetify.breakpoint.xs"
        :x-small="$vuetify.breakpoint.xs"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-text-field
      v-model="name"
      name="name"
      label="Name"
      outlined
      dense
      :rules="[(v) => !!v || 'Name is required']"
    >
    </v-text-field>
    <v-textarea
      v-model="desc"
      auto-grow
      name="description"
      label="Description"
      outlined
      dense
    >
    </v-textarea>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      dialog: true,
      desc: '',
      name: '',
    };
  },
  methods: {
    onSubmit() {
      this.dialog = !this.dialog;
      this.$emit('submit', { name: this.name, desc: this.desc });
    },
  },
});
</script>
