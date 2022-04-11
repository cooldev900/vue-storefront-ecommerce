<template>
  <SfSidebar
    :visible="visibleSidebar"
    class="sf-sidebar--right sf-sidebar--icon om-location-cart"
    @close="closeSidebar"
  >
    <template #content-top>
      <div class="sidebar-text">
        Set Location
      </div>
      <OmLocationCartCard
        v-for="location in locations"
        :key="location.magento_code"
        :data="location"
        :brand="currentProductBrand"
        @close="closeSidebar"
      />
    </template>
  </SfSidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import OmLocationCartCard from './om-location-cart-card';
import Locations from 'theme/resource/locations.json';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

import { SfSidebar } from '@storefront-ui/vue';

export default {
  components: {
    SfSidebar,
    OmLocationCartCard
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      isSidebarVisible: false,
      showAllLocations: true
    };
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    visibleSidebar () {
      return this.isLocationCartOpen && this.isSidebarVisible;
    },
    currentProductBrand () {
      return this.getCurrentProduct.brand ? this.getAttributeLabelById(
        'brand',
        this.getCurrentProduct.brand
      ) : '';
    },
    locations () {
      const { storeId } = currentStoreView();
      if (this.showAllLocations && this.currentProductBrand) {
        return Locations['locations'][storeId].filter(location => {
          return location.brands.includes(this.currentProductBrand);
        });
      } else {
        return Locations['locations'][storeId];
      }
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar'
    }),
    onEscapePress () {
      this.closeMicrocartExtend();
    }
  },
  mounted () {
    this.isSidebarVisible = true;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-location-cart {
  ::v-deep .sf-sidebar__aside {
    --sidebar-background: var(--c-light-variant);
  }
  @include for-mobile {
    ::v-deep .sf-sidebar__aside {
      max-height: calc(100vh - var(--bottom-navigation-height));
    }
  }
  @include for-desktop {
    --sidebar-width: 34.5rem;
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: var(--spacer-base);
    ::v-deep .sf-sidebar__top {
      overflow-y: auto;
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
  .om-location-cart-card {
    &:first-child {
      margin-top: 0px;
    }
    margin-top: 20px;
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
