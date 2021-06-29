<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>
      <span> Fetching devices...</span>
    </template>
    <DataIterator type="Devices" :init-items="formattedDevices">
      <DeviceCreateDialog
        v-if="canGeneralWriteDevice"
        @newDevice="onNewDevice"
      />
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
                  v-if="canGeneralWriteDevice"
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
                <DialogDelete
                  v-if="canGeneralDeleteDevice"
                  v-slot="{ on, attrs }"
                  @delete="onDelete(i)"
                >
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
                  <v-list-item-content
                    class="align-end"
                    style="word-wrap: break-word"
                  >
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
import { Device, Permission } from '~/types/types';
export default Vue.extend({
  middleware: [
    'checkUserIsBuildingManager',
    ({ $permission, $auth, redirect }) => {
      if ($auth.user) {
        if (!$permission.check($permission.DevicePermissions))
          return redirect('/');
      }
    },
  ],
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
      return Object.keys(this.formattedDevices[0]).filter(
        (key) => key !== 'name' && key[0] !== '_'
      );
    },
    canGeneralWriteDevice(): boolean {
      return this.$permission.check(Permission.WriteDevice);
    },
    canGeneralDeleteDevice(): boolean {
      return this.$permission.check(Permission.DeleteDevice);
    },
    formattedDevices(): { 'Serial number': string; Zone: string }[] {
      return this.devices.map((dev) => ({
        name: dev.name,
        'Serial number': dev.serialNumber,
        Zone: dev.zoneId?.name || 'None',
      }));
    },
  },
  methods: {
    async onChangeName(i: number, newName: string) {
      // this.isNameDialogOpened[i] = false;
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.device(this.devices[i]._id), {
          ...this.devices[i],
          name: newName,
        });
        this.devices[i].name = newName;
      });
    },
    async onDelete(i: number) {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.device(this.devices[i]._id));
        this.devices = this.devices.filter((_, index) => index !== i);
      });
    },
    onNewDevice(newDevice: Device) {
      this.devices.push(newDevice);
    },
  },
});
</script>
