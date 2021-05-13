<template>
  <div class="d-flex flex-column">
    <div class="text-caption align-self-center">
      {{ $accessor.analytics.timeStart.format('YYYY-MM-DD') }} -
      {{ $accessor.analytics.timeEnd.format('YYYY-MM-DD') }}
    </div>
    <v-menu v-model="showMenu" offset-y :close-on-content-click="false">
      <template #activator="{ on, attrs }">
        <v-btn outlined v-bind="attrs" v-on="on">
          <div>{{ selectedText }} <v-icon> mdi-menu-down</v-icon></div>
        </v-btn>
      </template>
      <v-list>
        <AnalyticsDatePickerMenuItem
          v-for="(text, value) in diffToText"
          :key="value"
          :text="text"
          :value="Number(value)"
          @selected="onSelected"
        />
        <v-list-item v-if="!isCustom" @click="isCustom = true">
          <v-list-item-title>Custom</v-list-item-title>
        </v-list-item>
        <div v-else>
          <v-date-picker v-model="dates" range></v-date-picker>
          <BaseDialogActions @close="isCustom = false" @confirm="onApplyCustom">
            Apply
            <template #close> No </template>
          </BaseDialogActions>
        </div>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  data() {
    return {
      dates: [] as string[],
      diffToText: {
        7: 'Last 7 days',
        28: 'Last 28 days',
        365: 'Last 365 days',
      } as { [key: number]: string },
      selectedText: 'Last 7 days',
      isCustom: false,
      showMenu: false,
    };
  },
  watch: {
    showMenu() {
      if (!this.showMenu) this.isCustom = false;
    },
  },
  created() {
    const { timeStart, timeEnd } = this.$accessor.analytics;
    const diffday = timeEnd.diff(timeStart, 'd');
    this.selectedText = this.diffToText[diffday + 1] || 'Custom';
  },
  methods: {
    onApplyCustom() {
      this.selectedText = 'Custom';
      this.isCustom = false;
      this.$accessor.SET_ANALYTICS_PERIOD({
        start: dayjs(this.dates[0]),
        end: dayjs(this.dates[1]),
      });
      this.showMenu = false;
    },
    onSelected({ text }: { text: string }) {
      this.selectedText = text;
      this.showMenu = false;
    },
  },
});
</script>
