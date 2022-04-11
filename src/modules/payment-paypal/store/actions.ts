import config from 'config'
import { PaypalState } from '../types/PaypalState'
import { ActionTree } from 'vuex'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'
import rootStore from '@vue-storefront/core/store'
import * as types from './mutation-types'
import axios from 'axios'

export const actions: ActionTree<PaypalState, any> = {

  async createOrder ({ commit, dispatch, getters }) {
    await dispatch('syncCartTotals')
    const { data: { id } } = await dispatch('processOrder')

    if (id) {
      commit(types.SET_PAYPAL_EXPRESS_TOKEN, id)
      return id
    } else {
      commit(types.SET_PAYPAL_MESSAGE, 'create paypal order error')
      return false
    }
  },

  // eslint-disable-next-line no-empty-pattern
  complete ({}, params) {
    let url = processURLAddress(config.paypal.endpoint.complete)
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
  },

  // eslint-disable-next-line no-empty-pattern
  setExpressCheckout ({}, params) {
    console.log(params, 'hey-----------------')
    let url = processURLAddress(config.paypal.endpoint.createPayment)
    url = config.storeViews.multistore ? adjustMultistoreApiUrl(url) : url
    return axios.post(url, {
      token: params.user_token,
      cartID: params.cart_id,
      paymentMethodType: 'paypal'
    })
  },

  async syncCartTotals ({ dispatch, getters }) {
    const shippingDetails = getters['getShippingDetails'] || {}
    await rootStore.dispatch('cart/syncTotals', {
      methodsData: {
        country: shippingDetails.country,
        zipCode: shippingDetails.zipCode,
        region: shippingDetails.region,
        region_id: shippingDetails.regionId,
        region_code: shippingDetails.regionCode,
        method_code: shippingDetails.shippingMethod,
        carrier_code: shippingDetails.shippingCarrier,
        payment_method: null
      },
      forceServerSync: true
    })
  },

  // Create order using Server Side methods same as magento 2...
  async processOrder ({ dispatch, getters, rootGetters }) {
    // eslint-disable-next-line no-return-await
    return await dispatch('setExpressCheckout', {
      cart_id: rootGetters['cart/getCartToken'],
      brand_name: '',
      // locale: getters['getLocale'],
      locale: getters['getLocale'],
      currency_code: 'GBP',
      purchase_units: getters['getPurchaseUnits'],
      user_token: rootGetters['user/getUserToken'],
      email: getters['getCustomerEmail'],
      return_url: 'https://www.paypal.com/checkoutnow/error',
      cancel_url: 'https://www.paypal.com/checkoutnow/error',
      total_type: 'EstimatedTotal',
      logo: ''
    })
  }
}
