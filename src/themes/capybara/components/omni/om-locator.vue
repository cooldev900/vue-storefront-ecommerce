<template>
  <div class="om-locator">
    <div class="om-locator-wrapper">
      <OmRadio
        v-for="d in data"
        :key="d.value"
        :name="d.value"
        :value="d.value"
        :selected="type"
        :disabled="isDisable(d) || d.disabled"
        @input="clickHandler(d.value)"
        :class="{'selected': type === d.value}"
      >
        <template #label>
          <div class="label-wrapper">
            <h4>{{ d.label }}</h4>
          </div>
        </template>

        <template #details>
          <div class="details-wrapper">
            <div class="details-wrapper__text">
              {{ d.details }}
            </div>
            <!-- <div v-if="d.value==='click_collect_free' && !isLocationCartOpen" class="details-wrapper__option">
              <b>Selected Store: {{ activeLocation.location_name }}</b>
            </div> -->
          </div>
        </template>
        <template #extends>
        <!-- <OmTrafficLight v-if="d.value === 'fitment'" :status="fitmentStatus" :description="fitmentDescription" /> -->
        </template>
      </OmRadio>
    </div>
    <div
      v-if="locationKind === 'click_collect_free'"
      class="om-locator-details-wrapper"
    >
      <transition name="fade">
        <div class="sf-radio location-details">
          <div>
          </div>
          <b class="location-name" v-if="activeLocation.location_name">{{ activeLocation.location_name }}</b>
          <b class="location-name" v-else>Please select a location</b>
          <div>{{ activeLocationAddress }}</div>
          <SfButton
            class="btn om-button"
            @click="openVehicleCart({ type: 'locationcart' })"
          >
            {{ activeLocation.location_name ? 'Change store' : 'Select store' }}
          </SfButton>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import OmRadio from 'theme/components/omni/om-radio.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { ModalList } from 'theme/store/ui/modals';
import OmTrafficLight from 'theme/components/omni/om-traffic-light'
import * as VehicleStorage from 'theme/store/vehicles-storage';
import { SfButton } from '@storefront-ui/vue';
import axios from 'axios';

export const initalData = [
  {
    label: 'Delivery',
    description: '',
    value: 'delivery_estimate_free',
    disabled: false
  },
  {
    label: 'Click & Collect',
    description: 'An item is unavailable for click and collect at you selected store',
    value: 'click_collect_free',
    disabled: false
  },
  {
    label: 'Fitted By Us',
    description: 'An item is unavailable for click and collect at you selected store',
    value: 'fitment',
    disabled: true
  }
];

export default {
  name: 'OmLocator',
  components: {
    OmRadio,
    OmTrafficLight,
    SfButton
  },
  data () {
    return {
      data: initalData,
      fitmentDescription: '',
      fitmentStatus: 'unavailable',
      locations: [],
      shipping: this.$store.state.checkout.shippingDetails
    };
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById',
      activeLocation: 'omLocator/activeLocation',
      locationKind: 'omLocator/locationKind',
      location: 'omLocator/location',
      shippingMethods: 'checkout/getShippingMethods'
    }),
    currentProductBrand () {
      return this.getCurrentProduct?.brand
        ? this.getAttributeLabelById('brand', this.getCurrentProduct.brand)
        : '';
    },
    type: {
      get: function () {
        return this.locationKind;
      },
      set: function (val) {
        return this.$store.commit('omLocator/setLocationKind', val);
      }
    },
    activeLocationAddress () {
      let result = '';
      result += this.activeLocation.street ? this.activeLocation.street + ', ' : '';
      result += this.activeLocation.city ? this.activeLocation.city + ', ' : '';
      result += this.activeLocation.postcode ? this.activeLocation.postcode + ', ' : '';
      return result;
    },
    paymentMethod () {
      return this.$store.getters['checkout/getPaymentMethods']
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    changeShippingMethod (method_code) {
      let currentShippingMethod = this.shippingMethods.find(method => method.method_code === method_code);
      if (currentShippingMethod) {
        this.shipping = Object.assign(this.shipping, { shippingCarrier: currentShippingMethod.carrier_code, shippingMethod: currentShippingMethod.method_code })
        this.$bus.$emit('checkout-after-shippingMethodChanged', {
          country: this.shipping.country,
          method_code: currentShippingMethod.method_code,
          carrier_code: currentShippingMethod.carrier_code,
          payment_method: this.paymentMethod[0].code
        })
      }
    },
    clickHandler (value) {
      this.type = value;

      if (value === 'click_collect_free' || value === 'fitment') {
        this.changeShippingMethod('collectoin');
      } else {
        this.changeShippingMethod('flatrate');
      }
    },
    viewDetails () {
      if (this.type === 'click_collect_free') {
        console.log('hey');
      }
    },
    changeStore () {
      if (this.type === 'click_collect_free') {
        this.openModal({
          name: ModalList.OmLocatorsModal,
          payload: {}
        });
      }
    },
    isDisable (data) {
      if (data.value === 'fitment') {
        return this.fitmentStatus === 'unavailable'
      } else {
        return false;
      }
    },
    async initialization () {
      try {
        this.data = initalData;

        this.locations = [];
        const { data: { status, data } } = await axios.get(`https://portal-api.omninext.app/api/locations/27?vsf_code=1`);
        if (status === 'success') {
          this.locations = data;
        }

        const fitmentProducts = await VehicleStorage.getFittingProducts();
        const availableFitmentProducts = fitmentProducts.filter(p => p.status);
        if (availableFitmentProducts.length) {
          this.fitmentDescription = `${availableFitmentProducts.length} of ${fitmentProducts.length} items require fitment. Other items will be available for collection when you visit us`;
          this.fitmentStatus = 'available';
          this.$store.commit('omLocator/setLocationKind', 'fitment');
        } else {
          this.fitmentStatus = 'unavailable';
          this.fitmentDescription = 'No items are selected or available for fitment';
        }
        this.$store.dispatch('omLocator/fetchLocationKind');
        this.$store.dispatch('omLocator/fetchActiveLocation');
      } catch (e) {
        console.log(e);
      }
    }
  },
  async mounted () {
    await this.initialization();
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-locator-wrapper, .om-locator-details-wrapper {
  display: flex;
  gap: var(--spacer-sm);
  width: 100%;
  @include for-mobile{
    flex-wrap: wrap;
  }
  .sf-radio {
    background: white;
    margin: calc(var(--spacer-sm) * 0.3) 0;
    padding: var(--spacer-xs) var(--spacer-sm);
    border-radius: var(--border-radius);
    width: inherit;
    border: 1px solid #ccc;
    &.is-disabled {
      .label-wrapper {
        color: #bfbfbf;
        .om-add-cart-step2__location_name {
          color: #bfbfbf;
        }
      }
    }
    &.selected {
      border: 1px solid var(--c-primary);
      background: #fff !important;
    }
  }
  .label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      text-transform: none;
      margin: var(--spacer-sm) 0;
    }

    .label-price {
      font-weight: 600;
      font-size: 20px;
      color: var(--add-cart-step-text-color);
    }
  }

  .details-wrapper {
    margin-bottom: var(--spacer-sm);
    color: var(--add-cart-step-text-color);

    &__text {
      margin-bottom: var(--spacer-xs);
    }
  }

  .description-wrapper {
    margin-bottom: var(--spacer-sm);

    &__text {
      margin-bottom: var(--spacer-xs);
    }

    &__option {
      a {
        text-decoration: underline;
      }
    }
  }

  &__location_name {
    color: var(--_c-red-primary-lighten);
  }
}

.om-locator-details-wrapper {

  .location-details {
    display: flex;
    gap: var(--spacer-sm);
  }
}

::v-deep {
  --radio-container-align-items: center;
  .sf-radio--is-active {
    background: transparent;
  }
}
::v-deep .sf-radio__content{
  display: flex;
}
</style>

<style lang="scss">
.om-locator {
  .om-traffic-light {
    position: absolute;
    bottom: var(--spacer-xs);
  }

  .change-store {
    max-width: 200px;
    border-radius: var(--border-radius);
    outline: none;
  }
}
.location-name{
  font-size: 20px;
  font-family: var(--font-family-bold);
}
</style>
