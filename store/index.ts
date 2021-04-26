import { getAccessorType } from 'typed-vuex';
import { mutationTree, actionTree } from 'nuxt-typed-vuex';
import { Media, User } from '~/types/types';
// Import all your submodules
// import * as submodule from '~/store/submodule'

// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.
// ...
export const state = () => ({
  allMediaArray: [] as Media[],
  mediaTab: null as number | null,
  permTab: null as number | null,
  isSocketConnected: false,
  user: null as User | null,
  perms: [] as number[],
});

export const mutations = mutationTree(state, {
  SET_ALL_MEDIA_ARRAY(state, allMediaArray) {
    state.allMediaArray = allMediaArray;
  },
  DELETE_MEDIA_FROM_ARRAY(state, deletedIds) {
    state.allMediaArray = state.allMediaArray.filter(
      (media) => !deletedIds.includes(media._id)
    );
  },
  ADD_MEDIA_TO_ARRAY(state, media) {
    state.allMediaArray.push(media);
  },
  SET_MEDIA_TAB(state, tab) {
    state.mediaTab = tab;
  },
  SET_PERM_TAB(state, tab) {
    state.permTab = tab;
  },
  SET_PERMS(state, perms) {
    state.perms = perms;
  },
  ADD_TO_PERMS(state, perm) {
    state.perms.push(perm);
  },
  CHANGE_SOCKET_STATUS(state, status) {
    state.isSocketConnected = status;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  DELETE_USER(state) {
    state.user = null;
  },
});

// export const getters = getterTree(state, {
//   // Type-checked
//   currentArticleD: (state) => state.currentArticle as Article,
// });

export const actions = actionTree(
  { state, mutations },
  {
    async setAllMediaArray({ commit }) {
      try {
        const allMediaArray = (await this.$axios.$get(this.$apiUrl.videos))
          .videos;
        commit('SET_ALL_MEDIA_ARRAY', allMediaArray);
      } catch {
        // DO NOTHING
      }
    },
  }
);
// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  //   getters,
  mutations,
  actions,
  //   modules: {
  //     // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
  //     submodule,
  //   },
});
