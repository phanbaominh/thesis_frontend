<template>
  <v-list>
    <template v-for="item in items">
      <v-list-item :key="item.name">
        <v-list-item-content
          class="text-subtitle-1 text-sm-h6 font-weight-regular"
        >
          <slot :item="item">{{ item.name }} </slot>
        </v-list-item-content>

        <slot :item="item" name="actions"></slot>
      </v-list-item>
      <!--eslint-disable-next-line vue/valid-v-for-->
      <v-divider class="mx-2" />
    </template>
  </v-list>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<{ name: string }[]>,
  },
});
</script>
