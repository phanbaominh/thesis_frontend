<template>
  <v-btn
    :small="!$vuetify.breakpoint.xs"
    :x-small="$vuetify.breakpoint.xs"
    fab
    depressed
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </v-btn>
</template>
