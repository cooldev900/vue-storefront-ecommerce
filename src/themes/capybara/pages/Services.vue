<template>
  <div id="category">
    <lazy-hydrate :trigger-hydration="!loading">
      <OmCategoryHeader
        v-if="!!getCurrentCategory"
        :title="getCategoryTitle"
        :products="getCurrentCategory.children_data"
        :description="getCurrentCategory.description"
        :parent-id="getCurrentCategory.parent_id"
      />
    </lazy-hydrate>
    <div>
      <omServiceFinder :loading="loading" @update:loading="setLoading" />
    </div>
    <div class="loader" v-if="loading">
      <SfLoader :loading="loading" />
    </div>
    <div v-else>
      <div class="service-vehicles" v-if="getServiceVehicles">
        <OmProductCard
          v-for="product in getServiceVehicles"
          :key="product.id"
          :title="product.name || product.title"
          :description="product.description"
          :image="product.image"
          :regular-price="product.price.regular"
          :special-price="product.price.special"
          :link="product.link"
          :brandImage="brandImage"
          link-tag="router-link"
          :wishlist-icon="false"
          class="products__product-card"
        >
          <template #image> </template>
          <template
            v-if="!product.price.regular && !product.price.special"
            #price
          >
            <b :style="{ color: 'black' }">Not Available Online</b>
          </template>
          <template #reviews>
            <div class="product-card__action-area">
              <SfButton
                :disabled="isProductDisabled || loading"
                class="
                  a-add-to-cart
                  om-btn--primary
                  btn--narrow
                  sf-button--full-width
                "
                @click.native="addToCart(product)"
              >
                <SfLoader v-if="loading" :loading="loading" />
                <span v-else>{{ $t("Add to cart") }}</span>
              </SfButton>
            </div>
          </template>
        </OmProductCard>
      </div>
      <div v-else>There is no data</div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from "vue-lazy-hydration";
import { mapGetters, mapActions } from "vuex";
import castArray from "lodash-es/castArray";
import config from "config";
import {
  buildFilterProductsQuery,
  isServer,
} from "@vue-storefront/core/helpers";
import i18n from "@vue-storefront/i18n";
import onBottomScroll from "@vue-storefront/core/mixins/onBottomScroll";
import { htmlDecode } from "@vue-storefront/core/filters";
import { quickSearchByQuery } from "@vue-storefront/core/lib/search";
import { getSearchOptionsFromRouteParams } from "@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers";
import { catalogHooksExecutors } from "@vue-storefront/core/modules/catalog-next/hooks";
import {
  getTopLevelCategories,
  prepareCategoryMenuItem,
  prepareCategoryProduct,
} from "theme/helpers";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import ASortIcon from "theme/components/atoms/a-sort-icon";
import {
  SfIcon,
  SfList,
  SfColor,
  SfButton,
  SfSelect,
  SfFilter,
  SfLoader,
  SfSidebar,
  SfHeading,
  SfMenuItem,
  SfAccordion,
  SfPagination,
  SfBreadcrumbs,
  SfProductCard,
  SfSearchBar,
  SfImage,
} from "@storefront-ui/vue";
import omServiceFinder from "theme/components/omni/om-vehicle/om-service-finder.vue";
import OmCategoryHeader from "theme/components/omni/om-category-header";
import OmProductCardLoader from "theme/components/omni/skeletons/om-product-card-loader.vue";
import SvgViewer from "theme/components/svg-viewer.vue";
import { ModalList } from "theme/store/ui/modals";
import SearchPanelMixin from "@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel";
import buildQuery from '@vue-storefront/core/modules/catalog/helpers/associatedProducts/buildQuery.ts';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import { Logger } from '@vue-storefront/core/lib/logger';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import OmProductCard from "theme/components/omni/om-product-card.vue";

const THEME_PAGE_SIZE = 12;
const LAZY_LOADING_ACTIVATION_BREAKPOINT = 1024;

export default {
  name: "Services",
  components: {
    LazyHydrate,
    ASortIcon,
    SfIcon,
    SfList,
    SfColor,
    SfLoader,
    SfButton,
    SfSelect,
    SfFilter,
    SfSidebar,
    SfHeading,
    SfMenuItem,
    SfAccordion,
    SfPagination,
    SfBreadcrumbs,
    SfProductCard,
    omServiceFinder,
    SvgViewer,
    SfSearchBar,
    OmCategoryHeader,
    OmProductCardLoader,
    SfImage,
    OmProductCard
  },
  mixins: [onBottomScroll, SearchPanelMixin],
  data() {
    return {
      loading: false,
      loadingProducts: false,
      currentPage: 1,
      brandImage: "/assets/continental_logo.svg"
    };
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: "category-next/getCurrentSearchQuery",
      getCategoryProducts: "category-next/getCategoryProducts",
      getCurrentCategory: "category-next/getCurrentCategory",
      getCategoryProductsTotal: "category-next/getCategoryProductsTotal",
      getAvailableFilters: "category-next/getAvailableFilters",
      getCurrentFilters: "category-next/getCurrentFilters",
      hasActiveFilters: "category-next/hasActiveFilters",
      getSystemFilterNames: "category-next/getSystemFilterNames",
      getCategories: "category/getCategories",
      getBreadcrumbsRoutes: "breadcrumbs/getBreadcrumbsRoutes",
      getBreadcrumbsCurrent: "breadcrumbs/getBreadcrumbsCurrent",
      getAttributeLabelById: "vehicles/getAttributeLabelById",
      getAttributeIdByLabel: "vehicles/getAttributeIdByLabel",
      getServiceVehicles: "vehicles/getServiceVehicles",
      getServiceVehicle: "vehicles/getServiceVehicle",
      activeVehicle: "vehicles/activeVehicle",
      serviceVehicle: "vehicles/serviceVehicle",
    }),
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    async onBottomScroll() {
      // if (!this.isLazyLoadingEnabled || this.loadingProducts) {
      //   return;
      // }
      // this.loadingProducts = true;
      // await this.$store.dispatch('vehicle/loadMoreServiceProducts');
      // this.loadingProducts = false;
    },
    setLoading(value) {
      this.loading = value;
    },
    async addToCart (product) {
      this.isAddingToCart = true;
      const query = buildQuery([product.sku]);
      console.log(product, 'product');
      try {
        const { items = [] } = await ProductService.getProducts({
          query,
          size: 1,
          configuration: { sku: product.sku },
          options: {
            prefetchGroupProducts: true,
            assignProductConfiguration: true
          }
        });
        
        const productData = items[0] || null;
        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, productData, { qty: 1 })
        });

        const cartItems = await StorageManager.get('cart').getItem('current-cart');
        cartItems.forEach(item => {
          if (item.groupedParents) {
            item.groupedParents.map(p => {
              if (p.name === productData.name && this.activeVehicle?.National_Code) {
                if (item.fitVehicles) {
                  const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle?.National_Code);
                  if (!existFitVehicle) {
                    item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                  }
                } else {
                  item.fitVehicles = [ this.activeVehicle ];
                }

                // setting main_image
              }
              if (p.name === productData.name && productData.main_image) {
                item.main_image = productData.main_image;
              }
            })
          } else {
            if (item.sku === productData.sku && this.activeVehicle?.National_Code) {
              if (item.fitVehicles) {
                const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle?.National_Code);
                if (!existFitVehicle) {
                  item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                }
              } else {
                item.fitVehicles = [ this.activeVehicle ];
              }
            }
          }
        })
        
        await StorageManager.get('cart').setItem('current-cart', cartItems).catch((reason) => {
          Logger.error(reason)()
        })
        const storedItems = await StorageManager.get('cart').getItem('current-cart');
        this.$store.dispatch('cart/syncCartWhenLocalStorageChange', { items: storedItems })
        this.loading = false;
        console.log(storedItems, 'storeItems');
        this.$store.commit(
          'notification/clearNotification',
          { root: true }
        );
        
        this.openModal({
          name: ModalList.OmCartPopupModal,
          payload: {
            qty: 1,
            name: productData.name
          }
        });
      } catch (message) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message }),
          { root: true }
        );
      }
      
      this.isAddingToCart = false;
    }
  },
  watch: {
    getServiceVehicles(value) {
      console.log(value, "getServiceVehicles");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.loader {
  max-width: 1600px;
  padding: 0 15px !important;
  margin: auto !important;
  display: flex;
  min-height: 600px;

  .sf-loader {
    top: 300px;
  }
}
.service-vehicles {
  max-width: 1600px;
  padding: 0 15px !important;
  margin: auto !important;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: 30% 30% 30%;

  &__product {
    margin: 15px;
  }
}
</style>
