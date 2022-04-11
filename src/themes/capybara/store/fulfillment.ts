import Vue from 'vue';
import * as VehicleStorage from './vehicles-storage';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

export const FulfillmentStore = {
  namespaced: true,
  state: {
    requirefitting: []
  },
  mutations: {
    UPDATE_FAVORITES (state, payload) {
      state.requirefitting = payload
    }
  },
  actions: {
    addToFavorites (context, payload) {
      const requirefitting = context.state.requirefitting
      requirefitting.push(payload)
      context.commit('UPDATE_FAVORITES', requirefitting)
    }
  },
  getters: {
    fullName: function (state) {
      return `${state.firstName} ${state.lastName}`
    }
  }
};
