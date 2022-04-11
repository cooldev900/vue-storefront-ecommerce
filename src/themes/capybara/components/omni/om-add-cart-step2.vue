<template>
  <div v-if="shouldBeRender" class="om-add-cart-step2">
    <SfRadio
      v-for="d in data"
      :key="d.value"
      :name="d.value"
      :value="d.value"
      :selected="selectedRadio"
      :disabled="d.disabled"
      @input="clickHanlder(d.value)"
    >
      <template #label>
        <div class="label-wrapper">
          <span>
            <span>{{ d.label_1 }}</span>
            <span class="om-add-cart-step2__location_name">{{
              d.label_2
            }}</span>
          </span>
          <span class="label-price">{{ d.price }}</span>
        </div>
      </template>
    </SfRadio>
  </div>
</template>

<script>
import { SfRadio } from '@storefront-ui/vue';
import { mapActions, mapGetters } from 'vuex';
import * as LocationStorage from 'theme/store/locations-storage.ts';

export const initalData = [
  {
    label_1: 'Home Delivery',
    label_2: '',
    price: '',
    value: 'homeDelivery',
    disabled: false
  },
  {
    label_1: 'Click & Collect',
    label_2: '',
    price: 'Free',
    value: 'clickCollect',
    disabled: false
  },
  {
    label_1: 'Have this item fitted by',
    label_2: 'us',
    price: '+£20',
    value: 'haveItem',
    disabled: false
  }
];

export default {
  name: 'OmAddCartStep2',
  components: {
    SfRadio
  },
  data () {
    return {
      data: initalData,
      selectedRadio: 'homeDelivery'
    };
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    currentProductBrand () {
      return this.getCurrentProduct.brand
        ? this.getAttributeLabelById('brand', this.getCurrentProduct.brand)
        : '';
    },
    shouldBeRender () {
      return String(this.isLocationCartOpen).length
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    }),
    clickHanlder (value) {
      this.selectedRadio = value;

      if (value === 'clickCollect' || value === 'haveItem') {
        this.openVehicleCart({ type: 'locationcart' });
      }
    },
    initialization () {
      const currentProductLocation = LocationStorage.getLocationByBrand(
        this.currentProductBrand
      );
      const brandRate = LocationStorage.getRateByBrand(this.currentProductBrand)
        ? Number(LocationStorage.getRateByBrand(this.currentProductBrand))
        : 0;
      const fittingTime = this.getCurrentProduct.fitting_time
        ? Number(this.getCurrentProduct.fitting_time)
        : 0;

      if (this.selectedRadio === 'haveItem' && !fittingTime) {
        this.selectedRadio = 'homeDelivery';
      }

      if (currentProductLocation) {
        this.data = [
          {
            label_1: 'Home Delivery',
            label_2: '',
            price: '',
            value: 'homeDelivery',
            disabled: false
          },
          {
            label_1: ' (Click & Collect) ',
            label_2: currentProductLocation.location_name,
            price: 'Free',
            value: 'clickCollect',
            disabled: false
          },
          {
            label_1: 'Have this item fitted by ',
            label_2: currentProductLocation.location_name,
            price: '+£' + fittingTime * brandRate,
            value: 'haveItem',
            disabled: !fittingTime
          }
        ];
      } else {
        this.data = initalData;
      }
    }
  },
  mounted () {
    this.initialization();
  }
};
</script>
<style lang="scss" scoped>
.om-add-cart-step2 {
  display: flex;
  flex-direction: column;
  .sf-radio {
    background: white;
    margin: calc(var(--spacer-sm) * 0.3) 0;
    padding: var(--spacer-xs) var(--spacer-sm);
    border-radius: var(--border-radius);
    &.is-disabled {
      .label-wrapper {
        color: #bfbfbf;
        .om-add-cart-step2__location_name {
          color: #bfbfbf;
        }
      }
    }
  }
  .label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label-price {
      font-weight: 600;
      font-size: 20px;
      color: var(--add-cart-step-text-color);
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
</style>
