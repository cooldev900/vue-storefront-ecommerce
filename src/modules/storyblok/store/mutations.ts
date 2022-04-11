import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import Vue from 'vue';

export const mutations: MutationTree<any> = {
  [types.STORYBLOK_UPD_CURRENT] (state, story) {
    Vue.set(state, 'story', story);
  },
  [types.STORYBLOK_RESET_CURRENT] (state) {
    state.story = {}
  }
}
