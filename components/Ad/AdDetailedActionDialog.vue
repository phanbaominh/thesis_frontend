<template>
  <DialogDelete :max-width="500" @delete="$emit('confirm')">
    <template #title><slot></slot></template>
    <template #default="{ on }">
      <v-btn v-bind="$attrs" text color="blue darken-1" v-on="on">
        <slot name="name"></slot>
      </v-btn>
    </template>
  </DialogDelete>
</template>
