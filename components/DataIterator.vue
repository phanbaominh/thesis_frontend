<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      hide-default-footer
    >
      <template #header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-row>
            <v-card-title>
              {{ `${type}: ${initItems.length}` }}
            </v-card-title>
            <slot></slot>
            <v-spacer></v-spacer>
            <v-col cols="6" md="3">
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Search"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>

      <template #default="props">
        <component
          :is="mainComponent"
          :items="props.items"
          :type="type"
        ></component>
      </template>

      <template #footer>
        <v-row class="mt-2 px-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            depressed
            small
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            depressed
            small
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
// let testArray = new Array(10).fill(0);
// testArray = testArray.map((_n, i) => ({ title: `Video${i}` }));
export default Vue.extend({
  props: {
    initItems: {
      required: true,
      type: Array,
    },
    type: {
      required: true,
      type: String,
    },
    mainComponent: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      page: 1,
      itemsPerPage: 12,
      items: this.initItems, // this.mediaArray,
    };
  },
  computed: {
    numberOfPages(): number {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number: number) {
      this.itemsPerPage = number;
    },
  },
});
</script>
