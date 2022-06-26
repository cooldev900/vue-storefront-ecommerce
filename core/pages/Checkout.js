import Vue from 'vue'
import i18n from '@vue-storefront/i18n'
import config from 'config'
import VueOfflineMixin from 'vue-offline/mixin'
import { mapGetters } from 'vuex'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import Composite from '@vue-storefront/core/mixins/composite'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Checkout',
  mixins: [Composite, VueOfflineMixin],
  data () {
    return {
      stockCheckCompleted: false,
      stockCheckOK: false,
      confirmation: null, // order confirmation from server
      activeSection: {
        personalDetails: true,
        shipping: false,
        payment: false,
        orderReview: false
      },
      order: {},
      personalDetails: {},
      shipping: {},
      shippingMethod: {},
      payment: {},
      orderReview: {},
      cartSummary: {},
      validationResults: {
        personalDetails: { $invalid: true },
        shipping: { $invalid: true },
        payment: { $invalid: true }
      },
      focusedField: null
    }
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart',
      isThankYouPage: 'checkout/isThankYouPage',
      getPersonalDetails: 'checkout/getPersonalDetails',
      shippingMethods: 'checkout/getShippingMethods',
      paymentMethod: 'checkout/getPaymentMethods',
      shippingDetails: 'checkout/getShippingDetails',
      getPaymentDetails: 'checkout/getPaymentDetails'
    })
  },
  async beforeMount () {
    await this.$store.dispatch('checkout/load')
    this.$bus.$emit('checkout-after-load')
    this.$store.dispatch('checkout/setModifiedAt', Date.now())
    // TODO: Use one event with name as apram
    this.$bus.$on('cart-after-update', this.onCartAfterUpdate)
    this.$bus.$on('cart-after-delete', this.onCartAfterUpdate)
    this.$bus.$on('checkout-after-personalDetails', this.onAfterPersonalDetails)
    this.$bus.$on('checkout-after-shippingDetails', this.onAfterShippingDetails)
    this.$bus.$on('checkout-after-paymentDetails', this.onAfterPaymentDetails)
    this.$bus.$on('checkout-after-cartSummary', this.onAfterCartSummary)
    this.$bus.$on('checkout-before-placeOrder', this.onBeforePlaceOrder)
    this.$bus.$on('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$on('checkout-before-edit', this.onBeforeEdit)
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder)
    this.$bus.$on('checkout-before-shippingMethods', this.onBeforeShippingMethods)
    this.$bus.$on('checkout-after-shippingMethodChanged', this.onAfterShippingMethodChanged)
    this.$bus.$on('checkout-after-validationError', this.focusField)
    this.$bus.$on('send-sync-totals', this.sendAsyncTotals)
    this.$bus.$on('place-order-after-cybersource-pay', this.goToStepOne);
    this.$bus.$on('appointment-error', this.placeOrder);
    if (!this.isThankYouPage) {
      this.$store.dispatch('cart/load', { forceClientState: true }).then(() => {
        if (this.$store.state.cart.cartItems.length === 0) {
          this.notifyEmptyCart()
          this.$router.push(this.localizedRoute('/'))
        } else {
          this.stockCheckCompleted = false
          const checkPromises = []
          for (let product of this.$store.state.cart.cartItems) { // check the results of online stock check
            if (product.onlineStockCheckid) {
              checkPromises.push(new Promise((resolve, reject) => {
                StorageManager.get('syncTasks').getItem(product.onlineStockCheckid, (err, item) => {
                  if (err || !item) {
                    if (err) Logger.error(err)()
                    resolve(null)
                  } else {
                    product.stock = item.result
                    resolve(product)
                  }
                })
              }))
            }
          }
          Promise.all(checkPromises).then((checkedProducts) => {
            this.stockCheckCompleted = true
            this.stockCheckOK = true
            for (let chp of checkedProducts) {
              if (chp && chp.stock) {
                if (!chp.stock.is_in_stock) {
                  this.stockCheckOK = false
                  chp.errors.stock = i18n.t('Out of stock!')
                  this.notifyOutStock(chp)
                }
              }
            }
          })
        }
      })
    }
    const storeView = currentStoreView()
    let country = this.$store.state.checkout.shippingDetails.country
    if (!country) country = storeView.i18n.defaultCountry
    // this.$bus.$emit('checkout-before-shippingMethods', country)
  },
  beforeDestroy () {
    this.$store.dispatch('checkout/setModifiedAt', 0) // exit checkout
    this.$bus.$off('cart-after-update', this.onCartAfterUpdate)
    this.$bus.$off('cart-after-delete', this.onCartAfterUpdate)
    this.$bus.$off('checkout-after-personalDetails', this.onAfterPersonalDetails)
    this.$bus.$off('checkout-after-shippingDetails', this.onAfterShippingDetails)
    this.$bus.$off('checkout-after-paymentDetails', this.onAfterPaymentDetails)
    this.$bus.$off('checkout-after-cartSummary', this.onAfterCartSummary)
    this.$bus.$off('checkout-before-placeOrder', this.onBeforePlaceOrder)
    this.$bus.$off('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$off('checkout-before-edit', this.onBeforeEdit)
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder)
    this.$bus.$off('checkout-before-shippingMethods', this.onBeforeShippingMethods)
    this.$bus.$off('checkout-after-shippingMethodChanged', this.onAfterShippingMethodChanged)
    this.$bus.$off('checkout-after-validationError', this.focusField)
    this.$bus.$off('send-sync-totals', this.sendAsyncTotals)
    this.$bus.$off('place-order-after-cybersource-pay', this.placeOrder)
    this.$bus.$off('appointment-error', this.goToStepOne);
  },
  watch: {
    '$route': 'activateHashSection',
    'OnlineOnly': 'onNetworkStatusCheck'
  },
  methods: {
    goToStepOne () {
      this.editAccordion(0);
    },
    changeShippingMethod (method_code) {
      let currentShippingMethod = this.shippingMethods.find(method => method.method_code === method_code);
      console.log(currentShippingMethod, 'current shipping method');
      if (currentShippingMethod) {
        this.shipping = Object.assign(this.shipping, { shippingCarrier: currentShippingMethod.carrier_code, shippingMethod: currentShippingMethod.method_code })
        this.$bus.$emit('checkout-after-shippingMethodChanged', {
          country: this.shipping.country,
          method_code: currentShippingMethod.method_code,
          carrier_code: currentShippingMethod.carrier_code,
          payment_method: this.paymentMethod[0].code
        })
      }
    },
    sendAsyncTotals () {
      this.changeShippingMethod(this.shippingDetails.shippingMethod);
    },
    onCartAfterUpdate (payload) {
      if (this.$store.state.cart.cartItems.length === 0) {
        this.notifyEmptyCart()
        this.$router.push(this.localizedRoute('/'))
      }
    },
    async onAfterShippingMethodChanged (payload) {
      // await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      this.shippingMethod = payload
    },
    onBeforeShippingMethods (country) {
      this.$store.dispatch('checkout/updatePropValue', ['country', country])
      // this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      this.$forceUpdate()
    },
    async onAfterPlaceOrder (payload) {
      this.confirmation = payload.confirmation
      this.$store.dispatch('checkout/setThankYouPage', true)
      this.$store.dispatch('user/getOrdersHistory', { refresh: true, useCache: true })
      Logger.debug(payload.order)()
    },
    onBeforeEdit (section) {
      this.activateSection(section)
    },
    onBeforePlaceOrder (payload) {
    },
    onAfterCartSummary (receivedData) {
      this.cartSummary = receivedData
    },
    async onDoPlaceOrder (additionalPayload) {
      if (this.$store.state.cart.cartItems.length === 0) {
        this.notifyEmptyCart()
        this.$router.push(this.localizedRoute('/'))
      } else {
        this.payment.paymentMethodAdditional = additionalPayload
        await this.placeOrder()
      }
    },
    onAfterPaymentDetails (receivedData, validationResult) {
      this.payment = receivedData
      this.validationResults.payment = validationResult
      this.activateSection('orderReview')
      this.savePaymentDetails()
      // this.$bus.$emit('send-sync-totals')
    },
    onAfterShippingDetails (receivedData, validationResult) {
      this.shipping = receivedData
      this.validationResults.shipping = validationResult
      this.activateSection('payment')
      this.saveShippingDetails()

      const storeView = currentStoreView()
      storeView.tax.defaultCountry = this.shipping.country
      // this.$bus.$emit('send-sync-totals')
    },
    onAfterPersonalDetails (receivedData, validationResult) {
      this.personalDetails = receivedData
      this.validationResults.personalDetails = validationResult

      if (this.isVirtualCart === true) {
        this.activateSection('payment')
      } else {
        this.activateSection('shipping')
      }
      this.savePersonalDetails()
      this.focusedField = null
      // this.$bus.$emit('send-sync-totals')
    },
    onNetworkStatusCheck (isOnline) {
      this.checkConnection(isOnline)
    },
    changeShipping  (value) {
      this.shipping.firstName = value.firstName;
      this.shipping.lastName = value.lastName;
      this.shipping.phoneNumber = value.telephone;
    },

    checkStocks () {
      let isValid = true
      for (let child of this.$children) {
        if (child.hasOwnProperty('$v')) {
          if (child.$v.$invalid) {
            // Check if child component is Personal Details.
            // If so, then ignore validation of account creation fields.
            if (child.$v.hasOwnProperty('personalDetails')) {
              if (child.$v.personalDetails.$invalid) {
                isValid = false
                break
              }
            } else {
              isValid = false
              break
            }
          }
        }
      }

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        if (this.stockCheckCompleted) {
          if (!this.stockCheckOK) {
            isValid = false
            this.notifyNotAvailable()
          }
        } else {
          this.notifyStockCheck()
          isValid = false
        }
      }
      return isValid
    },
    activateHashSection () {
      if (!isServer) {
        var urlStep = window.location.hash.replace('#', '')
        if (this.activeSection.hasOwnProperty(urlStep) && this.activeSection[urlStep] === false) {
          this.activateSection(urlStep)
        } else if (urlStep === '') {
          this.activateSection('personalDetails')
        }
      }
    },
    checkConnection (isOnline) {
      if (!isOnline) {
        this.notifyNoConnection()
      }
    },
    activateSection (sectionToActivate) {
      for (let section in this.activeSection) {
        this.activeSection[section] = false
      }
      this.activeSection[sectionToActivate] = true
      if (!isServer) window.location.href = window.location.origin + window.location.pathname + '#' + sectionToActivate
    },
    // This method checks if there exists a mapping of chosen payment method to one of Magento's payment methods.
    getPaymentMethod () {
      let paymentMethod = this.payment.paymentMethod
      if (config.orders.payment_methods_mapping.hasOwnProperty(paymentMethod)) {
        paymentMethod = config.orders.payment_methods_mapping[paymentMethod]
      }
      return paymentMethod
    },
    prepareOrder () {
      this.order = {
        user_id: this.$store.state.user.current ? this.$store.state.user.current.id.toString() : '',
        cart_id: this.$store.state.cart.cartServerToken ? this.$store.state.cart.cartServerToken.toString() : '',
        products: this.$store.state.cart.cartItems,
        addressInformation: {
          billingAddress: {
            region: this.getPaymentDetails.state,
            region_id: this.getPaymentDetails.region_id ? this.getPaymentDetails.region_id : 0,
            country_id: this.getPaymentDetails.country,
            street: [this.getPaymentDetails.streetAddress, this.getPaymentDetails.apartmentNumber],
            company: this.getPaymentDetails.company,
            telephone: this.getPersonalDetails.telephone,
            postcode: '0000',
            city: this.getPaymentDetails.city,
            firstname: this.getPaymentDetails.firstName,
            lastname: this.getPaymentDetails.lastName,
            email: this.getPersonalDetails.emailAddress,
            region_code: this.getPaymentDetails.region_code ? this.getPaymentDetails.region_code : '',
            vat_id: this.getPaymentDetails.taxId
          },
          shipping_method_code: 'freeshipping',
          shipping_carrier_code: 'freeshipping',
          payment_method_code: 'cnpayment',
          payment_method_additional: this.payment.paymentMethodAdditional,
          shippingExtraFields: this.shipping.extraFields
        }
      }

      this.order.addressInformation.shippingAddress = {
        region: this.shippingDetails.state,
        region_id: this.shippingDetails.region_id ? this.shippingDetails.region_id : 0,
        country_id: this.shippingDetails.country,
        street: [this.shippingDetails.streetAddress, this.shippingDetails.apartmentNumber],
        company: '',
        telephone: this.getPersonalDetails.telephone,
        postcode: '0000',
        city: this.shippingDetails.city,
        firstname: this.getPersonalDetails.firstName,
        lastname: this.getPersonalDetails.lastName,
        email: this.getPersonalDetails.emailAddress,
        region_code: this.shippingDetails.region_code ? this.shippingDetails.region_code : ''
      }

      return this.order
    },
    validateOrderBeforeSending () {
      let order = this.prepareOrder();
      const requiedFields = ['city', 'country_id', 'email', 'firstname', 'lastname', 'postcode', 'region', 'region_code', 'region_id', 'street', 'telephone'];
      let errors = [];
      // Object.keys(order).map(key => {
      //   if (key === 'addressInformation') return;
      //   if (!order[key]) errors.push(`The ${key} item is blank. Please check again`);
      // })
      Object.keys(order.addressInformation.shippingAddress).map(key => {
        if (!requiedFields.includes(key)) return;
        if (key === 'street') {
          let street = order.addressInformation.shippingAddress[key];
          let flag = true;
          if (!street?.length) flag = false;
          else {
            flag = !street.some(str => !str);
          }
          if (!flag) {
            errors.push(`The street field in Billing Address is blank. Please check again`)
          }
        } else if (!order.addressInformation.shippingAddress[key]) { errors.push(`The ${key} field in Billing Address is blank. Please check again`); }
      })
      Object.keys(order.addressInformation.billingAddress).map(key => {
        if (!requiedFields.includes(key)) return;
        if (key === 'street') {
          let street = order.addressInformation.billingAddress[key];
          let flag = true;
          if (!street?.length) flag = false;
          else {
            flag = !street.some(str => !str);
          }
          if (!flag) {
            errors.push(`The street field in Billing Address is blank. Please check again`)
          }
        } else if (!order.addressInformation.billingAddress[key]) { errors.push(`The ${key} field in Billing Address is blank. Please check again`); }
      })
      return errors;
    },
    async placeOrder () {
      this.checkConnection({ online: typeof navigator !== 'undefined' ? navigator.onLine : true })
      if (this.checkStocks()) {
        await this.$store.dispatch('checkout/placeOrder', { order: this.prepareOrder() })
        this.$bus.$emit('notification-progress-stop');
      } else {
        this.notifyNotAvailable()
      }
    },
    savePersonalDetails () {
      this.$store.dispatch('checkout/savePersonalDetails', this.personalDetails)
    },
    saveShippingDetails () {
      this.$store.dispatch('checkout/saveShippingDetails', this.shipping)
    },
    savePaymentDetails () {
      this.$store.dispatch('checkout/savePaymentDetails', this.payment)
    },
    focusField (fieldName) {
      if (fieldName === 'password') {
        window.scrollTo(0, 0)
        this.activateSection('personalDetails')
        this.focusedField = fieldName
      }
      if (fieldName === 'email-address') {
        window.scrollTo(0, 0)
        this.activateSection('personalDetails')
        this.focusedField = fieldName
      }
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('Checkout'),
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  },
  // asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
  //   return new Promise((resolve, reject) => {
  //     if (context) context.output.cacheTags.add(`checkout`)
  //     // if (context) context.server.response.redirect(localizedRoute('/'))
  //     resolve()
  //   })
  // }
}
