<template>
  <v-card>
    <v-row class="mt-2">
      <v-col class="mr-auto">
        <v-card-title>
          {{ `${type}: ${mediaArray.length}` }}
        </v-card-title>
      </v-col>
      <v-col sm="3" class="search-box">
        <v-text-field
          v-model="searchText"
          outlined
          height="20px"
          :placeholder="`Search ${type}`"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn block x-large>
        Upload {{ type }}
        <v-icon class="ml-2" large> mdi-cloud-upload </v-icon>
      </v-btn>
    </v-card-actions>
    <v-list>
      <template v-for="media in displayMediaArray">
        <v-list-item :key="media.title">
          <v-list-item-content class="text-h6 font-weight-regular">
            {{ media.title }}
          </v-list-item-content>
          <v-list-item-action>
            <v-btn fab depressed small color="primary"
              ><v-icon>mdi-play</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn fab depressed small color="error"
              ><v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <!--eslint-disable-next-line vue/valid-v-for-->
        <v-divider class="mx-2" />
      </template>
    </v-list>
  </v-card>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    mediaArray: {
      required: true,
      type: Array,
    } as PropOptions<{ title: string }[]>,
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      searchText: '',
      displayMediaArray: this.mediaArray,
    };
  },
  watch: {
    searchText(text) {
      const searchRegex = new RegExp(`.*${text}`);
      this.displayMediaArray = this.mediaArray.filter((media) =>
        searchRegex.test(media.title)
      );
    },
  },
});
</script>
<style scoped>
.search-box {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
