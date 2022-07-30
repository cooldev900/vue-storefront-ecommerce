import { mapState, mapGetters } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import toString from 'lodash-es/toString'
import config from 'config'
const Countries = require('@vue-storefront/i18n/resource/countries.json')

export const Shipping = {
  name: 'Shipping',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  beforeDestroy () {
    this.$bus.$off('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$off('checkout-after-personalDetails', this.onAfterPersonalDetails)
    this.$bus.$off('checkout-after-shippingset', this.onAfterShippingSet)
  },
  beforeMount () {
    this.$bus.$on('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$on('checkout-after-personalDetails', this.onAfterPersonalDetails)
    this.$bus.$on('checkout-after-shippingset', this.onAfterShippingSet)
  },
  data () {
    return {
      isFilled: false,
      countries: Countries,
      shipping: this.$store.state.checkout.shippingDetails,
      payment: this.$store.state.checkout.paymentDetails,
      shipToMyAddress: false,
      myAddressDetails: {
        firstname: '',
        lastname: '',
        country: '',
        region: '',
        city: '',
        street: ['', ''],
        postcode: '',
        telephone: ''
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state: RootState) => state.user.current
    }),
    ...mapGetters({
      shippingMethods: 'checkout/getShippingMethods',
      getPaymentDetails: 'checkout/getPaymentDetails',
      personalDetails: 'checkout/getPersonalDetails',
      locationKind: 'omLocator/locationKind',
      activeLocation: 'omLocator/activeLocation',
      getShippingDetails: "checkout/getShippingDetails",
      isLoggedIn: 'user/isLoggedIn',
      getAddressId: 'checkoutStep/getAddressId',
    }),
    hasRegisterdShippingAddress() {
      return !!this.currentUser?.addresses?.length
    },
    checkoutShippingDetails () {
      return this.$store.state.checkout.shippingDetails
    },
    paymentMethod () {
      return this.$store.getters['checkout/getPaymentMethods']
    },
    allowedShippingMethods () {
      let blacklist = config.shipping.blacklist;
      console.log(config, 'blacklist');
      if (blacklist?.length) {
        return this.shippingMethods.filter(shippingMethod => {
          let flag = true;
          blacklist.map(list => {
            if (list.method_code === shippingMethod.method_code) flag = false;
          })
          return flag;
        });
      } else {
        return this.shippingMethods;
      }
    }
  },
  watch: {
    shippingMethods: {
      handler () {
        this.checkDefaultShippingMethod()
      }
    },
    shipToMyAddress: {
      handler () {
        this.useMyAddress()
      },
      immediate: true
    },
    personalDetails (value) {
      this.shipping.firstName = value.firstName;
      this.shipping.lastName = value.lastName;
      this.shipping.telephone = value.telephone;
    },
    getShippingDetails (value) {
      this.shipping = {...value};
    }
  },
  mounted () {
    // this.checkDefaultShippingAddress()
    // this.checkDefaultShippingMethod()
    // this.changeShippingMethod()
    this.shipping = {...this.getShippingDetails};
    // this.changeShippingMethod()
  },
  methods: {
    checkDefaultShippingAddress () {
      this.shipToMyAddress = this.hasShippingDetails()
    },
    checkDefaultShippingMethod () {
      if (!this.shipping.shippingMethod || this.notInMethods(this.shipping.shippingMethod)) {
        let shipping = this.shippingMethods.find(item => item.default)
        if (!shipping && this.allowedShippingMethods.length > 0) {
          this.shipping.shippingMethod = this.allowedShippingMethods[0].method_code
          this.shipping.shippingCarrier = this.allowedShippingMethods[0].carrier_code
        } else {
          this.shipping.shippingMethod = shipping.method_code
          this.shipping.shippingCarrier = shipping.carrier_code
        }
      }
    },
    onAfterShippingSet (receivedData) {
      this.shipping = receivedData
      this.isFilled = true
    },
    onAfterPersonalDetails (receivedData) {
      if (!this.isFilled) {
        // this.$store.dispatch('checkout/updatePropValue', ['firstName', receivedData.firstName])
        // this.$store.dispatch('checkout/updatePropValue', ['lastName', receivedData.lastName])
        // this.$store.dispatch('checkout/updatePropValue', ['emailAddress', receivedData.emailAddress])
      }
    },
    sendShippingDataToCheckout () {
      this.$bus.$emit('checkout-after-shippingDetails', this.shipping, this.$v)
      this.isFilled = true
    },
    sendDataToCheckout () {
      this.$bus.$emit('checkout-after-shippingDetails', this.shipping, this.$v)
      this.isFilled = true
    },
    edit () {
      if (this.isFilled) {
        this.$bus.$emit('checkout-before-edit', 'shipping')
      }
    },
    hasShippingDetails () {
      if (this.currentUser) {
        if (this.currentUser.hasOwnProperty('default_shipping')) {
          let id = this.currentUser.default_shipping
          let addresses = this.currentUser.addresses
          for (let i = 0; i < addresses.length; i++) {
            if (toString(addresses[i].id) === toString(id)) {
              this.myAddressDetails = addresses[i]
              return true
            }
          }
        }
      }
      return false
    },
    useMyAddress () {
      if (this.shipToMyAddress) {
        this.$set(this, 'shipping', {
          firstName: this.myAddressDetails.firstname,
          lastName: this.myAddressDetails.lastname,
          country: this.myAddressDetails.country_id,
          state: this.myAddressDetails.region.region ? this.myAddressDetails.region.region : '',
          city: this.myAddressDetails.city,
          streetAddress: this.myAddressDetails.street[0],
          apartmentNumber: this.myAddressDetails.street[1],
          zipCode: this.myAddressDetails.postcode,
          phoneNumber: this.myAddressDetails.telephone,
          shippingMethod: this.checkoutShippingDetails.shippingMethod,
          shippingCarrier: this.checkoutShippingDetails.shippingCarrier
        })
      } else {
        this.$set(this, 'shipping', this.checkoutShippingDetails)
      }
      this.changeCountry()
    },
    getShippingMethod () {
      for (let i = 0; i < this.shippingMethods.length; i++) {
        if (this.shippingMethods[i].method_code === this.shipping.shippingMethod) {
          return {
            method_title: this.shippingMethods[i].method_title,
            amount: this.shippingMethods[i].amount
          }
        }
      }
      return {
        method_title: '',
        amount: ''
      }
    },
    getCountryName () {
      for (let i = 0; i < this.countries.length; i++) {
        if (this.countries[i].code === this.shipping.country) {
          return this.countries[i].name
        }
      }
      return ''
    },
    changeCountry () {
      // this.$bus.$emit('checkout-before-shippingMethods', this.shipping.country)
    },
    getCurrentShippingMethod () {
      let shippingCode = this.shipping.shippingMethod
      let currentMethod = this.shippingMethods ? this.shippingMethods.find(item => item.method_code === shippingCode) : {}
      return currentMethod
    },
    changeShippingMethodContent() {
      let currentShippingMethod = this.getCurrentShippingMethod()
      if (currentShippingMethod) {
        this.shipping = {...this.shipping, shippingMethod: currentShippingMethod.method_code, shippingCarrier: currentShippingMethod.carrier_code };
        this.$store.dispatch('checkout/saveShippingDetails', this.shipping)
      }
    },
    changeShippingMethod () {
      // let currentShippingMethod = this.getCurrentShippingMethod()
      // if (currentShippingMethod) {
      //   this.shipping = Object.assign(this.shipping, { shippingCarrier: currentShippingMethod.carrier_code })
      //   this.$store.dispatch('checkout/saveShippingDetails', this.shipping)
        this.$bus.$emit('checkout-after-shippingMethodChanged', {
          country: this.getShippingDetails.country,
          method_code: this.getShippingDetails.shippingMethod,
          carrier_code: this.getShippingDetails.shippingCarrier,
          payment_method: this.paymentMethod[0].code
        })
      // }
    },
    notInMethods (method) {
      let availableMethods = this.shippingMethods
      if (availableMethods.find(item => item.method_code === method)) {
        return false
      }
      return true
    },
    onCheckoutLoad () {
      this.shipping = this.$store.state.checkout.shippingDetails
    }
  }
}
