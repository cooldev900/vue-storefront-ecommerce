import Vue from 'vue';
import * as checkoutStorage from './checkoutStep-storage';

export const checkoutStore = {
  namespaced: true,
  state: {
    addressId: -1,
  },
  actions: {
    async loadAddressId ({ commit }) {
      let addressId = await checkoutStorage.loadAddressId(); 
      commit('setAddressId', addressId);
    },
    async saveAddressId ({ commit }, addressId) {
      await checkoutStorage.saveAddressId(addressId);
      commit('setAddressId', addressId);
    },
  },
  mutations: {
    setAddressId(state, value) {
      state.addressId = value;
    },
  },
  getters: {
    getAddressId: state => {
      return state.addressId;
    },
  }
};
