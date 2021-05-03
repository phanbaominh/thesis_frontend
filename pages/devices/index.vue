<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>
      <span> Fetching devices...</span>
    </template>
    <DataIterator type="Devices" :init-items="devices">
      <DeviceCreateDialog @newDevice="onNewDevice" />
      <template #main="{ items: displayedDevices }">
        <v-row>
          <v-col
            v-for="(device, i) in displayedDevices"
            :key="device.serial"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ device.name }}
                <v-spacer></v-spacer>
                <DialogName
                  v-slot="{ on, attrs }"
                  :init-name="device.name"
                  title="Change device name:"
                  @updateName="onChangeName(i, $event)"
                >
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
                </DialogName>
                <DialogDelete v-slot="{ on, attrs }" @delete="onDelete(i)">
                  <v-btn
                    color="error"
                    x-small
                    fab
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </DialogDelete>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content> {{ key }}: </v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ device[key] || 'None' }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Device } from 'types/types';
export default Vue.extend({
  middleware({ $permission, $auth, redirect }) {
    if ($auth.user) {
      if (!$permission.check($permission.DevicePermissions))
        return redirect('/');
    }
  },
  data() {
    return {
      devices: [] as Device[],
      // isNameDialogOpened: [] as Boolean[],
    };
  },
  async fetch() {
    this.devices = (await this.$axios.$get(this.$apiUrl.devices)).devices;
  },
  computed: {
    filteredKeys(): string[] {
      return Object.keys(this.devices[0]).filter(
        (key) => key !== 'name' && key[0] !== '_'
      );
    },
  },
  methods: {
    async onChangeName(i: number, newName: string) {
      // this.isNameDialogOpened[i] = false;
      try {
        await this.$axios.$put(this.$apiUrl.device(this.devices[i]._id), {
          ...this.devices[i],
          name: newName,
        });
        this.devices[i].name = newName;
      } catch {
        // DO NOTHING
      }
    },
    async onDelete(i: number) {
      try {
        await this.$axios.$delete(this.$apiUrl.device(this.devices[i]._id));
        this.devices = this.devices.filter((_, index) => index !== i);
      } catch {
        // DO NOTHING
      }
    },
    onNewDevice(newDevice: Device) {
      this.devices.push(newDevice);
    },
  },
});
</script>
