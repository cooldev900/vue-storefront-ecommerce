<template>
  <div class="o-shipping">
    <div class="form">
      <SfCheckbox
        v-if="currentUser && hasShippingDetails()"
        v-model="shipToMyAddress"
        class="form__element form__checkbox"
        name="shipToMyAddress"
        :label="$t('Ship to my default address')"
      />
      <!-- <SfInput
        v-model.trim="shipping.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        required
        :valid="!$v.shipping.firstName.$error"
        :error-message="
          !$v.shipping.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
        @blur="$v.shipping.firstName.$touch()"
      />
      <SfInput
        v-model.trim="shipping.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        required
        :valid="!$v.shipping.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.lastName.$touch()"
      /> -->
      <SfInput
        v-model.trim="shipping.streetAddress"
        class="form__element"
        name="street-address"
        :label="$t('Street name')"
        required
        :valid="!$v.shipping.streetAddress.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.streetAddress.$touch()"
      />
      <SfInput
        v-model.trim="shipping.apartmentNumber"
        class="form__element"
        name="apartment-number"
        :label="$t('Address line 2')"
      />
      <SfInput
        v-model.trim="shipping.city"
        class="form__element form__element--half"
        name="city"
        :label="$t('City')"
        required
        :valid="!$v.shipping.city.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.city.$touch()"
      />
      <SfInput
        v-model.trim="shipping.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
      />
      <SfInput
        v-model.trim="shipping.zipCode"
        class="form__element form__element--half"
        name="zipCode"
        :label="$t('Postcode')"
        required
        :valid="!$v.shipping.zipCode.$error"
        :error-message="
          !$v.shipping.zipCode.required
            ? $t('Field is required')
            : $t('Zip-code must have at least 3 letters.')
        "
        @blur="$v.shipping.zipCode.$touch()"
      />
      <SfSelect
        v-model="shipping.country"
        class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
        name="countries"
        :label="$t('Country')"
        required
        :valid="!$v.shipping.country.$error"
        :error-message="$t('Field is required')"
        @change="changeCountry"
        @blur="$v.shipping.country.$touch()"
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
        v-model.trim="shipping.phoneNumber"
        class="form__element"
        name="phone"
        :label="$t('Phone Number')"
        required
        :valid="!$v.shipping.phoneNumber.$error"
        @blur="$v.shipping.phoneNumber.$touch()"
        :error-message="$t('Field is required')"
      /> -->
    </div>
    <div class="form">
      <div class="form__action">
        <SfButton
          class="om-button wide btn"
          :disabled="($v.shipping.$invalid || !shippingMethods.length)"
          @click="clickContinuePayment"
        >
          {{ $t("Continue to payment") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';
import OmLocator from 'theme/components/omni/om-locator';

export default {
  name: 'OShipping',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfSelect,
    SfHeading,
    SfCheckbox,
    OmLocator
  },
  mixins: [Shipping],
  validations: {
    shipping: {
      // firstName: {
      //   required,
      //   minLength: minLength(2),
      //   unicodeAlpha
      // },
      // lastName: {
      //   required,
      //   unicodeAlpha
      // },
      country: {
        required,
        minLength: minLength(2),
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      },
      // phoneNumber: {
      //   required
      // }
    }
  },
  props: {
    nextAccordion: {
      type: Function,
      default: (Number) => {}
    }
  },
  mounted () {
    // createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0);
  },
  methods: {
    async clickContinuePayment () {
      this.nextAccordion(1);      
      this.$store.dispatch('checkout/savePaymentDetails', {
        apartmentNumber: this.shipping.apartmentNumber,
        city: this.shipping.city,
        company: this.shipping.company,
        country: this.shipping.country,
        firstName: this.personalDetails.firstName,
        lastName: this.personalDetails.lastName,
        paymentMethod: 'cnpayment',
        phoneNumber: this.personalDetails.telephone,
        state: this.shipping.state,
        streetAddress: this.shipping.streetAddress,
        taxId: '',
        zipCode: this.shipping.zipCode
      });
      this.sendShippingDataToCheckout();
      await this.$store.dispatch('cart/pullMethods', { forceServerSync: true })
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
      --heading-padding: var(--spacer-xs) 0 var(--spacer-base) 0;
    }
  }
}
.form {
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
  &__button {
    --button-width: 100%;
  }
  &__radio-group {
    flex: 0 0 100%;
    margin: auto !important;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    &:last-of-type {
      margin: 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
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
    &__button {
      --button-width: auto;
    }
    &__radio-group {
      margin: 0 calc(var(--spacer-sm) * -1);
    }
  }
  @include for-mobile {
    &__radio-group {
      position: relative;
      left: 0;
      right: 0;
    }
  }
}
.shipping {
  --radio-container-padding: var(--spacer-sm);
  &__label {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    &-price {
      font-size: var(--font-lg);
      @include for-mobile {
        order: -1;
        margin: 0 var(--spacer-xs) 0 0;
      }
    }
  }
  &__description {
    --radio-description-margin: 0;
  }
  &__delivery {
    color: var(--c-text-muted);
    display: flex;
  }
  &__action {
    @include for-mobile {
      margin: 0 0 0 var(--spacer-xs);
    }
    &::before {
      content: "+";
    }
    &--is-active {
      --button-color: var(--c-primary);
      --button-transition: color 150ms linear;
      &::before {
        content: "-";
      }
    }
  }
  @include for-desktop {
    &__label {
      justify-content: space-between;
    }
    &__delivery {
      justify-content: space-between;
      max-width: 240px;
    }
  }
}
::v-deep  .sf-select__dropdown{
  @include for-mobile{
   z-index: 2;
  }
}
::v-deep .sf-select__options {
  overflow-y: auto;
}
::v-deep #sfSelect {
  padding-top: var(--spacer-lg);
}
.manual-selector{
  display: flex;
  gap: 20px;
  align-items: center;
  .dropdown-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    padding: 20px 0;
    width: 100%;
    .sf-select {
      width: 50%;
    }
  }
}
.vehicle-select {
    /* Reset */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    /* Add some styling */

    display: block;
    width: 100%;
    height: 54px;
    float: right;
    padding: 0px 24px;
    border-radius: 8px;
    font-size: 16px;
    line-height: 1.75;
    color: #333;
    background-color: #ffffff;
    background-image: none;
    border: 1px solid #cccccc;
    -ms-word-break: normal;
    word-break: normal;
    margin-bottom: 15px;
    /* Remove IE arrow */
    &::-ms-expand {
      display: none;
    }
  }
</style>
