<template>
  <v-dialog width="1000">
    <template #activator="{ on, attrs }">
      <v-card v-bind="attrs" v-on="on">
        <v-card-title class="subheading font-weight-bold"
          >{{ perm.name }}
          <v-spacer></v-spacer>
          <DialogDelete
            v-slot="{ on: on2, attrs: attrs2 }"
            @delete="$emit('delete')"
            @click.prevent
          >
            <v-btn
              color="error"
              x-small
              fab
              depressed
              v-bind="attrs2"
              v-on="on2"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </DialogDelete>
        </v-card-title>
        <v-spacer></v-spacer>
        <!-- <v-btn class="mr-2" color="primary" x-small fab depressed>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->

        <v-divider></v-divider>
        <v-card-text>
          {{ perm.desc }}
        </v-card-text>
      </v-card>
    </template>
    <v-card class="pa-4">
      <v-card class="mb-4">
        <v-toolbar dark color="blue darken-3" class="mb-1" flat>
          <v-row class="text-subtitle-1 text-sm-h6">
            <v-col cols="5">Scope</v-col>

            <v-col>Permission</v-col>
          </v-row>
        </v-toolbar>

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
      <v-card class="zone-user-card">
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
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Permission } from '~/types/types';
export default Vue.extend({
  props: {
    perm: {
      required: true,
      type: Object,
    } as PropOptions<Permission>,
  },
  data() {
    return {
      tab: 0,
      tabItems: ['Media', 'User', 'Zone', 'Operation'],
      mediaPermItems: [
        { name: 'Add Media', enabled: false, value: 0 },
        { name: 'Remove Media', enabled: true, value: 1 },
      ],
      zoneUsers: [
        {
          zone: 'cool',
          users: ['user1', 'user2'],
        },
      ],
    };
  },
  methods: {},
});
</script>
<style scoped>
.perm-tabs {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
