<template>
  <v-dialog
    v-model="dialog"
    width="1000"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-card v-bind="attrs" v-on="on">
        <v-card-title class="subheading font-weight-bold"
          >{{ user.username }}
          <v-spacer></v-spacer>
          <DialogDelete
            v-slot="{ on: on2, attrs: attrs2 }"
            @delete="$emit('delete')"
            @click.prevent
          >
            <v-btn
              color="error"
              x-small
              fab
              depressed
              v-bind="attrs2"
              v-on="on2"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </DialogDelete>
        </v-card-title>
        <v-spacer></v-spacer>
        <!-- <v-btn class="mr-2" color="primary" x-small fab depressed>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->

        <v-divider></v-divider>
        <v-card-text>
          {{ user.email }}
        </v-card-text>
      </v-card>
    </template>
    <v-card class="pa-4">
      <BaseDialogTitle @close="dialog = false">
        {{ user.username }} Permissions
      </BaseDialogTitle>

      <PermUserDialogTable :user="user" />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Subuser } from '~/types/types';
export default Vue.extend({
  props: {
    initUser: {
      required: true,
      type: Object,
    } as PropOptions<Subuser>,
  },
  data() {
    return {
      dialog: false,
      user: this.initUser,
    };
  },

  // watch: {
  //   controlDialog() {
  //     this.dialog = false;
  //   },
  // },
});
</script>
