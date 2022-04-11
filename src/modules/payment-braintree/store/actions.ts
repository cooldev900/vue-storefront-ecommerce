import { BraintreeState } from '../types/BraintreeState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'
import config from 'config'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<BraintreeState, any> = {
  generateToken () {
    let url = config.braintree.endpoint + '/get-token'
    console.log(url)
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(resp => { return resp.json() })
      .then((resp) => {
        console.debug(resp.result.token)
        return resp.result.token
      })
  },
  doPayment (params) {
    let url = config.braintree.endpoint + '/do-payment'
    console.log(url)
    console.log(params)
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(resp => { return resp.json() })
      .then((resp) => {
        console.debug(resp)
        return resp
      })
  },
  // if you are using cache in your module it's a good practice to allow developers to choose either to use it or not
  execute (params) {
    let url = config.paypal.endpoint.execute
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(resp => { return resp.json() })
  }
}
