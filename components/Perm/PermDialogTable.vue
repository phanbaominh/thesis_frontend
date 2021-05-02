<template>
  <DataIterator :init-items="zoneUsers" type="Zone">
    <template #main="{ items: displayedItems }">
      <v-list>
        <v-list-item>
          <v-list-item-content
            class="text-subtitle-1 font-weight-bold text-sm-h6"
          >
            <v-row>
              <v-col cols="4">Zone</v-col>
              <v-divider vertical></v-divider>
              <v-col>User List</v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-2" />
        <template v-for="item in displayedItems">
          <v-list-item :key="item._id">
            <v-list-item-content class="text-body-1 font-weight-regular">
              <v-row>
                <v-col cols="4"> {{ item.zone }}</v-col>
                <v-divider vertical></v-divider>
                <v-col>
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
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    zoneUsers: {
      type: Array,
      required: true,
    },
  },
});
</script>
