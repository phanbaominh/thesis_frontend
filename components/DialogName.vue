<template>
  <v-dialog v-model="dialog" max-width="290">
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"></slot>
    </template>
    <v-card class="pt-2 px-4">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col cols="8">
              <v-text-field
                ref="nameInput"
                v-model="name"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-btn
              color="primary"
              class="ml-2 mt-1"
              fab
              x-small
              depressed
              @click="onChangeName"
            >
              <v-icon> mdi-check</v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
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
  },
  data() {
    return {
      name: this.initName,
      dialog: false,
    };
  },
  methods: {
    onOpenDialog() {
      (this.$refs.nameInput as any).focus();
    },
    onChangeName() {
      this.dialog = false;
      this.$emit('updateName', this.name);
    },
  },
});
</script>
