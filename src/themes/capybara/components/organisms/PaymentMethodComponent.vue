<template>
    <div>
        <SfButton
            class="sf-button--full-width om-btn--primary"
            @click.prevent="doPlaceOrder"
            v-if="paymentMethod === 'checkmo'"
        >
        {{ $t("Continue to Payment") }}
      </SfButton>
        <payment-stripe v-if="paymentMethod === 'stripe_payments'" />
        <CybersourcePayVue :editAccordion="editAccordion"  v-if="paymentMethod === 'cnpayment'"/>
        <PaypalButton v-if="paymentMethod === 'paypal'"/>
        <payment-checkout-com v-if="paymentMethod === 'checkoutcom_card_payment'" />
    </div>
</template>

<script>
import PaymentStripe from 'src/modules/stripe/components/PaymentStripe';
import CybersourcePayVue from './o-cybersource-pay.vue';
import PaypalButton from 'src/modules/payment-paypal/components/Button';
import PaymentCheckoutCom from 'src/modules/payment-checkout_com/components/payment-frame';

import {
  SfButton
} from '@storefront-ui/vue';

export default {
    name: 'PaymentMethodComponent',
    components: {
        PaymentStripe,
        CybersourcePayVue,
        PaypalButton,
        PaymentCheckoutCom,
        SfButton
    },
    props: {
        paymentMethod: {
            type: String,
            default: ''
        },
        editAccordion: {
            type: Function,
            default: (Number) => {}
        },
    },
    methods: {
        doPlaceOrder () {
            this.$bus.$emit('place-order-after-cybersource-pay');
        }
    }    
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
</style>