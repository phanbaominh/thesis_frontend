<template>
  <v-card class="pt-2 px-4">
    <div class="text-center">
      <v-card-title>Change device name:</v-card-title>
    </div>
    <v-row no-gutters>
      <v-col class="mr-2" cols="8">
        <v-text-field
          ref="nameInput"
          v-model="name"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col>
        <v-card-actions>
          <v-btn color="primary" fab x-small depressed @click="onChangeName">
            <v-icon> mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    initName: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      name: this.initName,
    };
  },
  mounted() {
    (this.$refs.nameInput as any).focus();
  },
  methods: {
    onChangeName() {
      this.$emit('updateName', this.name);
    },
  },
});
</script>
