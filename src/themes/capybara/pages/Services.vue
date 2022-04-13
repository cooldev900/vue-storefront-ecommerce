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
      <omServiceFinder />
    </div>
    <div class="service-vehicles" v-if="getServiceVehicles">
      <div
        v-for="product in getServiceVehicles"
        :key="product.id"
        class="service-vehicles__product"
      >
        <div>{{ product.name }}</div>
        <div>price: {{ product.price }}</div>
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
          <span>{{ $t("Add to cart") }}</span>
        </SfButton>
      </div>
      <SfPagination
        v-if="totalPages > 1"
        class="products__pagination desktop-only"
        :current="currentPage"
        :total="totalPages"
        :visible="3"
      />
    </div>
    <div v-else>
      There is no data
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';
import { mapGetters, mapActions } from 'vuex';
import castArray from 'lodash-es/castArray';
import config from 'config';
import {
  buildFilterProductsQuery,
  isServer
} from '@vue-storefront/core/helpers';
import i18n from '@vue-storefront/i18n';
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll';
import { htmlDecode } from '@vue-storefront/core/filters';
import { quickSearchByQuery } from '@vue-storefront/core/lib/search';
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import {
  getTopLevelCategories,
  prepareCategoryMenuItem,
  prepareCategoryProduct
} from 'theme/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import ASortIcon from 'theme/components/atoms/a-sort-icon';
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
  SfImage
} from '@storefront-ui/vue';
import omServiceFinder from 'theme/components/omni/om-vehicle/om-service-finder.vue';
import OmCategoryHeader from 'theme/components/omni/om-category-header';
import OmProductCardLoader from 'theme/components/omni/skeletons/om-product-card-loader.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { ModalList } from 'theme/store/ui/modals';
import { createSmoothscroll } from 'theme/helpers';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';

const THEME_PAGE_SIZE = 12;
const LAZY_LOADING_ACTIVATION_BREAKPOINT = 1024;

export default {
  name: 'Services',
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
    SfImage
  },
  mixins: [onBottomScroll, SearchPanelMixin],
  data () {
    return {
      loading: false,
      loadingProducts: false,
      currentPage: 1
    };
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      getSystemFilterNames: 'category-next/getSystemFilterNames',
      getCategories: 'category/getCategories',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent',
      getAttributeLabelById: 'vehicles/getAttributeLabelById',
      getAttributeIdByLabel: 'vehicles/getAttributeIdByLabel',
      getServiceVehicles: 'vehicles/getServiceVehicles',
      getServiceVehicle: 'vehicles/getServiceVehicle',
      activeVehicle: 'vehicles/activeVehicle'
    })
  },
  methods: {
    async onBottomScroll () {
      // if (!this.isLazyLoadingEnabled || this.loadingProducts) {
      //   return;
      // }

      this.loadingProducts = true;
      await this.$store.dispatch('vehicle/loadMoreServiceProducts');
      this.loadingProducts = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
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
