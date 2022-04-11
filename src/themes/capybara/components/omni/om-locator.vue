<template>
  <div v-if="shouldBeRender" class="om-locator">
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
          <div v-if="d.value==='click_collect_free'" class="details-wrapper__option">
            <!-- <b>Selected Store: {{ location.location_name }}</b> -->
          </div>
        </div>
      </template>
      <template #extends>
      <!-- <OmTrafficLight v-if="d.value === 'fitment'" :status="fitmentStatus" :description="fitmentDescription" /> -->
      </template>
    </OmRadio>
  </div>
</template>

<script>
import OmRadio from 'theme/components/omni/om-radio.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import * as LocationStorage from 'theme/store/locations-storage.ts';
import { ModalList } from 'theme/store/ui/modals';
import OmTrafficLight from 'theme/components/omni/om-traffic-light'
import * as VehicleStorage from 'theme/store/vehicles-storage';

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
    disabled: true
  },
  {
    label: 'Fitted By Us',
    description: 'An item is unavailable for click and collect at you selected store',
    value: 'fitment',
    disabled: false
  }
];

export default {
  name: 'OmLocator',
  components: {
    OmRadio,
    OmTrafficLight
  },
  data () {
    return {
      data: initalData,
      fitmentDescription: '',
      fitmentStatus: 'unavailable'
    };
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById',
      location: 'omLocator/location',
      locationKind: 'omLocator/locationKind'
    }),
    currentProductBrand () {
      return this.getCurrentProduct?.brand
        ? this.getAttributeLabelById('brand', this.getCurrentProduct.brand)
        : '';
    },
    shouldBeRender () {
      return String(this.isLocationCartOpen).length
    },
    type: {
      get: function () {
        return this.locationKind;
      },
      set: function (val) {
        return this.$store.commit('omLocator/setLocationKind', val);
      }
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    clickHandler (value) {
      this.type = value;

      if (value === 'click_collect_free' || value === 'fitment') {
        this.openVehicleCart({ type: 'locationcart' });
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
      const currentProductLocation = LocationStorage.getLocationByBrand(
        this.currentProductBrand
      );
      // const brandRate = LocationStorage.getRateByBrand(this.currentProductBrand)
      //   ? Number(LocationStorage.getRateByBrand(this.currentProductBrand))
      //   : 0;
      // const fittingTime = this.getCurrentProduct?.fitting_time
      //   ? Number(this.getCurrentProduct.fitting_time)
      //   : 0;

      // if (this.type === 'haveItem' && !fittingTime) {
      //   this.type = 'click_collect_free';
      // }

      if (currentProductLocation) {
        this.data = initalData;
      } else {
        this.data = initalData;
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
    }
  },
  async mounted () {
    await this.initialization();
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-locator {
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
    width: 100%;
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
}
</style>
