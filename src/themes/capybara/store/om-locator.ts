import Vue from 'vue';
import * as VehicleStorage from './vehicles-storage';
// import axios from 'axios';
// import { currentStoreView } from '@vue-storefront/core/lib/multistore';
// import config from 'config';
import Locations from '../resource/locations.json';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
const { storeId } = currentStoreView();

export const omLocatorStore = {
  namespaced: true,
  state: {
    locationKind: 'delivery_estimate_free',
    location: storeId ? Locations['locations'][storeId][0] : {}
  },
  actions: {
    async clearVehicles ({ commit }) {
      await VehicleStorage.clearVehicles();
      commit('clearVehicles');
    }
  },
  mutations: {
    setLocation (state, payload) {
      Vue.set(state, 'location', payload);
    },
    setLocationKind (state, payload) {
      Vue.set(state, 'locationKind', payload);
    }
  },
  getters: {
    location: (state) => {
      return state.location;
    },
    locationKind: (state) => {
      return state.locationKind;
    }
  }
};
