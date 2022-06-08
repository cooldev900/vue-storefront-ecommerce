<template>
  <div class="mb15 mt20 vsf-stripe-container">
    <div class="bg-cl-secondary px20 py20">
      <form action="" id="payment-form">
        <div class="form-row">
          <div id="vsf-stripe-card-element">
            &nbsp;
          <!-- A Stripe Element will be inserted here. -->
          </div>

          <!-- Used to display Element errors. -->
          <div id="vsf-stripe-card-errors" role="alert">
            &nbsp;
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import config from 'config';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'PaymentStripe',
  data () {
    return {
      stripe: {
        instance: null,
        elements: null,
        card: null
      },
      processing: false,
      formatedCardData: null,
      paymentIntent: {
        id: null,
        client_secret: null
      }
    };
  },
  computed: {
      ...mapGetters({
      paymentDetails: 'checkout/getPaymentDetails',
      cartToken: 'cart/getCartToken',
      totals: 'cart/getTotals'
    }),
    ...mapState({
      stripeConfig: state => state.config.stripe
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    },
    checkout () {
      return this.$store.state.checkout;
    }
  },
  beforeMount () {
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder);
  },
  beforeDestroy () {
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder);
  },
  mounted () {
    // Load the stripe.js elements script.
    // As it's callback, Configure stripe to run.
    this.loadStripeDependencies(this.configureStripe);
    // Ready to place order, handle anything we need to, generating, validating stripe requests & tokens ect.
    this.$bus.$on('checkout-before-placeOrder', this.onBeforePlaceOrder);
    // Ready to place order, handle anything we need to, generating, validating stripe requests & tokens ect.
    this.$bus.$on('checkout-payment-method-changed', paymentMethodCode => {
      if (paymentMethodCode !== this.stripeConfig.paymentMethodCode) {
        // unregister the extension placeorder handler
        this.$bus.$off('checkout-before-placeOrder', this.onBeforePlaceOrder);
      }
    });
  },
  methods: {
    onAfterPlaceOrder () {
      // Stop display loader
      this.$bus.$emit('notification-progress-stop');
    },
    onBeforePlaceOrder () {
      if (this.processing) {
        return;
      }
      this.processStripeForm();
    },
    loadStripeDependencies (callback) {
      let stripeJsUrl = 'https://js.stripe.com/v3/';
      let docHead = document.getElementsByTagName('head')[0];
      let docScript = document.createElement('script');
      docScript.type = 'text/javascript';
      docScript.src = stripeJsUrl;
      // When script is ready fire our callback.
      docScript.onreadystatechange = callback;
      docScript.onload = callback;
      docHead.appendChild(docScript);
    },
    configureStripe () {
      if (!this.stripeConfig.hasOwnProperty('apiKey')) {
        return false;
      }
      // Create a new Stripe client.
      this.stripe.instance = window.Stripe(this.stripeConfig.apiKey);
      // Create an instance of Elements.
      // this.stripe.elements = this.stripe.instance.elements();
      // Create the stripe elements card
      this.createElements();
      // Add the event listeners for stripe.
      this.bindEventListeners();
    },
    async createElements () {
      const { data: {
        success,
        result,
        error
      }
     // } = await axios.get(`http://localhost:8081/api/ext/stripe/secret`);
      } = await axios.get(`${config.api.url}/api/ext/stripe/secret`, {
        params: {
         amount: Math.round(this.prices.grand_total * 100)
        }
      });
      if (success === true) {
        this.paymentIntent = result;
        const options = {
          clientSecret: result.client_secret,
          // Fully customizable with appearance API.
          appearance: {}
        };
        this.stripe.elements = this.stripe.instance.elements(options);
        const paymentElement = this.stripe.elements.create('payment');
        paymentElement.mount('#vsf-stripe-card-element');
      } else {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: error,
          action1: { label: this.$t('OK') }
        });
      }
    },
    bindEventListeners () {
      // Handle real-time validation errors from the card Element.
      this.stripe.card.addEventListener('change', this.onStripeCardChange);
    },
    onStripeCardChange (event) {
      let displayError = document.getElementById('vsf-stripe-card-errors');
      displayError.textContent = event.error ? event.error.message : '';
      this.$store.commit('stripe/setClientSecret', null);
    },
    beforeDestroy () {
      this.unbindEventListeners();
    },
    unbindEventListeners () {
      this.stripe.card.removeEventListener('change', this.onStripeCardChange);
    },
    async processStripeForm () {
      let self = this;
      // Start display loader
      this.$bus.$emit(
        'notification-progress-start',
        [i18n.t('Placing Order'), '...'].join('')
      );
      // this.processing = true
      // Create payment method with Stripe
      const { storeCode } = currentStoreView()
      const return_url = `${config.server.protocol}://${config.server.host}:${config.server.port}/${storeCode}/order-success`
      try {
        const { error } = await this.stripe.instance.confirmPayment({
          elements: this.stripe.elements,
          confirmParams: {
            return_url
          },
          redirect: 'if_required'
        })

        if (error) {
          // This point will only be reached if there is an immediate error when
          // confirming the payment. Show error to your customer (for example, payment
          // details incomplete)
          self.bus.$emit('stripe-info-error', error);
          console.log(error, 'stripe-info-error');
          const errorElement = document.getElementById(
            'vsf-stripe-card-errors'
          );
          errorElement.textContent = error.message;
          // Stop display loader
          self.$bus.$emit('notification-progress-stop');
        } else {
          this.$bus.$emit('checkout-do-placeOrder', {
            paymentID: this.paymentIntent.id
          });
        }
      } catch (e) {
        self.$bus.$emit('notification-progress-stop');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.vsf-stripe-container {
  margin: 30px 0 10px 0;
  label {
    font-weight: 500;
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
    color: #818992;
  }
  .StripeElement {
    background-color: white;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }
  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }
  .StripeElement--invalid {
    border-color: #fa755a;
  }
  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
}
#vsf-stripe-card-errors {
  margin: 8px auto 0;
  color: #fa755a;
}
</style>
