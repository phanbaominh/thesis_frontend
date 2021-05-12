<template>
  <v-card-title>
    <slot></slot>
    <v-spacer></v-spacer>
    <v-btn fab x-small color="grey lighten-3" depressed @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card-title>
</template>
