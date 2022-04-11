<template>
  <div>
    <form id="payment-form" method="POST">
      <div class="one-liner">
        <div class="card-frame">
          <!-- form will be added here -->
        </div>
      </div>
      <p class="success-payment-message" />
      <!-- <button id="pay-button" disabled>
        PAY GBP 24.99
      </button> -->
    </form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import i18n from '@vue-storefront/i18n';
import axios from 'axios';
// import this.$bus from '@vue-storefront/core/compatibility/plugins/event-bus'

export default {
  name: 'PaymentFrame',
  data () {
    return {
      stripe: {
        instance: null,
        elements: null,
        card: null
      }
    };
  },
  computed: {
    ...mapState({
      stripeConfig: state => state.config.stripe
    })
  },
  beforeMount () {
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder);
    // Ready to place order, handle anything we need to, generating, validating stripe requests & tokens ect.
    this.$bus.$on('checkout-before-placeOrder', this.onBeforePlaceOrder);
  },
  beforeDestroy () {
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder);
    this.$bus.$off('checkout-before-placeOrder', this.onBeforePlaceOrder);
  },
  mounted () {
    // Load the stripe.js elements script.
    // As it's callback, Configure stripe to run.
    this.loadCheckoutComDependencies(this.configureCheckoutCom);

    // Ready to place order, handle anything we need to, generating, validating stripe requests & tokens ect.
    this.$bus.$on('checkout-payment-method-changed', paymentMethodCode => {
      if (paymentMethodCode !== 'checkoutcom_card_payment') {
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
      this.processPaypalForm();
    },
    loadCheckoutComDependencies (callback) {
      let CheckoutJsUrl = 'https://cdn.checkout.com/js/framesv2.min.js';
      let docHead = document.getElementsByTagName('head')[0];
      let docScript = document.createElement('script');
      docScript.type = 'text/javascript';
      docScript.src = CheckoutJsUrl;

      // When script is ready fire our callback.
      docScript.onreadystatechange = callback;
      docScript.onload = callback;
      docHead.appendChild(docScript);
    },
    configureCheckoutCom () {
      let form = document.getElementById('payment-form');
      // let payButton = document.getElementById('pay-button');
      Frames.init({
        publicKey: 'pk_test_e1454b67-df53-4de6-9efd-541288de69a7',
        modes: [Frames.modes.DISABLE_COPY_PASTE]
      });
      Frames.addEventHandler(Frames.Events.CARD_VALIDATION_CHANGED, (
        event
      ) => {
        console.log('CARD_VALIDATION_CHANGED: %o', event);
        payButton.disabled = !Frames.isCardValid();
      });
    },
    processPaypalForm () {
      this.$bus.$emit('notification-progress-start', [i18n.t('Placing Order'), '...'].join(''))

      Frames.submitCard()
        .then((data) => {
          // Frames.addCardToken(form, data.token);
          axios
            .post('https://altayer-stage.omninext.co.uk/api/ext/checkout-com/charge-card', {
              token: data.token,
              value: '40'
            })
            .then(({ data }) => {
              if (data.status === 'Declined') {
                this.$bus.$emit('notification-progress-stop')
                this.$store.dispatch('notification/spawnNotification', {
                  type: 'danger',
                  message: 'Checkout was declined.',
                  action1: { label: this.$t('OK') }
                });
              } else if (data.status === 'Authorized') {
                this.$bus.$emit('checkout-do-placeOrder', {})
              } else if (data.status === 'Pending' && data._links) {
                window.open(data._links.redirect.href, '_blank');
              }
            });
        })
        .catch(function (error) {
          // handle error
          this.$bus.$emit('notification-progress-stop')
          this.$store.dispatch('notification/spawnNotification', {
            type: 'danger',
            message: 'Checkout was failed.',
            action1: { label: this.$t('OK') }
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.vsf-stripe-container {
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
