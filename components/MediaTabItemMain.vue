<template>
  <div>
    <v-list>
      <template v-for="media in items">
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
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<{ title: string }[]>,
    type: {
      required: true,
      type: String,
    },
  },
});
</script>
