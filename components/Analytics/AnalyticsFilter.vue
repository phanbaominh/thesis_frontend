<template>
  <v-menu>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        <v-icon>mdi-filter</v-icon>
        Filter
      </v-btn>
    </template>
  </v-menu>
</template>
