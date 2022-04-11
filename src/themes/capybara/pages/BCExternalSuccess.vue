<template>
  <div id="thank_you_external">
    <OOrderConfirmation v-if="OnlineOnly && lastOrderConfirmation.orderNumber" />
    <div v-else class="banner">
      <div class="banner__info">
        <SfHeading
          title="It's almost ready"
          :level="3"
          class="sf-heading--no-underline"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Composite from '@vue-storefront/core/mixins/composite'
import VueOfflineMixin from 'vue-offline/mixin'
import { EmailForm } from '@vue-storefront/core/modules/mailer/components/EmailForm'
import OOrderConfirmation from 'theme/components/organisms/o-order-confirmation';
import { mapGetters, mapState } from 'vuex';
import { OrderModule } from '@vue-storefront/core/modules/order';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import get from 'lodash-es/get';
import { SfHeading } from '@storefront-ui/vue';
import { getShaSignature } from 'theme/helpers/index.ts'
// import { localizedRoute } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'BarclayCardThankYouPage',
  components: { OOrderConfirmation, SfHeading },
  mixins: [Composite, VueOfflineMixin, EmailForm],
  data () {
    return {
      feedback: ''
    }
  },
  computed: {
    ...mapState({
      lastOrderConfirmation: state => get(state, 'order.last_order_confirmation.confirmation') || {}
    }),
    ...mapGetters({
      payment: 'checkout/getPaymentDetails',
      personalDetails: 'checkout/getPersonalDetails',
      shipping: 'checkout/getShippingDetails'
    }),
    isNotificationSupported () {
      if (Vue.prototype.$isServer || !('Notification' in window)) return false
      return 'Notification' in window
    },
    isPermissionGranted () {
      if (Vue.prototype.$isServer || !('Notification' in window)) return false
      return Notification.permission === 'granted'
    },
    mailerElements () {
      return this.$store.state.config.mailer.contactAddress
    }
  },
  async beforeMount () {
    await this.$store.dispatch('checkout/load')
  },
  methods: {
    getNumberOfItemsInCart () {
      return this.$store.state.cart.cartItems.length
    },
    requestNotificationPermission () {
      if (Vue.prototype.$isServer) return false
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission()
      }
    },
    sendFeedback () {
      this.sendEmail(
        {
          sourceAddress: this.checkoutPersonalEmailAddress,
          targetAddress: this.mailerElements.contactAddress,
          subject: this.$t('What we can improve?'),
          emailText: this.feedback
        },
        this.onSuccess,
        this.onFailure
      )
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message,
        action1: { label: this.$t('OK') }
      })
      if (this.mailerElements.sendConfirmation) {
        this.sendEmail(
          {
            sourceAddress: this.mailerElements.contactAddress,
            targetAddress: this.checkoutPersonalEmailAddress,
            subject: this.$t('Confirmation of receival'),
            emailText: this.$t(`Dear customer,\n\nWe have received your letter.\nThank you for your feedback!`),
            confirmation: true
          }
        )
      }
    },
    onFailure (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message,
        action1: { label: this.$t('OK') }
      })
    },
    async prepareOrder () {
      const checkoutStorage = StorageManager.get('checkout')
      const [
        personalDetails,
        shippingDetails,
        paymentDetails
      ] = await Promise.all([
        checkoutStorage.getItem('personal-details'),
        checkoutStorage.getItem('shipping-details'),
        checkoutStorage.getItem('payment-details')
      ])

      const products =
        this.$store?.state?.cart?.cartItems &&
        Array.isArray(this.$store?.state?.cart?.cartItems)
          ? this.$store.state.cart.cartItems.map(item => {
            const { national_code, fitVehicles, custom_options, ...product } = item;
            const newCustomOptions = custom_options
              ? [
                ...custom_options,
                {
                  option_id: 'fitVehicles',
                  options_value: fitVehicles
                }
              ]
              : [
                {
                  option_id: 'fitVehicles',
                  options_value: fitVehicles
                }
              ];
            return {
              ...product,
              custom_options: newCustomOptions
            };
          }) : [];

      this.order = {
        user_id: this.$store?.state?.user.current ? this.$store.state.user.current.id.toString() : '',
        cart_id: this.$store?.state?.cart.cartServerToken ? this.$store.state.cart.cartServerToken.toString() : '',
        products,
        addressInformation: {
          billingAddress: {
            region: paymentDetails?.state,
            region_id: paymentDetails.region_id ? paymentDetails.region_id : 0,
            country_id: paymentDetails.country,
            street: [paymentDetails.streetAddress, paymentDetails.apartmentNumber],
            company: paymentDetails.company,
            telephone: paymentDetails.phoneNumber,
            postcode: paymentDetails.zipCode,
            city: paymentDetails.city,
            firstname: paymentDetails.firstName,
            lastname: paymentDetails.lastName,
            email: personalDetails.emailAddress,
            region_code: paymentDetails.region_code ? paymentDetails.region_code : '',
            vat_id: paymentDetails.taxId
          },
          shipping_method_code: shippingDetails.shippingMethod,
          shipping_carrier_code: shippingDetails.shippingCarrier,
          payment_method_code: paymentDetails.paymentMethod,
          payment_method_additional: paymentDetails.paymentMethodAdditional,
          // shippingExtraFields: shippingDetails.extraFields,
        }
      }
      if (!this.isVirtualCart) {
        this.order.addressInformation.shippingAddress = {
          region: shippingDetails.state,
          region_id: shippingDetails.region_id ? shippingDetails.region_id : 0,
          country_id: shippingDetails.country,
          street: [shippingDetails.streetAddress, shippingDetails.apartmentNumber],
          company: '',
          telephone: shippingDetails.phoneNumber,
          postcode: shippingDetails.zipCode,
          city: shippingDetails.city,
          firstname: shippingDetails.firstName,
          lastname: shippingDetails.lastName,
          email: personalDetails.emailAddress,
          region_code: shippingDetails.region_code ? shippingDetails.region_code : ''
        }
      }
      return this.order
    }
  },
  beforeCreate () {
    registerModule(OrderModule);
  },
  async mounted () {
    const { orderID, STATUS, PAYID, NCERROR, SHASIGN } = this.$route.query;
    const passPhrase = ',3p%LhsENFp44Wn@ycK';
    const shaSignature = `NCERROR=${NCERROR}${passPhrase}ORDERID=${orderID}${passPhrase}PAYID=${PAYID}${passPhrase}STATUS=${STATUS}${passPhrase}`;
    const checkSumShaSign = await getShaSignature(shaSignature);
    if (checkSumShaSign.toUpperCase() === SHASIGN) {
      let newOrder = await this.prepareOrder();

      newOrder.addressInformation.payment_method_additional = {
        paymentID: PAYID
      }
      await this.$store.dispatch('checkout/placeOrder', { order: newOrder });
      EventBus.$emit('notification-progress-stop')
    } else {
      this.$router.push(this.localizedRoute('/checkout'))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#thank_you_external ~ .notifications {
  display: none;
}

.banner {
  background-color: #f1f2f3;
  height: calc(100vh - 492px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;

  &__info {
    padding: 2rem;
    text-align: left;
    @include for-desktop {
      text-align: center;
    }
    @include for-mobile {
      margin: 1rem;
    }
  }
  &__order-number {
    font-size: 0.875rem;
  }
}
</style>