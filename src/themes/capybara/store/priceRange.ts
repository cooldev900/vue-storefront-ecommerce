import Vue from 'vue';
import * as priceRangeStorage from './priceRange-storage';

export const priceRangeStore = {
  namespaced: true,
  state: {
    maxPrice: 0,
    minPrice: 0
  },
  actions: {
    async loadMaxPrice ({ commit }) {
      let maxPrice = await priceRangeStorage.loadMaxPrice(); 
      commit('setMaxPrice', maxPrice);
    },
    async saveMaxPrice ({ commit }, maxPrice) {
      await priceRangeStorage.saveMaxPrice(maxPrice);
      commit('setMaxPrice', maxPrice);
    },
    async loadMinPrice ({ commit }) {
      let minPrice = await priceRangeStorage.loadMinPrice(); 
      commit('setMinPrice', minPrice);
    },
    async saveMinPrice ({ commit }, minPrice) {
      await priceRangeStorage.saveMinPrice(minPrice);
      commit('setMinPrice', minPrice);
    },
  },
  mutations: {
    setMaxPrice(state, value) {
      state.maxPrice = value;
    },
    setMinPrice(state, value) {
      state.minPrice = value;
    },
  },
  getters: {
    getMaxPrice: state => {
      return state.maxPrice;
    },
    getMinPrice: state => {
      return state.minPrice;
    },
  }
};
