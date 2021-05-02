<template>
  <v-row class="pa-4">
    <v-col v-if="isNameChanging" :cols="3">
      <v-text-field ref="nameInput" v-model="name" class="text-h6">
        <template #append-outer>
          <v-btn color="blue" dark fab small depressed @click="onChangeName">
            <v-icon> mdi-{{ isNameChanging ? 'check' : 'pencil' }}</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-col>

    <template v-else>
      <BaseDialogTitle @close="$emit('closeDialog')">
        {{ $truncate(name) }}
      </BaseDialogTitle>
      <v-card-actions>
        <v-btn color="blue" dark fab small depressed @click="onChangeName">
          <v-icon> mdi-{{ isNameChanging ? 'check' : 'pencil' }}</v-icon>
        </v-btn>
      </v-card-actions>
    </template>
  </v-row>
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
      isNameChanging: false,
      name: this.initName,
    };
  },
  updated() {
    if (this.isNameChanging) (this.$refs.nameInput as any).focus();
  },
  methods: {
    onChangeName() {
      this.isNameChanging = !this.isNameChanging;
      if (!this.isNameChanging) this.$emit('updateName', this.name);
    },
  },
});
</script>
