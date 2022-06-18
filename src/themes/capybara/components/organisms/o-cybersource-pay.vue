<template>
    <!-- it's epdq form -->
    <form
        class="sf-button--full-width"
        method="post"
        action="https://testsecureacceptance.cybersource.com/pay"
        id="form1"
        name="form1"
    >
        <!-- general parameters: see Form parameters -->
        <input type="hidden" name="AMOUNT" :value="edpqForm.amount" />
        <input type="hidden" name="access_key" :value="edpqForm.access_key" />
        <input type="hidden" name="profile_id" :value="edpqForm.profile_id" />
        <input type="hidden" name="transaction_uuid" :value="edpqForm.transaction_uuid">
        <input type="hidden" name="locale" :value="edpqForm.locale" />
        <input type="hidden" name="signed_field_names" :value="edpqForm.signed_field_names" />
        <input type="hidden" name="currency" :value="edpqForm.currency" />
        <input type="hidden" name="transaction_type" :value="edpqForm.transaction_type" />
        <input type="hidden" name="reference_number" :value="edpqForm.reference_number"/>

        <!-- check before the payment: see Security: Check before the payment -->
        <input type="hidden" name="signed_date_time" :value="edpqForm.signed_date_time" />
        <input type="hidden" name="signature" :value="edpqForm.signature" />
        <!-- layout information: see Look and feel of the payment page -->

        <SfButton
        class="sf-button--full-width form__action-button"
        :disabled="$v.payment.$invalid"
        type="submit"
        @click="epdqSubmit"
        >
        {{ $t("Continue to Payment") }}
        </SfButton>
    </form>    
</template>
<script>

import {
  SfButton
} from '@storefront-ui/vue';
import { getShaSignatureBase64 } from 'theme/helpers/index.ts';

export default {
  name: 'OCybersourcepay',
  components: {
    SfButton,
    // PaymentStripe
  },
  async mounted () {
    const passPhrase = ',3p%LhsENFp44Wn@ycK';
    this.edpqForm.reference_number = this.cartToken;
    const cartTotalPrice = this.prices.grand_total;
    this.edpqForm.amount = this.prices.grand_total * 100;    
    this.edpqForm.signed_date_time = new Date().toISOString();
    this.edpqForm.transaction_uuid = Math.floor(Math.random() * 100000000);
    const shaSignature = `ammount=${this.edpqForm.ammount}${passPhrase}access_key=${this.edpqForm.access_key}${passPhrase}profile_id=${this.edpqForm.profile_id}${passPhrase}transaction_uuid=${this.edpqForm.transaction_uuid}${passPhrase}locale=${this.edpqForm.locale}${passPhrase}signed_field_names=${this.edpqForm.signed_field_names}${passPhrase}currency=${this.edpqForm.currency}${passPhrase}transaction_type=${this.edpqForm.transaction_type}${passPhrase}reference_number=${this.edpqForm.ref_number}${passPhrase}signed_date_time=${this.edpqForm.signed_date_time}${passPhrase}`;
    const hashHex = await getShaSignatureBase64(shaSignature);
    this.shaSign = hashHex.toUpperCase();
    this.edpqForm.signature = this.shaSign;
  },
  computed: {
    ...mapGetters({
      paymentDetails: 'checkout/getPaymentDetails',
      cartToken: 'cart/getCartToken',
      totals: 'cart/getTotals'
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    },
  },
  data () {
    return {
      shaSign: '',
      edpqForm: {
        amount: 2000,
        access_key: 'a0b2da90c5d433f6892066d11b97e059',
        transaction_uuid: "fcfc212e92d23be881d1299ef3c3b314",
        locale: "en-US",
        signed_field_names: "ammount,access_key,profile_id,transaction_uuid,locale,signed_field_names,transaction_type,ref_number,signed_date_time",
        currency: "QAR",
        transaction_type: "sale",
        reference_number: "00900",
        signed_date_time: "",
        signature: ""
      }      
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.form {
  &__checkbox {
    --checkbox-label-color: var(--c-dark-variant);
    margin: 0 0 var(--spacer-sm) 0;
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    margin: var(--spacer-base) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }

  &_button {
    color: #654855;
    cursor: pointer;
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 var(--spacer-xs);
    &__element {
      padding: 0 0 var(--spacer-xs) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
  }
}
.payment-method {
  --radio-container-align-items: center;
  --radio-container-padding: var(--spacer-sm) 0;
  --ratio-content-margin: 0 0 0 var(--spacer-lg);
  --radio-background: transparent;
  white-space: nowrap;
  @include for-desktop {
    --radio-container-padding: var(--spacer-sm);
  }
}
</style>
