import axios, { AxiosRequestConfig } from 'axios';
import base64 from 'base-64';
import config from 'config'
import Jsona from 'jsona';
import * as qs from 'qs';
import Vue from 'vue';

import {
  SET_LEXASCMS_DATA,
  SET_LEXASCMS_REQUEST_CONTEXT
} from './mutation-types';

export const LexascmsStore = {
  namespaced: true,

  state: {
    data: {},
    requestContext: null
  },

  actions: {
    getData ({ commit }, args) {
      // Fetch data from LexasCMS
      return new Promise(async (resolve, reject) => {
        try {
          // Prepare request options
          const requestOptions: AxiosRequestConfig = {
            baseURL: `https://${config.lexascms.spaceId}.spaces.lexascms.com/delivery/jsonapi`,
            headers: {
              'Content-Type': 'application/vnd.api+json'
            },
            params: args.params,
            paramsSerializer: (params) => qs.stringify(params)
          };
          // Add LexasCMS auth header if required
          if (config.lexascms.apiKey !== undefined) {
            requestOptions.headers['Authorization'] = `Bearer ${config.lexascms.apiKey}`;
          }
          // Add LexasCMS Request Context if required
          if (args.requestContext !== null) {
            // Get request context
            let requestContext = args.requestContext;
            // Encode request context if required
            if (typeof requestContext !== 'string') {
              requestContext = base64.encode(JSON.stringify(args.context));
            }
            // Set request context header
            requestOptions.headers['x-lexascms-context'] = requestContext;
          }
          // Send request
          const response = await axios.get(args.path, requestOptions);
          // Deserialize JSON:API response
          const dataFormatter = new Jsona();
          const data = dataFormatter.deserialize(response.data);
          // Commit data to store
          commit(SET_LEXASCMS_DATA, {
            key: JSON.stringify(args),
            value: data
          });
          // Resolve
          resolve(data);
        } catch (e) {
          reject({ error: 'Error fetching item from LexasCMS' })
        }
      });
    },
    setRequestContext ({ commit }, newRequestContext) {
      commit(SET_LEXASCMS_REQUEST_CONTEXT, newRequestContext);
    }
  },

  mutations: {
    [SET_LEXASCMS_DATA] (state, { key, value }) {
      Vue.set(state.data, key, value);
    },
    [SET_LEXASCMS_REQUEST_CONTEXT] (state, newRequestContext) {
      state.requestContext = newRequestContext;
    }
  },

  getters: {
    data: (state) => (key) => state.data[key],
    requestContext: (state) => state.requestContext
  }
}
