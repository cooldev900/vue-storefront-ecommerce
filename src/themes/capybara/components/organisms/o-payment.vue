<template>
  <div class="o-payment">
    <div class="form">
      <!-- <SfCheckbox
        v-if="!isVirtualCart && locationKind === 'delivery_estimate_free'"
        v-model="sendToShippingAddress"
        class="form__element form__checkbox"
        name="sendToShippingAddress"
        :label="$t('Copy address data from shipping')"
      /> -->
      <!-- <div class="billing-address-container" v-show="sendToBillingAddress">
        <div class="billing-address-container__title">
          Billing address
        </div>
      </div> -->
      <div class="billing-address-content" v-show="sendToBillingAddress">
        <b> {{ $t('Billing address') }} </b>{{ billingAddress }}
      </div>
      <!-- <div class="form__element form__checkbox form_button" v-if="sendToBillingAddress" @click="sendToBillingAddress = !sendToBillingAddress">
        Change Billing Address
      </div> -->
      <span
        class="form__billing"
        name="sendToBillingAddress"
        @click="handleClick"
        v-show="sendToBillingAddress"
      >
        {{ locationKind === 'click_collect_free' ? $t('Change billing address') : $t('Change billing address') }}
      </span>
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        required
        :valid="!$v.payment.firstName.$error"
        :error-message="
          !$v.payment.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
      />
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        required
        :valid="!$v.payment.lastName.$error"
        :error-message="$t('Field is required')"
      />
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.streetAddress"
        class="form__element"
        name="street-address"
        :label="$t('Address Line 1')"
        required
        :valid="!$v.payment.streetAddress.$error"
        :error-message="$t('Field is required')"
      />
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.apartmentNumber"
        class="form__element"
        name="apartment-number"
        :label="$t('Address Line 2')"
      />
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.city"
        class="form__element form__element--half"
        name="city"
        :label="$t('City')"
        required
        :valid="!$v.payment.city.$error"
        :error-message="$t('Field is required')"
      />
      <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
      />
      <!-- <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.zipCode"
        class="form__element form__element--half"
        name="zipCode"
        :label="$t('Zip-code')"
        required
        :valid="!$v.payment.zipCode.$error"
        :error-message="
          !$v.payment.zipCode.required
            ? $t('Field is required')
            : $t('Zip-code must have at least 3 letters.')
        "
        @blur="$v.payment.zipCode.$touch()"
      /> -->
      <SfSelect
        style="display: none"
        v-if="!sendToBillingAddress"
        v-model="payment.country"
        class="
          form__element
          form__element--half
          form__element--half-even
          form__select
          sf-select--underlined
        "
        name="countries"
        :label="$t('Country')"
        required
        :valid="!$v.payment.country.$error"
        :error-message="$t('Field is required')"
        @change="changeCountry"
      >
        <SfSelectOption
          v-for="country in countries"
          :key="country.code"
          :value="country.code"
        >
          {{ country.name }}
        </SfSelectOption>
      </SfSelect>
      <!-- <SfInput
        v-if="!sendToBillingAddress"
        v-model.trim="payment.phoneNumber"
        class="form__element"
        name="phone"
        :label="$t('Phone Number')"
        required
        :valid="!$v.payment.phoneNumber.$error"
        @blur="$v.payment.phoneNumber.$touch()"
        :error-message="$t('Field is required')"
      /> -->
      <!-- <SfCheckbox
        v-if="!sendToBillingAddress"
        v-model="generateInvoice"
        class="form__element form__checkbox"
        name="generateInvoice"
        :label="$t('I want to generate an invoice for the company')"
      />
      <template v-if="generateInvoice && !sendToBillingAddress">
        <SfInput
          v-model.trim="payment.company"
          class="form__element form__element--half"
          name="company-name"
          :label="$t('Company name')"
          required
          :valid="!$v.payment.company.$error"
          :error-message="$t('Field is required')"
          @blur="$v.payment.company.$touch()"
        />
        <SfInput
          v-model.trim="payment.taxId"
          class="form__element form__element--half form__element--half-even"
          name="tax-id"
          :label="$t('Tax identification number')"
          required
          :valid="!$v.payment.taxId.$error"
          :error-message="
            !$v.payment.taxId.required
              ? $t('Field is required')
              : $t('Tax identification number must have at least 3 letters.')
          "
          @blur="$v.payment.taxId.$touch()"
        />
        <p class="mb40 mt0">
          {{ $t("We will send you the invoice to given e-mail address") }}
        </p>
      </template> -->
      <SfButton
        v-if="!sendToBillingAddress"
        class="sf-button--full-width om-btn--primary"
        type="submit"
        @click="saveBillingAddress"
      >
        {{ $t("Save") }}
      </SfButton>
    </div>
    <OmAlertBox v-if="message" type="warning" style="margin-bottom: 20px;" v-show="sendToBillingAddress">
      <template #message>
        <div class="om-alert-box-message">
          <div>
            <p>
              There was a problem processing your payment. Please try again or contact us if the issue persists
            </p>
          </div>
        </div>
      </template>
    </OmAlertBox>
    
    <div class="form" v-show="sendToBillingAddress">
      <div class="form__radio-group">
        <div v-for="method in paymentMethods" :key="method.code" class="payment-method">
          <div class="payment-method__option">
            <SfRadio            
              :key="method.code"
              v-model="payment.paymentMethod"
              :label="method.title ? method.title : method.name"
              :value="method.code"
              name="payment-method"
              class="form__radio payment-method"
              @input="changePaymentMethod"
            />
            <div class="payment-method__option--logo">
              {{ method.code + '.png' }}
            </div>
          </div>
          <div class="payment-method__contents" v-if="payment.paymentMethod === method.code">
            <SfLoader :loading="loading" v-if="loading" class="payment-loader"/>
            <div v-else>
              <PaymentMethodComponent :paymentMethod="payment.paymentMethod" :editAccordion="editAccordion"/>
            </div>
          </div>
        </div>
        <!-- <payment-stripe v-if="payment.paymentMethod === 'cnpayment'" /> -->
        <div id="checkout-order-review-additional-container" />
      </div>
      <div class="form__action" v-show="sendToBillingAddress">
        <!-- it's epdq form -->
        <!-- <form
          class="sf-button--full-width"
          method="post"
          action="https://testsecureacceptance.cybersource.com/pay"
          id="form1"
          name="form1"
        >
          <input type="hidden" name="ACCEPTURL" :value="edpqForm.acceptUrl">
          <input type="hidden" name="AMOUNT" :value="edpqForm.amount">
          <input type="hidden" name="CURRENCY" :value="edpqForm.currency">
          <input type="hidden" name="LANGUAGE" :value="edpqForm.language">
          <input type="hidden" name="ORDERID" :value="edpqForm.orderId">
          <input type="hidden" name="PSPID" :value="edpqForm.pspId">

          
          <input type="hidden" name="SHASIGN" :value="shaSign">
          

          <SfButton
            class="sf-button--full-width form__action-button"
            :disabled="$v.payment.$invalid"
            type="submit"
            @click="epdqSubmit"
          >
            {{ $t("Continue to Payment") }}
          </SfButton>
        </form> -->
        <!-- <CybersourcePayVue :editAccordion="editAccordion"/> -->
      </div>
    </div>
    <!-- This dummy container below is needed because src\modules\payment-cash-on-delivery\index.ts
         tries to inject here a component with payment description -->
    <div v-show="false" id="checkout-order-review-additional-container" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment.ts';
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { OrderModule } from '@vue-storefront/core/modules/order';
import OmAlertBox from 'theme/components/omni/om-alert-box';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox,
  SfLoader
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';
// import PaymentStripe from 'src/modules/stripe/components/PaymentStripe';
// import MixinStripe from 'src/modules/stripe/components/MixinStripe';
import { getShaSignature } from 'theme/helpers/index.ts';
import CybersourcePayVue from './o-cybersource-pay.vue';
import config from 'config';
import { ModalList } from 'theme/store/ui/modals';
import PaymentMethodComponent from './PaymentMethodComponent.vue';

export default {
  name: 'OPayment',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfSelect,
    SfHeading,
    SfCheckbox,
    OmAlertBox,
    CybersourcePayVue,
    // PaymentStripe,
    PaymentMethodComponent,
    SfLoader
},
  mixins: [Payment, OrderReview],
  props: {
    nextAccordion: {
      type: Function,
      default: (Number) => {}
    },
    editAccordion: {
      type: Function,
      default: (Number) => {}
    },
    placeOrder: {
      type: Function,
      default: () => {}
    }
  },
  validations () {
    const rules = {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required,
        unicodeAlpha
      },
      country: {
        required
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      // apartmentNumber: {
      //   required,
      //   unicodeAlphaNum
      // },
      // zipCode: {
      //   required,
      //   minLength: minLength(3),
      //   unicodeAlphaNum
      // },
      city: {
        required,
        unicodeAlpha
      },
      phoneNumber: {
        required
      },
      paymentMethod: {
        required
      }
    };
    const rulesForInvoice = {
      company: {
        required,
        unicodeAlphaNum
      },
      taxId: {
        required,
        minLength: minLength(3)
      }
    };
    return this.generateInvoice
      ? {
        payment: {
          ...rules,
          ...rulesForInvoice
        }
      }
      : {
        payment: {
          ...rules
        }
      };
  },
  async mounted () {
    const passPhrase = ',3p%LhsENFp44Wn@ycK';
    this.edpqForm.orderId = this.cartToken;
    const cartTotalPrice = this.prices.grand_total;
    this.edpqForm.amount = this.prices.grand_total * 100;
    const shaSignature = `ACCEPTURL=${this.edpqForm.acceptUrl}${passPhrase}AMOUNT=${this.edpqForm.amount}${passPhrase}CURRENCY=${this.edpqForm.currency}${passPhrase}LANGUAGE=${this.edpqForm.language}${passPhrase}ORDERID=${this.edpqForm.orderId}${passPhrase}PSPID=${this.edpqForm.pspId}${passPhrase}`;
    const hashHex = await getShaSignature(shaSignature);
    this.shaSign = hashHex.toUpperCase();
    // createSmoothscroll(
    //   document.documentElement.scrollTop || document.body.scrollTop,
    //   0
    // );
    const { decision, transaction_id, req_transaction_uuid, message, SHASIGN } = this.$route.query;
    // const { decision } = this.$route.query;
    if (SHASIGN) {
      const secretKey = config.secret_key;
      const shaSignature1 = `${transaction_id}${decision}${req_transaction_uuid}`;
      console.log(process.env, 'secret_key', config.secret_key);
      const checkSumShaSign = this.$CryptoJS.HmacSHA256(shaSignature1, secretKey).toString(this.$CryptoJS.enc.Hex);
      console.log(JSON.parse(SHASIGN) ===  checkSumShaSign,'is valid sha', SHASIGN, checkSumShaSign);
      console.log(this.getSlotData, 'getSlotData');
      console.log(this.getSlotID, 'getSlotID');
      if (JSON.parse(SHASIGN) ===  checkSumShaSign && decision === 'ACCEPT') {
        // let newOrder = await this.prepareOrder();

        // newOrder.addressInformation.payment_method_additional = {
        //   paymentID: PAYID
        // }
        // await this.$store.dispatch('checkout/placeOrder', { order: newOrder });
        // EventBus.$emit('notification-progress-stop')
        
        await this.$bus.$emit('notification-progress-start');
        // await this.$bus.$emit('place-order-after-cybersource-pay');
        const result = await this.placeOrder();
        console.log(result?.result.magentoOrderId, 'result?.result.magentoOrderId');
    
        try {
            await this.$store.dispatch('vehicles/setAppointment', result?.result.magentoOrderId);
        } catch(e) {
          console.log(e, 'appointment error');
          await this.$bus.$emit('notification-progress-stop');
          this.openModal({ name: ModalList.OmAppointmentModal, payload: { orderId: result?.result.magentoOrderId } })
        }
      } else {
        this.isMessage = true;
        this.message = message;
      }
    } else {
      this.isMessage = false;
      this.message = '';
    }
    
  },
  computed: {
    ...mapGetters({
      paymentDetails: 'checkout/getPaymentDetails',
      cartToken: 'cart/getCartToken',
      totals: 'cart/getTotals',
      getSlotData: 'vehicles/getSlotData',
      getSlotID: 'vehicles/getSlotID'
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    },
    billingAddress () {
      let excludeFields = ['firstName', 'lastName', 'region_id', 'telephone', 'phoneNumber', 'country', 'paymentMethod', 'taxId', 'isThankYouPage', 'modifiedAt'];
      if (this.paymentDetails.firstName) return Object.keys(this.paymentDetails).filter(payment => !excludeFields.includes(payment)).map(key => this.paymentDetails[key]).filter(value => !!value).join(', ');
      else return Object.keys(this.getShippingDetails).filter(payment => !excludeFields.includes(payment)).map(key => this.getShippingDetails[key]).filter(value => !!value).join(', ');
    }
  },
  beforeCreate () {
    registerModule(OrderModule);
  },
  data () {
    return {
      shaSign: '',
      edpqForm: {
        acceptUrl: 'https://www.glynhopkinpartsonline.co.uk/bc-order-success',
        amount: 2000,
        currency: 'GBP',
        language: 'en_US',
        orderId: '1010',
        pspId: 'epdq1611513'
      },
      isMessage: false,
      message: '',
      idData: [
        {name: 'firstName',  id: 'first-name'},
        {name: 'lastName', id: 'last-name'},
        {name: 'streetAddress', id: 'street-address'},
        {name: 'apartmentNumber', id: 'apartment-number'},
        {name: 'city', id: 'city'},
        {name: 'state', id: 'state'},
        {name: 'country', id: 'countries'},
      ],
      loading: false,
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    async goToReviewOrder () {
      this.sendDataToCheckout();
      this.placeOrder();
      this.nextAccordion(2);
    },
    epdqSubmit () {
      this.sendDataToCheckout();
    },
    saveBillingAddress () {
      this.$v.$touch();
      if (this.$v.payment.$invalid) {
        const id = this.idData.find( row => {
          if (this.$v.personalDetails[row.name]?.$invalid) return true;
        });
        if (id) {
          setTimeout(() => { document.getElementById(id.id).scrollIntoView({ behavior: 'smooth' }); }, 0);
        }
        return;
      }
      this.sendToBillingAddress = true;
      this.sendDataToCheckout();
    },
    handleClick () {
      this.sendToBillingAddress = !this.sendToBillingAddress;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-padding: var(--spacer-2xl) 0 var(--spacer-base) 0;
    &:last-of-type {
      --heading-padding: var(--spacer-xs) 0 var(--spacer-base) var(--spacer-xs);
    }
  }
}
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

  &__billing {
    color: #000000;
    font-size: 16px;
    cursor: pointer;
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

  &__radio-group {
    width: 100%;
    margin-top: 15px;
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

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f4f4;
    border-radius: 0;
    color: #141414;
    padding: 0 10px;
    font-weight: 500;
    border: 1px solid #ddd;
    border-collapse: collapse;
  }

  &__contents {
    border-radius: 0;
    color: #141414;
    font-weight: 500;
    border: 1px solid #ddd;
    border-top: none !important;
    border-collapse: collapse;
    padding: 15px;
  }
}

.billing-address-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacer-sm);
  width: 100%;

  &__title {
    font-weight: bold;
  }

  &__description {
    text-decoration: underline;
  }
}

.billing-address-content {
  width: 100%;
  padding: 15px 0;
  line-break: anywhere;
}

.payment-loader {
  height: 150px;
}
</style>
