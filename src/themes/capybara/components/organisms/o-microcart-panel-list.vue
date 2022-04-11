<template>
  <div class="o-microcart-panel-list">
    <transition name="fade" mode="out-in">
      <div key="my-cart" class="my-cart">
        <div class="collected-product-list">
          <transition-group name="fade" tag="div">
            <SfCollectedProduct
              v-for="product in products"
              :key="product.id"
              :image="getThumbnailForProductExtend(product)"
              :title="product.name"
              :regular-price="getProductPrice(product).regular"
              :special-price="getProductPrice(product).special"
              :stock="10"
              :qty="product.qty"
              class="collected-product"
              @click:remove="removeHandler(product)"
              @input="changeQuantity(product, $event)"
            >
              <template #configuration>
                <div class="collected-product__properties">
                  <SfProperty :name="$t('SKU')" :value="product.sku" />
                  <SfProperty
                    v-for="(property, oIndex) in getProductOptions(product)"
                    :key="oIndex"
                    :name="getPropertyLabel(property.label)"
                  >
                    <template #value>
                      <span
                        class="sf-property__value"
                        v-html="property.value"
                      />
                    </template>
                  </SfProperty>
                </div>
              </template>
              <template #more-actions>
                <span />
              </template>
              <template #input>
                <SfProperty class="collected-product-qty" :name="$t('Quantity')" :value="product.qty" />
              </template>
              <template #remove>
                <span />
              </template>
            </SfCollectedProduct>
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  getThumbnailForProduct,
  productChecksum
} from '@vue-storefront/core/modules/cart/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers';
import {
  SfButton,
  SfCollectedProduct,
  SfProperty,
  SfPrice,
  SfImage,
  SfHeading,
  SfSidebar
} from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OMicrocartPanelList',
  components: {
    SfButton,
    SfCollectedProduct,
    SfProperty,
    SfPrice,
    SfImage,
    SfHeading,
    SfSidebar
  },
  props: ['products'],
  computed: {
    ...mapGetters({
      totals: 'cart/getTotals'
    })
  },
  methods: {
    getThumbnailForProductExtend (product) {
      return getThumbnailForProduct(product);
    },
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    changeQuantity (product, newQuantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: product,
        qty: newQuantity
      });
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || {};
    },
    getPropertyLabel (label) {
      if (label === 'Step 2 - Select Delivery Method') {
        return 'Delivery Method';
      } else {
        return label;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-sm);
    --price-font-weight: var(--font-semibold);
    margin: 0 0 var(--spacer-xs) 0;
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  --collected-product-image-background: var(--c-white);
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
    opacity: var(--cp-actions-opacity, 0);
  }
  &__action {
    --button-padding: 0;
  }
  &:hover {
    --cp-actions-opacity: 1;
  }
  &__fitting_price {
    margin-top: 40px;
    &_remove_button {
      margin-left: 15px;
      border: 1px solid gainsboro;
    }
  }
  &-qty {
    justify-content: center;
  }
  .sf-property {
    align-items: center;
  }
}
</style>
