<template>
  <v-data-iterator
    :items="items"
    :items-per-page.sync="itemsPerPage"
    :page.sync="page"
    :search="search"
    hide-default-footer
    class="data_iterator"
  >
    <template #header>
      <v-toolbar dark color="blue darken-3" class="mb-1">
        <v-row
          :class="{
            'mt-2': $vuetify.breakpoint.width < (compact ? 430 : 300),
          }"
        >
          <v-card-title class="text-subtitle-1 text-sm-h6">
            {{ `${type}: ${initItems.length}` }}
          </v-card-title>
          <slot></slot>
          <v-spacer></v-spacer>
          <v-col
            :cols="$vuetify.breakpoint.xsOnly ? 5 : 6"
            :md="compact ? 5 : 3"
          >
            <v-text-field
              v-if="$vuetify.breakpoint.smAndUp"
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
      <v-text-field
        v-if="!$vuetify.breakpoint.smAndUp"
        v-model="search"
        clearable
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
    </template>
    <template #default="props">
      <div class="px-2">
        <slot name="main" :items="props.items"></slot>
      </div>
    </template>
    <template #footer>
      <v-row class="mt-2 px-6 mb-1" align="center">
        <span class="grey--text">Items/page</span>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              dark
              text
              color="primary"
              class="ml-1"
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
        <div
          :style="{
            display: $vuetify.breakpoint.smAndUp ? 'inline' : 'block',
          }"
        >
          <span class="mr-4 grey--text"> {{ page }}/{{ numberOfPages }} </span>
          <BaseButton
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </BaseButton>
          <BaseButton dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </BaseButton>
        </div>
      </v-row>
    </template>
  </v-data-iterator>
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
    compact: {
      default: false,
      type: Boolean,
    },
    initSearch: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: this.initSearch,
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
  watch: {
    initItems() {
      this.items = this.initItems;
    },
    initSearch() {
      this.search = this.initSearch;
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
<style scoped>
.data_iterator {
  overflow: auto;
  overflow-x: hidden;
}
</style>
