import { Module } from 'vuex'
import { StoryblokState } from '../types/StoryblokState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export const module: Module<StoryblokState, any> = {
  namespaced: true,
  mutations,
  actions,
  getters
}
