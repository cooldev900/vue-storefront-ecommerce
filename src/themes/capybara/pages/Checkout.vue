<template>
<div>
  <div id="checkout">
    <div v-if="!isThankYouPage" class="checkout">
      <SfSteps
        :active="currentStep"
        :steps="steps.map(step => step.name)"
        @change="changeStep"
      >
        <div class="checkout__main">
          <SfStep v-for="step in steps" :key="step.key" :name="step.name">
            <component :is="step.component" :is-active="true" />
          </SfStep>
        </div>
        <div class="checkout__aside desktop-only">
          <SfButton class="sf-button--full-width order-review" @click="showOrderReview">
            Order Review
          </SfButton>
          <transition name="fade">
            <OOrderSummary v-if="currentStep <= 2" class="checkout__aside-order" />
            <OOrderReview v-else class="checkout__aside-order" />
          </transition>
        </div>
      </SfSteps>
    </div>
    <OOrderConfirmation v-if="isThankYouPage" />
  </div>
   <SbTeaseV2/>
  </div>
</template>
<script>

import SbTeaseV2 from "theme/components/storyblok/sb-teaser-v2.vue";
import Checkout from '@vue-storefront/core/pages/Checkout';
import { SfSteps, SfButton } from '@storefront-ui/vue';
import OPayment from 'theme/components/organisms/o-payment';
import OShipping from 'theme/components/organisms/o-shipping';
import OConfirmOrder from 'theme/components/organisms/o-confirm-order';
import OOrderReview from 'theme/components/organisms/o-order-review';
import OOrderSummary from 'theme/components/organisms/o-order-summary';
import OOrderConfirmation from 'theme/components/organisms/o-order-confirmation';
import OPersonalDetails from 'theme/components/organisms/o-personal-details';
import { mapActions } from 'vuex';

export default {
  name: 'Checkout',
  components: {
    SfSteps,
    OPayment,
    OShipping,
    OOrderReview,
    OOrderSummary,
    OConfirmOrder,
    OPersonalDetails,
    OOrderConfirmation,
    SfButton,
    SbTeaseV2
  },
  mixins: [Checkout],
  data () {
    return {
      steps: [
        {
          key: 'personalDetails',
          name: this.$t('Details'),
          component: OPersonalDetails
        },
        {
          key: 'shipping',
          name: this.$t('Shipping'),
          component: OShipping
        },
        {
          key: 'payment',
          name: this.$t('Payment'),
          component: OPayment
        }
      ]
    };
  },
  computed: {
    currentStep () {
      return this.steps.findIndex(step => this.activeSection[step.key]);
    }
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleSidebar'
    }),
    changeStep (nextStep) {
      if (nextStep < this.currentStep) {
        this.$bus.$emit('checkout-before-edit', this.steps[nextStep].key);
      }
    },
    showNotification ({ type, message }) {
      this.$store.dispatch('notification/spawnNotification', {
        type,
        message,
        action1: { label: this.$t('OK') }
      });
    },
    notifyEmptyCart () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Shopping cart is empty. Please add some products before entering Checkout'
        )
      });
    },
    notifyOutStock (p) {
      this.showNotification({
        type: 'danger',
        message: p.name + this.$t(' is out of stock!')
      });
    },
    notifyNotAvailable () {
      this.showNotification({
        type: 'danger',
        message: this.$t('Some of the ordered products are not available!')
      });
    },
    notifyStockCheck () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Stock check in progress, please wait while available stock quantities are checked'
        )
      });
    },
    notifyNoConnection () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'
        )
      });
    },
    showOrderReview () {
      this.openMicrocart({ type: 'microcart' });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#checkout {
  box-sizing: border-box;
  @include for-desktop {
    padding: 0 15px;
    max-width: 1600px;
    margin: 0 auto;
  }
}
.checkout {
  --steps-content-padding: 0 var(--spacer-sm);
  @include for-desktop {
    --steps-content-padding: 0;
    display: block;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: 45px;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 26.8125rem;
      margin: 0 0 0 var(--spacer-xl);
      padding: 45px;
    }
    &-order {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      padding: var(--spacer-xl) calc(var(--spacer-lg) * 2);
    }
  }
}
::v-deep .sf-steps__content {
  display: flex;
  @include for-mobile{
    display: block;
    margin-top: 20px;
  }
}
::v-deep .sf-steps__header {
   @include for-desktop {
  max-width: 600px;
  margin: 20px auto;
   }
}
.order-review {
  margin: var(--spacer-sm) 0;
}
</style>
