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
        <input type="hidden" name="access_key" :value="edpqForm.access_key" />
        <input type="hidden" name="amount" :value="edpqForm.amount" />        
        <input type="hidden" name="currency" :value="edpqForm.currency" />
        <input type="hidden" name="locale" :value="edpqForm.locale" />
        <input type="hidden" name="profile_id" :value="edpqForm.profile_id" />        
        <input type="hidden" name="reference_number" :value="edpqForm.reference_number"/>
        <input type="hidden" name="signed_date_time" :value="edpqForm.signed_date_time" />
        <input type="hidden" name="signed_field_names" :value="edpqForm.signed_field_names" />
        <input type="hidden" name="transaction_type" :value="edpqForm.transaction_type" />
        <input type="hidden" name="transaction_uuid" :value="edpqForm.transaction_uuid"/>
        <input type="hidden" name="bill_to_forename" :value="edpqForm.bill_to_forename"/>
        <input type="hidden" name="bill_to_surname" :value="edpqForm.bill_to_surname"/>
        <input type="hidden" name="bill_to_email" :value="edpqForm.bill_to_email"/>
        <input type="hidden" name="bill_to_address_line1" :value="edpqForm.bill_to_address_line1"/>
        <input type="hidden" name="bill_to_address_country" :value="edpqForm.bill_to_address_country"/>

        <!-- check before the payment: see Security: Check before the payment -->
        <input type="hidden" name="signature" :value="edpqForm.signature" />
        <!-- layout information: see Look and feel of the payment page -->

        <SfButton
        class="sf-button--full-width form__action-button"
        type="submit"
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
import { mapGetters } from 'vuex';

export default {
  name: 'OCybersourcepay',
  components: {
    SfButton,
    // PaymentStripe
  },
  async mounted () {
    const passPhrase = ',3p%LhsENFp44Wn@ycK';
    // this.edpqForm.reference_number = this.cartToken;
    const cartTotalPrice = this.prices.grand_total;
    this.edpqForm.amount = this.prices.grand_total * 100;    
    this.edpqForm.signed_date_time = new Date().toISOString().substring(0, 19) + 'Z';
    this.edpqForm.transaction_uuid = Math.floor(Math.random() * 100000000);

    this.edpqForm.bill_to_forename = this.getPersonalDetails.firstName;
    this.edpqForm.bill_to_surname = this.getPersonalDetails.lastName;
    this.edpqForm.bill_to_email = this.getPersonalDetails.emailAddress;
    this.edpqForm.bill_to_address_line1 = this.getPaymentDetails.streetAddress;
    this.edpqForm.bill_to_address_country = this.getPaymentDetails.country;
    this.edpqForm.bill_to_address_city = this.getPaymentDetails.city;

    let signedFieldNames = this.edpqForm.signed_field_names.split(",");
    let data = [];
    let edpqForm = this.edpqForm;
    signedFieldNames.forEach(function (item) {
        console.log(item, 'key');
        data.push(item + "=" + edpqForm[item]);
    });
    data = data?.length ? data.join(",") : "";
    const secretKey = "9f8f91900c274d37925c0be4beebed23b8bc48776e4f4f63a2aa1a0b001dea0140bcac7ae391456989e90ae5e37c6b18c6caca3b5ef64b55a6395a7d0cc0a8d7511c9dae3b8748859c1153206009ad4582e70787acd7488584e6dd7a6ce0f1a3834ade1543da40758044c4fc3849ca0fba812aeca1e0487ebdf04ae2749c1729";
    console.log(data, 'signature');
    this.edpqForm.signature = this.$CryptoJS.HmacSHA256(data, secretKey).toString(this.$CryptoJS.enc.Base64);
    console.log(this.edpqForm, 'wdpaForm');
  },
  computed: {
    ...mapGetters({
      getPaymentDetails: 'checkout/getPaymentDetails',
      getPersonalDetails: "checkout/getPersonalDetails",
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
        access_key: 'a0b2da90c5d433f6892066d11b97e059',
        amount: 200,
        currency: "QAR",
        locale: "en-US",
        profile_id: '95937600-7A9B-425E-A47C-4F012E77487F',
        reference_number: "100",        
        signed_date_time: "",
        signed_field_names: "access_key,amount,currency,locale,profile_id,reference_number,signed_date_time,signed_field_names,transaction_type,transaction_uuid,bill_to_forename,bill_to_surname,bill_to_email,bill_to_address_line1,bill_to_address_country,bill_to_address_city",
        transaction_type: "sale",
        transaction_uuid: "fcfc212e92d23be881d1299ef3c3b314",             
        signature: "",
        bill_to_forename: "",
        bill_to_surname: "",
        bill_to_email: "",
        bill_to_address_line1: "",
        bill_to_address_country: "",
        bill_to_address_city: ""
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
