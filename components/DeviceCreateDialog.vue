<template>
  <v-dialog v-model="dialog" max-width="290">
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
    <v-card class="pt-2 px-4">
      <v-card-title> Create a device: </v-card-title>

      <v-form
        ref="form"
        v-model="valid"
        :action="`${$apiUrl}/devices`"
        method="post"
        @submit.prevent="onCreateDevice"
      >
        <v-text-field
          ref="nameInput"
          v-model="name"
          name="name"
          label="Name"
          outlined
          dense
          :rules="[(v) => !!v || 'Name is required']"
        ></v-text-field>
        <v-text-field
          ref="nameInput"
          v-model="serialNumber"
          name="serialNumber"
          label="Serial number"
          outlined
          dense
          :rules="[(v) => !!v || 'Serial number is required']"
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
  data() {
    return {
      dialog: false,
      valid: false,
      serialNumber: '',
      name: '',
    };
  },
  methods: {
    async onCreateDevice() {
      if (!(this.$refs.form as any).validate()) return;
      try {
        const newDevice = (
          await this.$axios.$post(this.$apiUrl.devices, {
            name: this.name,
            serialNumber: this.serialNumber,
            zoneId: null,
          })
        ).device;
        this.$emit('newDevice', newDevice);
        this.dialog = false;
      } catch {
        // DO NOTHING
      }
    },
  },
});
</script>
