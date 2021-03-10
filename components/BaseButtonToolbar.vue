<template>
  <BaseButton
    :depressed="true"
    :fab="true"
    :color="color"
    v-bind="$attrs"
    class="align-self-center mr-2"
    @click="$emit('click', $event)"
  >
    <v-icon>mdi-{{ icon }}</v-icon>
  </BaseButton>
</template>
<script lang="ts">
import Vue from 'vue';
import BaseButton from './BaseButton.vue';
export default Vue.extend({
  components: { BaseButton },
  props: {
    icon: {
      required: true,
      type: String,
    },
    color: {
      default: 'blue',
      type: String,
    },
  },
});
</script>
