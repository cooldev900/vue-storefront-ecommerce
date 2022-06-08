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
    location: storeId ? Locations['locations'][storeId][0] : {},
    activeLocation: {}
  },
  actions: {
    async clearVehicles ({ commit }) {
      await VehicleStorage.clearVehicles();
      commit('clearVehicles');
    },
    async saveActiveLocation ({ commit }, location) {
      await VehicleStorage.saveActiveLocation(location);
      commit('setActiveLocation', location);
    },
    async fetchActiveLocation ({ commit }) {
      const location = await VehicleStorage.getActiveLocation();
      commit('setActiveLocation', location);
    },
    async fetchLocationKind({commit}) {
      const location = await VehicleStorage.getLocationKind();
      commit('setLocationKind', location);
    }
  },
  mutations: {
    setLocation (state, payload) {
      Vue.set(state, 'location', payload);
    },
    async setLocationKind (state, payload) {
      await VehicleStorage.saveLocationKind(payload);
      Vue.set(state, 'locationKind', payload);
    },
    setActiveLocation (state, location) {
      Vue.set(state, 'activeLocation', location);
    }
  },
  getters: {
    location: (state) => {
      return state.location;
    },
    locationKind: (state) => {
      return state.locationKind;
    },
    activeLocation: state => {
      return state.activeLocation;
    }
  }
};
