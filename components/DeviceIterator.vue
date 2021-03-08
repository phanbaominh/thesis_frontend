<template>
  <DataIterator
    main-component="DataIteratorCardMain"
    type="Devices"
    :init-items="devices"
  >
    <BaseButtonToolbar icon="plus" />
    <template #main="{ items: displayedDevices }">
      <v-row>
        <v-col
          v-for="(device, i) in displayedDevices"
          :key="device.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              {{ device.name }}
              <v-spacer></v-spacer>
              <v-dialog v-model="isNameDialogOpened[i]" width="300">
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="mr-2"
                    color="primary"
                    x-small
                    fab
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <DialogNameCard
                  :init-name="device.name"
                  @updateName="onChangeName(i, $event)"
                />
              </v-dialog>
              <v-btn color="error" x-small fab depressed>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                <v-list-item-content> {{ key }}: </v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ device[key.toLowerCase()] }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Device } from 'types/types';
export default Vue.extend({
  props: {
    devices: {
      required: true,
      type: Array,
    } as PropOptions<Device[]>,
  },
  data() {
    return {
      isNameDialogOpened: new Array(this.devices.length).fill(false),
    };
  },
  computed: {
    filteredKeys(): string[] {
      return Object.keys(this.devices[0]).filter((key) => key !== 'name');
    },
  },
  methods: {
    onChangeName(i: number) {
      this.isNameDialogOpened[i] = false;
      this.$forceUpdate();
    },
  },
});
</script>
