<template>
  <BaseDialogForm
    title="Create a device:"
    :action="`${$apiUrl}/devices`"
    :control-dialog="dialog"
    @submit="onCreateDevice"
  >
    <v-text-field
      ref="nameInput"
      v-model="name"
      name="name"
      label="Name"
      outlined
      dense
      :rules="[(v) => !!v || 'Name is required']"
    >
    </v-text-field>
    <v-text-field
      ref="nameInput"
      v-model="serialNumber"
      name="serialNumber"
      label="Serial number"
      outlined
      dense
      :rules="[(v) => !!v || 'Serial number is required']"
    >
    </v-text-field>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      dialog: true,
      serialNumber: '',
      name: '',
    };
  },
  methods: {
    async onCreateDevice() {
      try {
        const newDevice = (
          await this.$axios.$post(this.$apiUrl.devices, {
            name: this.name,
            serialNumber: this.serialNumber,
            zoneId: null,
          })
        ).device;
        this.$emit('newDevice', newDevice);
        this.dialog = !this.dialog;
      } catch {
        // DO NOTHING
      }
    },
  },
});
</script>
