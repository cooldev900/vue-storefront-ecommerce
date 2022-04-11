<template>
  <div class="deliver">
    <h2>Delivery options</h2>
    <h4>How would you prefer to receive your items?</h4>
    <div class="deliver-content">
      <OmLocator />
      <SfButton @click="onContinue" class="sf-button continue-button">
        Continue
      </SfButton>
    </div>
  </div>
</template>

<script>
import {
  SfRadio,
  SfButton
} from '@storefront-ui/vue';
import OmLocator from 'theme/components/omni/om-locator';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import { mapGetters } from 'vuex';
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config'

export default {
  name: 'DeliverPage',
  mixins: [Shipping],
  components: {
    SfRadio,
    SfButton,
    OmLocator
  },
  data () {
    return {
      checked: {
        free: false,
        cost: false
      }
    }
  },
  computed: {
    ...mapGetters({
      location: 'omLocator/location'
    })
  },
  methods: {
    async onContinue () {
      this.$set(this, 'shipping', {
        firstName: this.location.firstName,
        lastName: this.location.lastName,
        country: this.location.country,
        state: this.location.state,
        city: this.location.city,
        streetAddress: this.location.streetAddress,
        apartmentNumber: this.location.apartmentNumber,
        zipCode: this.location.zipCode,
        phoneNumber: this.location.phoneNumber,
        shippingMethod: this.checkoutShippingDetails.shippingMethod,
        shippingCarrier: this.checkoutShippingDetails.shippingCarrier
      });

      this.changeCountry();

      this.sendDataToCheckout();
      this.$store.dispatch('checkout/saveShippingDetails', this.shipping)
      // this.$router.push(localizedRoute('/checkout'));
      await this.$store.dispatch('cart/async', {
        forceClientState: true,
        forceSync: true
      })
      const externalCheckoutConfig = { ...config.externalCheckout };
      const cmsUrl = externalCheckoutConfig.cmsUrl;
      const stores = externalCheckoutConfig.stores;
      const storeCode = currentStoreView().storeCode
      const multistoreEnabled = config.storeViews.multistore
      // this.$router.push(localizedRoute('/checkout'));
      // this.closeMicrocartExtend();
      if (multistoreEnabled) {
        window.location.replace(stores[storeCode].cmsUrl + '/vue/cart/sync/token/' + this.userToken + '/cart/' + this.cartToken)
      } else {
        window.location.replace(cmsUrl + '/vue/cart/sync/token/' + this.userToken + '/cart/' + this.cartToken)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

.deliver {
  background: white;
  box-sizing: border-box;
  margin-bottom: var(--spacer-lg);
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
    padding: var(--spacer-sm);
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacer-sm);

    .continue-button {
      padding: var(--spacer-sm) var(--spacer-3xl);
    }
  }
}
</style>
