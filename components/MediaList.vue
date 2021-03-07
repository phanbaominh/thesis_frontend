<template>
  <v-list>
    <template v-for="item in items">
      <v-list-item :key="item.name">
        <slot :item="item">{{ item.name }}</slot>
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
