<template>
  <form class="m-product-options-custom">
    <div
      v-for="option in product.custom_options"
      :key="'customOption_' + option.option_id"
      class="single-option"
    >
      <SfAlert
        v-if="getError(option.option_id).error"
        type="danger"
        :message="getError(option.option_id).message"
      />
      <h2 class="add-cart-step-text sf-heading--left">
        {{ option.title }}
      </h2>
      <div v-if="option.type === 'field'">
        <SfInput
          type="text"
          :required="option.is_require"
          :label="option.title"
          :name="'customOption_' + option.option_id"
          v-model="inputValues['customOption_' + option.option_id]"
          @change="optionChanged(option)"
        />
      </div>
      <div v-if="option.type === 'drop_down' || option.type === 'select'">
        <SfSelect
          class="sf-select--underlined"
          v-model="inputValues['customOption_' + option.option_id]"
          @change="optionChanged(option)"
          :required="option.is_require"
        >
          <SfSelectOption
            v-for="opval in option.values"
            :key="opval.option_type_id"
            :value="String(opval.option_type_id)"
          >
            <SfProductOption :label="opval.title" />
          </SfSelectOption>
        </SfSelect>
      </div>
      <div
        class="m-product-options-custom__custom-raido"
        v-if="option.type === 'radio'"
      >
        <SfRadio
          v-for="opval in option.values"
          :key="opval.option_type_id"
          :name="'customOption_' + option.option_id + opval.option_type_id"
          :value="String(opval.option_type_id)"
          v-model="inputValues['customOption_' + option.option_id]"
          @input="radioOptionChanged(option, opval)"
          :required="option.is_require"
        >
          <template #label>
            <div class="label-wrapper">
              <span>
                {{ opval.title }}
                <span
                  v-if="showBrandLocation(opval)"
                  class="label-wrapper__location_name"
                >({{ brandLocation.location_name }})</span>
              </span>
              <span v-if="showBrandLocation(opval)" class="label-price">{{
                getRadioCardPrice(opval) | price
              }}</span>
            </div>
          </template>
        </SfRadio>
      </div>
      <div v-if="option.type === 'checkbox'">
        <SfCheckbox
          v-for="opval in option.values"
          :key="opval.option_type_id"
          :label="opval.title + '_$' + opval.price"
          :name="'customOption_' + option.option_id + opval.option_type_id"
          :value="String(opval.option_type_id)"
          v-model="inputValues['customOption_' + option.option_id]"
          @change="optionChanged(option)"
          :required="option.is_require"
        />
      </div>
      <SfDivider />
    </div>
  </form>
</template>

<script>
import { ProductCustomOptions } from '@vue-storefront/core/modules/catalog/components/ProductCustomOptions';
import {
  SfCheckbox,
  SfAlert,
  SfHeading,
  SfRadio,
  SfSelect,
  SfProductOption,
  SfInput,
  SfDivider
} from '@storefront-ui/vue';
import get from 'lodash-es/get';
import {
  customOptionFieldName,
  defaultCustomOptionValue,
  selectedCustomOptionValue
} from '@vue-storefront/core/modules/catalog/helpers/customOption';
import * as LocationStorage from 'theme/store/locations-storage.ts';
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [ProductCustomOptions],
  components: {
    SfCheckbox,
    SfAlert,
    SfHeading,
    SfRadio,
    SfSelect,
    SfProductOption,
    SfInput,
    SfDivider
  },
  data () {
    return {
      brandLocation: null
    };
  },
  watch: {
    isLocationCartOpen (val) {
      this.brandLocation = LocationStorage.getLocationByBrand(
        this.currentProductBrand
      );
    }
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    getError () {
      return optionId => {
        const error = get(
          this.validation.results,
          'customOption_' + optionId,
          {}
        );
        return error;
      };
    },
    productOptions () {
      return this.product.custom_options.map(customOption => ({
        ...customOption,
        option_id: String(customOption.option_id),
        values: Array.isArray(customOption.values)
          ? customOption.values.map(value => ({
            ...value,
            option_type_id: String(value.option_type_id)
          }))
          : customOption.values
      }));
    },
    selectedOptions () {
      const customOptions = this.productOptions;
      if (!customOptions) {
        return {};
      }

      return customOptions.reduce((selectedOptions, option) => {
        const fieldName = customOptionFieldName(option);
        selectedOptions[fieldName] = selectedCustomOptionValue(
          option.type,
          option.values,
          this.inputValues[fieldName]
        );
        return selectedOptions;
      }, {});
    },
    currentProductBrand () {
      return this.getCurrentProduct.brand
        ? this.getAttributeLabelById('brand', this.getCurrentProduct.brand)
        : '';
    }
    // brandRate () {
    //   return LocationStorage.getRateByBrand(this.currentProductBrand)
    //     ? Number(LocationStorage.getRateByBrand(this.currentProductBrand))
    //     : 0;
    // }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    }),
    setupInputFields () {
      for (const customOption of this.productOptions) {
        const fieldName = customOptionFieldName(customOption);
        this.$set(
          this.inputValues,
          fieldName,
          defaultCustomOptionValue(customOption)
        );
        if (customOption.is_require) {
          // validation rules are very basic
          this.$set(this.validation.rules, fieldName, 'required'); // TODO: add custom validators for the custom options
        }
        this.optionChanged(customOption);
      }
    },
    radioOptionChanged (option, currentOption) {
      if (
        currentOption.title === 'Click & Collect' ||
        currentOption.title === 'Include Fitment'
      ) {
        this.openVehicleCart({ type: 'locationcart' });
      }

      // if (currentOption.title === 'Include Fitment') {
      //   const newCurrentOption = Object.assign(currentOption);
      //   newCurrentOption.price = this.brandRate * currentOption.price;

      //   option.values.forEach((o, index) => {
      //     if (o.option_type_id === currentOption.option_type_id) {
      //       option.values[index] = newCurrentOption;
      //     }
      //   });
      // }

      this.optionChanged(option);
    },
    getRadioCardPrice (optionVal) {
      switch (optionVal.title) {
        case 'Include Fitment':
          return optionVal.price;
        case 'Click & Collect':
          return 'Free';
        case 'Home Delivery':
          return '';
      }
    },
    showBrandLocation (optionVal) {
      return (
        optionVal.title !== 'Home Delivery' && this.brandLocation?.location_name
      );
    }
  },
  mounted () {
    this.brandLocation = LocationStorage.getLocationByBrand(
      this.currentProductBrand
    );
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-product-options-custom {
  margin: 0 var(--spacer-sm);
  @include for-desktop {
    margin: 0;
  }

  &__custom-raido {
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
          &__location_name {
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
      &__location_name {
        color: var(--_c-red-primary-lighten);
      }
    }
  }
}
.single-option {
  margin-top: 1.5rem;
}
.sf-divider {
  margin-top: 1.5rem;
}
</style>
