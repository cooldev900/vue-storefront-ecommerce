<template>
  <SfSidebar
    :visible="isVehicleCartOpen && isVehicleCartVisible"
    :button="false"
    title="My Saved Vehicles"
    class="sf-sidebar--right om-vehicle-cart"
    @close="closeSidebar"
  >
    <template #content-top>
      <OmAlertBox
        v-if="!vehicles || !vehicles.length"
        type="info"
        message="You do not have any saved vehicles."
      />
      <OmVehicleCartCard
        v-for="vehicle in vehicles"
        :key="vehicle.national_code"
        :vehicle="vehicle"
        :active="isActiveVehicle(vehicle)"
      />
    </template>
    <template #content-bottom>
      <transition name="fade">
        <div class="sidebar-footer">
          <SfButton
            class="sf-button--full-width om-btn--primary"
            @click.native="selectAnotherVehicle"
          >
            {{ $t("Select Another Vehicle") }}
          </SfButton>
        </div>
      </transition>
    </template>
  </SfSidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import OmVehicleCartCard from './om-vehicle-cart-card';
import { ModalList } from 'theme/store/ui/modals';
import OmAlertBox from 'theme/components/omni/om-alert-box';

import {
  SfButton,
  SfSidebar,
  SfIcon
} from '@storefront-ui/vue';

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size',
  'Trim'
];

export default {
  name: 'OmVehicleSideBar',
  components: {
    SfButton,
    SfSidebar,
    OmVehicleCartCard,
    SfIcon,
    OmAlertBox
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      isVehicleCartVisible: false
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals',
      isVehicleCartOpen: 'ui/isVehicleCartOpen',
      activeVehicle: 'vehicles/activeVehicle',
      vehicles: 'vehicles/vehicles'
    }),
    totalItems () {
      return this.productsInCart.length;
    },
    productsCount () {
      let count = 0;
      this.productsInCart.forEach((product) => {
        count = count + parseInt(product.qty);
      });
      return count;
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar',
      openModal: 'ui/openModal'
    }),
    closeMicrocartExtend () {
      this.$store.dispatch('ui/closeMicrocart');
    },
    onEscapePress () {
      this.closeMicrocartExtend();
    },
    selectAnotherVehicle () {
      // Check if the current pags is product or category
      // const { meta: { breadcrumb }, fullPath } = this.$route;

      // if (!(breadcrumb.includes('Category') || fullPath.includes('.html'))) {
      //   this.$router.push(localizedRoute('/'));
      // }

      this.openModal({
        name: ModalList.OmSelectorModal,
        payload: { successAction: true }
      });
      this.closeSidebar();
      this.closeMicrocartExtend();
    },
    getThumbnailForProductExtend (product) {
      return getThumbnailForProduct(product);
    },
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || {};
    },
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    goToCheckout () {
      this.$router.push(localizedRoute('/checkout'));
      this.closeMicrocartExtend();
    },
    changeQuantity (product, newQuantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: product,
        qty: newQuantity
      });
    },
    isActiveVehicle (vehicle) {
      return this?.activeVehicle && (this?.activeVehicle.national_code === vehicle.national_code)
    },
    getTitle (vehicle) {
      return `${vehicle.level1 || ''} ${vehicle.level5 || ''} ${vehicle.level6 || ''} ${vehicle.level7 || ''} ${vehicle.level3 || ''}`
    },
    getTitle2 (vehicle) {
      return `${vehicle.level2 || ''}`
    }
  },
  mounted () {
    this.isVehicleCartVisible = true;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-cart {
  .om-alert-box {
    margin: var(--spacer-base);
  }
  .sidebar-header{
    background: #fff;
    padding: 20px;
    position: fixed;
    top: 0;
  }
  ::v-deep .sf-bar{
      @include for-desktop {
        display: flex !important;
      }
      background: #f6f6f6;
      min-height: 70px;
  }
  ::v-deep .sf-heading{
       @include for-desktop {
        display: none !important;
      }
  }
  ::v-deep .sf-sidebar__aside {
    --sidebar-background: #fff;
  }
  ::v-deep .sf-sidebar__bottom{
    position: absolute;
    bottom: 30px;
    width: auto;
    left: 0;
    right: 0;
    top: auto;
}
  @include for-desktop {
    --sidebar-width: 34.5rem;
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: 0;
    ::v-deep .sf-sidebar__top {
      overflow-y: auto;
      padding: 0;
    }
    ::v-deep .sf-sidebar__content {
      height: 0;
    }
  }
  ::v-deep .sf-icon.size-xxl {
    --icon-size: 12.5rem;
    margin-top: -25px;
    height: 10.5rem;
  }
  .sidebar-text {
    font-size: var(--spacer-base);
    font-weight: 700;
    color: var(--c-grey-text);
    margin-bottom: var(--spacer-xl);
    &.footer-text {
      color: var(--c-grey-text-light);
      margin-bottom: 0;
      padding: 0 var(--spacer-2xl);
      text-align: center;
    }
  }
}
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
.sidebar-footer {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sf-button--full-width {
  font-size: 24px;
}
.empty-cart {
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 13.1875rem;
    margin: 0 0 var(--spacer-2xl) 0;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-xl);
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
}
</style>
