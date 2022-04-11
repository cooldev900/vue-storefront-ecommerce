import Vue from 'vue'
import { StoryblokState } from '../types/StoryblokState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'
import config from 'config'
import { Logger } from '@vue-storefront/core/lib/logger';

export const actions: ActionTree<StoryblokState, any> = {
  async fetchAsync (context, { value, setcurrent = true }) {
    console.log('Storyblok is being fetched ...')
    try {
      const globalRes = await Vue.prototype.$storyapi.get('cdn/stories/global', {
        version: config.storyblok.version
      })
      const currentRes = await Vue.prototype.$storyapi.get('cdn/stories/' + value, {
        version: config.storyblok.version
      })
      const story = {
        global: globalRes.data.story,
        current: currentRes.data.story
      }

      context.commit(types.STORYBLOK_UPD_CURRENT, story)
    } catch (err) {
      context.commit(types.STORYBLOK_UPD_CURRENT, {})
      console.error(err)
    }
  },
  /**
   * Reset current story
   * @param {Object} context
   */
  reset (context) {
    context.commit(types.STORYBLOK_RESET_CURRENT)
  }
}
