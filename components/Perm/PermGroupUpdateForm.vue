<template>
  <v-form
    ref="form"
    v-model="valid"
    :disabled="disabled"
    @submit.prevent="onSubmit"
  >
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
    <BaseSubmitActions is-not-dialog :is-disabled="disabled">
      Update
    </BaseSubmitActions>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { PermissionGroup } from '~/types/types';
export default Vue.extend({
  props: {
    permGroup: {
      required: true,
      type: Object,
    } as Vue.PropOptions<PermissionGroup>,
    disabled: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      valid: false,
      desc: this.permGroup.desc,
      name: this.permGroup.name,
    };
  },
  methods: {
    onSubmit() {
      this.$emit('submit', {
        name: this.name,
        desc: this.desc,
        permissions: this.$accessor.perms,
      });
    },
  },
});
</script>
