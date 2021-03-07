<template>
  <v-row>
    <v-col
      v-for="item in items"
      :key="item.name"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card>
        <v-card-title class="subheading font-weight-bold">
          <nuxt-link :to="`/zones/${item.name}`">{{ item.name }}</nuxt-link>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" x-small fab depressed>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" x-small fab depressed>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>
        <v-container class="d-flex flex-column">
          <v-icon x-large color="primary" class="align-self-center">
            mdi-monitor
          </v-icon>
        </v-container>
        <!-- <v-list dense>
          <v-list-item v-for="(key, index) in filteredKeys" :key="index">
            <v-list-item-content> {{ key }}: </v-list-item-content>
            <v-list-item-content class="align-end">
              {{ item[key.toLowerCase()] }}
            </v-list-item-content>
          </v-list-item>
        </v-list> -->
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<Record<string, any>[]>,
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    filteredKeys(): string[] {
      return Object.keys(this.items[0]).filter((key) => key !== 'name');
    },
  },
});
</script>
