<template>
  <v-dialog width="1000">
    <template #activator="{ on, attrs }">
      <v-card v-bind="attrs" v-on="on">
        <v-card-title class="subheading font-weight-bold">{{
          name
        }}</v-card-title></v-card
      >
    </template>
    <v-card class="pa-4">
      <v-card outlined class="mb-2">
        <v-tabs v-model="tab" vertical>
          <div class="perm-tabs">
            <v-tab v-for="item in tabItems" :key="item">
              {{ item }}
            </v-tab>
          </div>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <PermItems :perm-items="mediaPermItems" />
            </v-tab-item>
            <v-tab-item> </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card>
      <v-card>
        <DataIterator :init-items="items" type="Zone">
          <template #main="{ items: displayedItems }">
            <v-list>
              <template v-for="item in displayedItems">
                <v-list-item :key="item._id">
                  <v-list-item-content
                    class="text-subtitle-1 text-sm-h6 font-weight-regular"
                  >
                    <v-row>
                      <v-col cols="4"> {{ item.zone }}</v-col>
                      <v-col class="d.flex flex-column align-center">
                        <div v-for="user in item.users" :key="user">
                          {{ user }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
                <!--eslint-disable-next-line vue/valid-v-for-->
                <v-divider class="mx-2" />
              </template>
            </v-list>
          </template>
        </DataIterator>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<{ zone: string; users: string[] }[]>,
    name: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      tab: 0,
      tabItems: ['Media', 'User', 'Zone', 'Operation'],
      mediaPermItems: [
        { name: 'Add Media', enabled: false, value: 0 },
        { name: 'Remove Media', enabled: true, value: 1 },
      ],
    };
  },
});
</script>
<style scoped>
.perm-tabs {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
