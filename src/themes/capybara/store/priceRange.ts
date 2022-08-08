import Vue from 'vue';
import * as priceRangeStorage from './priceRange-storage';

export const priceRangeStore = {
  namespaced: true,
  state: {
    maxPrice: 0,
    minPrice: 0,
    startPrice: 0,
    endPrice: 0,
    categoryId: -1,
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
    async loadCategoryId ({ commit }) {
      let categoryId = await priceRangeStorage.loadCategoryId(); 
      commit('setCategoryId', categoryId);
    },
    async saveCategoryId ({ commit }, categoryId) {
      await priceRangeStorage.saveCategoryId(categoryId);
      commit('setCategoryId', categoryId);
    },
    async loadStartPrice ({ commit }) {
      let startPrice = await priceRangeStorage.loadStartPrice(); 
      commit('setStartPrice', startPrice);
    },
    async saveStartPrice ({ commit }, startPrice) {
      await priceRangeStorage.saveStartPrice(startPrice);
      commit('setStartPrice', startPrice);
    },
    async loadEndPrice ({ commit }) {
      let endPrice = await priceRangeStorage.loadEndPrice(); 
      commit('setEndPrice', endPrice);
    },
    async saveEndPrice ({ commit }, endPrice) {
      await priceRangeStorage.saveEndPrice(endPrice);
      commit('setEndPrice', endPrice);
    },
  },
  mutations: {
    setMaxPrice(state, value) {
      state.maxPrice = value;
    },
    setMinPrice(state, value) {
      state.minPrice = value;
    },
    setCategoryId(state, value) {
      state.categoryId = value;
    },
    setStartPrice(state, value) {
      state.startPrice = value;
    },
    setEndPrice(state, value) {
      state.endPrice = value;
    }
  },
  getters: {
    getMaxPrice: state => {
      return state.maxPrice;
    },
    getMinPrice: state => {
      return state.minPrice;
    },
    getCategoryId: state => {
      return state.categoryId;
    },
    getStartPrice: state => state.startPrice,
    getEndPrice: state => state.endPrice,
  }
};
