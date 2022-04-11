import Vue from 'vue';
import * as VehicleStorage from './vehicles-storage';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

export const vehiclesStore = {
  namespaced: true,
  state: {
    savedVehicles: [],
    activeVehicle: {},
    svgs: {},
    tooltips: [],
    selectedSvgCode: '',
    svgEventName: '',
    criterias: [],
    stripeToken: null,
    showSetPrompt: false,
    globalSbData: {},
    pageSbData: null,
    storyblok: {}
  },
  actions: {
    async fetchVehicles ({ commit }) {
      const result = await VehicleStorage.getSavedVehiclesData();

      commit('setVehicles', result);
    },
    async fetchActiveVehicle ({ commit }) {
      const result = await VehicleStorage.getActiveVehicleData();

      commit('setActiveVehicle', result);
    },
    async saveVehicles ({ commit }, vehicle) {
      await VehicleStorage.saveVehicles(vehicle);
      const vehicles = await VehicleStorage.getSavedVehiclesData();
      commit('setVehicles', vehicles);
    },
    async saveActiveVehicle ({ commit }, vehicle) {
      await VehicleStorage.saveActiveVehicle(vehicle);
      commit('setActiveVehicle', vehicle);
    },
    async removeVehicle ({ commit }, vehicle) {
      await VehicleStorage.removeVehicle(vehicle);
      commit('removeVehicle', vehicle);
    },
    async clearVehicles ({ commit }) {
      await VehicleStorage.clearVehicles();
      commit('clearVehicles');
    },
    /** ***  Storyblok *****/
    async fetchSbData ({ commit }, pageId) {
      const res = await axios.get(
        `${config.api.url}/api/storyblok/storyblok-1/${pageId}`
      );

      if (res.data.success) {
        if (pageId === 'global') {
          commit('setGlobalSbData', res.data.result.content);
        } else {
          commit('setSbData', res.data.result.content);
        }
      }
    }
  },
  mutations: {
    addNewSvg (state, svg) {
      const { key, value } = svg;
      const stateSvgInstance = Object.assign({}, state.svgs);
      stateSvgInstance[key] = value;
      state.svgs = stateSvgInstance;
    },
    clearSvgs (state) {
      state.svgs = {};
    },
    setActiveVehicle (state, vehicle) {
      Vue.set(state, 'activeVehicle', vehicle);
    },
    setVehicles (state, vehicles) {
      Vue.set(state, 'savedVehicles', vehicles);
    },
    removeVehicle (state, vehicle) {
      const oldVehicles = [...state.savedVehicles];
      const newVehicles = oldVehicles.filter(v => {
        return v.national_code !== vehicle.national_code;
      });
      Vue.set(state, 'savedVehicles', newVehicles);

      if (state.activeVehicle.national_code === vehicle.national_code) {
        Vue.set(state, 'activeVehicle', newVehicles[0]);
      }
    },
    clearVehicles (state) {
      Vue.set(state, 'activeVehicle', {});
      Vue.set(state, 'activeVehicle', []);
    },
    setTooltips (state, payload) {
      Vue.set(state, 'tooltips', payload);
    },
    setSelectedSvgCode (state, payload) {
      Vue.set(state, 'selectedSvgCode', payload);
    },
    setSvgEvent (state, payload) {
      Vue.set(state, 'svgEventName', payload);
    },
    setCriterias (state, payload) {
      Vue.set(state, 'criterias', payload);
    },
    setStripeToken (state, payload) {
      Vue.set(state, 'stripeToken', payload);
    },
    toggleSetPrompt (state, payload) {
      Vue.set(state, 'showSetPrompt', payload);
    },
    /** ***  Storyblok *****/
    setSbData (state, payload) {
      Vue.set(state, 'pageSbData', payload);
    },
    setGlobalSbData (state, payload) {
      Vue.set(state, 'globalSbData', payload);
    }
  },
  getters: {
    getAttributeIdByLabel: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeLabel
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }
      const attributeId = attribute.options.find(
        option => option.label === attributeLabel
      )?.value;
      return attributeId || null;
    },
    getAttributeLabelById: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeId
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }

      const attributeLabel = attribute.options.find(
        option => option.value === attributeId.toString()
      )?.label;
      return attributeLabel || null;
    },
    getVehicleByNationalCode: (
      state,
      getters,
      rootState,
      rootGetters
    ) => nationalCode => {
      return state.savedVehicles.find(
        vehicle => vehicle.national_code === nationalCode
      );
    },
    vehicles: state => {
      const result = state?.savedVehicles ? state.savedVehicles.filter(
        vehicle => vehicle.national_code !== state.activeVehicle.national_code
      ) : [];

      if (state.activeVehicle?.national_code) {
        return [state.activeVehicle, ...result];
      } else {
        return [];
      }
    },
    activeVehicle: state => {
      return state.activeVehicle;
    },
    svgObjectIds: state => {
      return state.svgObjectIds;
    },
    tooltips: state => {
      return state.tooltips;
    },
    currentSvgCodeTooltip: state => {
      const currentTooltip = state.tooltips?.find(
        ({ calloutNumber }) => calloutNumber === state.selectedSvgCode
      );

      return (
        currentTooltip || {
          sku: '',
          tooltip: '',
          calloutNumber: ''
        }
      );
    },
    svgEventName: state => {
      return state.svgEventName;
    },
    getStripeToken: state => {
      return state.stripeToken;
    },
    /** ***  Storyblok *****/
    pageSbData: state => {
      return state.pageSbData;
    },
    globalSbData: state => {
      return state.globalSbData;
    },
    storyblokContent: state => (key, page = 'home') => {
      const contents = {};
      if (state.storyblok) {
        Object.keys(state.storyblok).map(key => {
          contents[key] = state.storyblok[key].content;
        });
      }

      if (contents[page]) {
        return contents[page]['body'].find(
          content => content.component === key
        );
      } else {
        return null;
      }
    }
  }
};
