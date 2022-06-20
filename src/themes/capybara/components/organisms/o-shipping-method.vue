<template>
  <div class="o-shipping">
    <SfHeading
      :title="$t('Shipping method')"
      :level="4"
      class="sf-heading--left sf-heading--no-underline title"
       v-show="locationKind !== 'click_collect_free'"
    />
    <div class="form">
      <div class="form__radio-group" v-show="locationKind !== 'click_collect_free'">
        <SfRadio
          v-for="method in allowedShippingMethods"
          :key="method.method_code"
          v-model="shipping.shippingMethod"
          :value="method.method_code"
          name="shipping-method"
          class="form__radio shipping"
          @input="changeShippingMethodContent()"
        >
          <template #label>
            <div class="sf-radio__label shipping__label">
              <div>{{ method.method_title }}</div>
              <div class="shipping__label-price">
                {{ method.amount | price }}
              </div>
            </div>
          </template>
        </SfRadio>
      </div>
      <div class="form__action">
        <SfButton
          class="om-button wide btn"
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
      this.nextAccordion(2);
      this.sendDataToCheckout();
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
