<template>
  <div id="category">
    <div class="search-container  grid-container">
      <div class="o-search-bar">
        <SfSearchBar
          v-model="search"
          :placeholder="$t('Search for Accessories')"
          class="sf-header__search"
        />
        <SfButton @click="startSearch" class="search-btn"> submit </SfButton>
      </div>
    </div>
    <div class="main grid-container">
      <div class="sidebar desktop-only">
        <!-- <div>
            <omTyreFinder v-if="shouldShowVehicleCard" />
        </div> -->
        <div class="filters">
          <lazy-hydrate :trigger-hydration="loading">
            <SfAccordion
              open="Accessories"
              :first-open="true"
              :multiple="true"
              transition=""
              show-chevron
            >
              <template v-for="(filters, filterType) in availableFilters">
                <SfAccordionItem :key="filterType" :header="title(filterType)">
                  <template v-if="filterType === 'color_sfilter'">
                    <div class="filters__colors" :key="filterType + 'filter'">
                      <SfColor
                        v-for="filter in filters"
                        :key="filter.id"
                        :color="filter.color"
                        :selected="isFilterActive(filter)"
                        class="filters__color"
                        @click="changeFilter(filter)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <SfFilter
                      v-for="filter in filters"
                      :key="filter.id"
                      :label="filter.label"
                      :count="filter.count"
                      :color="filter.color"
                      :selected="isFilterActive(filter)"
                      class="filters__item"
                      @change="changeFilter(filter)"
                    />
                  </template>
                </SfAccordionItem>
              </template>
            </SfAccordion>
          </lazy-hydrate>
        </div>
      </div>
      <div class="products">
        <div class="navbar section">
          <div class="navbar__main">
            <div class="navbar__filter mobile-only">
              <SfButton
                class="sf-button--text navbar__filters-button"
                @click="isFilterSidebarOpen = true"
              >
                <SfIcon size="18px" class="navbar__filters-icon" color="#BEBFC4" icon="filter" />
                {{ $t("Filters") }}
              </SfButton>
              <template v-if="activeFiltersCount">
                ({{ activeFiltersCount }})
                <span> &nbsp;&mdash;&nbsp;</span>
                <button @click="clearAllFilters" class="sf-button sf-button--text navbar__filters-clear-all">
                  {{ $t('Clear all') }}
                </button>
              </template>
            </div>
            <div class="navbar__counter">
              <span class="navbar__label desktop-only">
                {{ $t("Products found") }}:
              </span>
              <strong class="desktop-only">{{ visibleProducts.length }}</strong>
              <span class="navbar__label mobile-only">
                {{ $t("{count} items", { count: visibleProducts.length }) }}
              </span>
            </div>
            <div class="navbar__sort">
              <span class="navbar__label desktop-only">{{ $t("Sort By") }}:</span>
              <SfSelect
                class="navbar__select sort-by"
                ref="SortBy"
                :selected="sortOrder"
                @change="changeSortOder"
              >
                <SfSelectOption
                  v-for="option in sortOptions"
                  :key="option.id"
                  :value="option.id"
                  class="sort-by__option"
                >
                  {{ option.label }}
                </SfSelectOption>
              </SfSelect>
              <SfButton
                class="sf-button--text navbar__filters-button sort-by__button mobile-only"
                @click="$refs.SortBy.toggle()"
              >
                {{ $t("Sort By") }}
                <ASortIcon />
              </SfButton>
            </div>
          </div>
        </div>
        <div v-if="loading && !visibleProducts.length">
          <transition-group
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <OmProductCardLoader
              v-for="(value, index) in new Array(9).fill('')"
              :key="index"
            />
          </transition-group>
        </div>
        <SfHeading
          v-if="!visibleProducts.length && !loading"
          :title="$t('No products found!')"
          :subtitle="
            $t(
              'Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!'
            )
          "
        />
        <template>
            <!-- <lazy-hydrate :trigger-hydration="loading"> -->

            <transition-group
              appear
              name="products__slide"
              tag="div"
              class="products__grid"
            >
              <OmProductCard
                v-for="product in visibleProducts"
                :product="product"
                :key="product.id"
                :title="product.enhanced_title || product.title"
                :description="product.description"
                :image="product.image"
                :regular-price="product.price.regular"
                :special-price="product.price.special"
                :link="product.link"
                :qty1="product.qty"
                :brand-image="product.brand_logo"
                :brand-color="product.brand_colour"
                link-tag="router-link"
                :wishlist-icon="false"
                offer="Save 10% with code NEW10"
                promotion="Mobile Fitting Service Available"
                :waranty="product.usp1"
                :usp2="product.usp2"
                :second-title="product.secondary_title"
                :stock="product.stock"
                class="products__product-card"
              >
                <template #image>
                  <SfImage
                    class="sf-product-card__image"
                    :src="product.image"
                    :alt="product.enhanced_title || product.title"
                    :width="216"
                    :height="326"
                    lazy
                    :threshold="0.2"
                  />
                </template>
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
            </transition-group>
            <!-- </lazy-hydrate> -->
            <SfPagination
              v-if="totalPages > 1"
              class="products__pagination"
              :current="currentPage"
              :total="totalPages"
              :visible="3"
            />
          </template>
      </div>
    </div>
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{ breadcrumb }">
        <router-link
          :to="breadcrumb.route.link"
          class="sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
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
import OmVehicleCardCategory from 'theme/components/omni/om-vehicle/om-vehicle-card-category';
import OmCategoryHeader from 'theme/components/omni/om-category-header';
import OmProductCardLoader from 'theme/components/omni/skeletons/om-product-card-loader.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { ModalList } from 'theme/store/ui/modals';
import { createSmoothscroll } from 'theme/helpers';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import { prepareQuickSearchQuery } from '@vue-storefront/core/modules/catalog/queries/searchPanel'
import OmProductCard from 'theme/components/omni/om-product-card.vue';
import omTyreFinder from 'theme/components/omni/om-vehicle/om-tyre-finder';

const THEME_PAGE_SIZE = 12;
const LAZY_LOADING_ACTIVATION_BREAKPOINT = 1024;

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    await store.dispatch('category-next/loadCategoryProducts', {
      route,
      category: null,
      pageSize: THEME_PAGE_SIZE
    });
  } catch (e) {
    //
  }
};

export default {
  name: 'CategoryPage',
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
    OmVehicleCardCategory,
    SvgViewer,
    SfSearchBar,
    OmCategoryHeader,
    OmProductCardLoader,
    SfImage,
    OmProductCard,
    omTyreFinder
  },
  mixins: [onBottomScroll, SearchPanelMixin],
  data () {
    return {
      loading: true,
      loadingProducts: false,
      currentPage: 1,
      getMoreCategoryProducts: [],
      browserWidth: 0,
      isFilterSidebarOpen: false,
      unsubscribeFromStoreAction: null,
      aggregations: null,
      search: null
    };
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getSearchFilters: 'category-next/getSearchFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      hasActiveFilters: 'category-next/hasActiveFilters',
      getSystemFilterNames: 'category-next/getSystemFilterNames',
      getCategories: 'category/getCategories',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent',
      getAttributeLabelById: 'vehicles/getAttributeLabelById',
      getAttributeIdByLabel: 'vehicles/getAttributeIdByLabel',
      activeVehicle: 'vehicles/activeVehicle'
    }),
    visibleProducts () {
      return this.products.map(product => prepareCategoryProduct(product));
    },
    shouldShowVehicleCard () {
      let existsNationCode = false;
      if (this.activeVehicle && this.activeVehicle.national_code) { existsNationCode = true; }

      let isFullWidth = false;
      if (
        this.getCurrentCategory &&
        this.getCurrentCategory?.page_layout === 'category-full-width'
      ) { isFullWidth = true; }

      if (!Object.keys(this.availableFilters).length) return false;
      return !isFullWidth;
    },
    isOnWishlist () {
      return product => this.$store.getters['wishlist/isOnWishlist'](product)
    },
    search () {
      return this.$route.query.search
    },
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products');
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0;
    },
    productTotalCount () {
      return this.getCategoryProductsTotal;
    },
    isLazyLoadingEnabled () {
      return this.browserWidth < LAZY_LOADING_ACTIVATION_BREAKPOINT;
    },
    breadcrumbs () {
      const items = this.getBreadcrumbsRoutes
        .map(route => ({
          text: htmlDecode(route.name),
          route: {
            link: route.route_link
          }
        }))
        .concat({
          text: htmlDecode(this.getBreadcrumbsCurrent)
        });

      items.shift();

      return items;
    },
    
    currentPageProducts () {
      // lazy loading is disabled for desktop screen width (>= 1024px)
      // so products from store have to be filtered out because there could
      // be more than THEME_PAGE_SIZE of them - they could be fetched earlier
      // when lazy loading was enabled
      return this.isLazyLoadingEnabled || this.currentPage === 1
        ? this.getCategoryProducts
          .filter((product, i) => {
            return this.isLazyLoadingEnabled || i < THEME_PAGE_SIZE;
          })
          .map(prepareCategoryProduct)
        : this.getMoreCategoryProducts.map(prepareCategoryProduct);
    },
    totalPages () {
      return Math.ceil(this.getCategoryProductsTotal / THEME_PAGE_SIZE);
    },
    sortOrder () {
      return (
        this.getCurrentSearchQuery.sort ||
        `${config.products.defaultSortBy.attribute}:${config.products.defaultSortBy.order}`
      );
    },
    sortOptions () {
      return Object.entries(config.products.sortByAttributes).map(attribute => {
        const [label, id] = attribute;
        return { id, label };
      });
    },
    sortLabel () {
      const selectedSortOrder =
        this.sortOptions.find(sortOption => sortOption.id === this.sortOrder) ||
        {};
      return selectedSortOrder.label || '';
    },
    availableFilters () {
      const result = Object.entries(this.getSearchFilters || {})
        .filter(([filterType, filters]) => {
          return (
            filters.length && !this.getSystemFilterNames.includes(filterType)
          );
        })
        .reduce((result, [filterType, filters]) => {
          if (!filterType.includes('national_code')) {
            result[`${filterType}_filter`] = filters.reduce(
              (result, filter) => {
                result = [
                  ...result,
                  {
                    ...filter,
                    label: filter.label,
                    count: this.getFilterCount(filter) || '',
                    color:
                      filterType === 'coulor'
                        ? (config.products.colorMappings &&
                          config.products.colorMappings[filter.label]) ||
                        filter.label
                        : undefined
                  }
                ];
                return result;
              },
              []
            );
          }
          return result;
        }, {});

      return result;
    },
    activeFiltersCount () {
      let counter = 0;
      Object.keys(this.getCurrentFilters).forEach(key => {
        if (!key.includes('national_code')) {
          counter += this.getCurrentFilters[key].length;
        }
      });
      return counter;
    },
    isFilterActive () {
      return filter =>
        castArray(this.getCurrentFilters[filter.type]).find(
          variant => variant && variant.id === filter.id
        ) !== undefined;
    },
  },
  watch: {
    sortOrder () {
      if (this.currentPage > 1) {
        this.changePage();
      }
    },
    activeVehicle () {
      this.$store.dispatch('category-next/switchSearchFilters', [
        { id: 'updated_at:desc', type: 'sort' }
      ]);
    },
    $route: {
      immediate: true,
      handler (to, from) {
        this.$store.commit('vehicles/toggleSetPrompt', false);
        this.search = to.query.search
        if (to.query?.page && to?.path === from?.path) {
          this.changePage(parseInt(to.query.page) || 1);
        } else {
          this.initPagination();
        }
      }
    }
  },
  async asyncData ({ store, route, context }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add('category');
    await composeInitialPageState(store, route);
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) 
      next( async vm => {
        vm.loading = false;
      });
    // // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true;
        vm.search = to.query.search
        await composeInitialPageState(vm.$store, to, true);
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }); // await here is because we must wait for the hydration
        vm.loading = false;
      });
    } else {
      // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true;
        vm.search = to.query.search
        // await composeInitialPageState(vm.$store, to, true);
        // vm.$store.dispatch('category-next/cacheProducts', { route: to });
        vm.loading = false;
      });
    }
  },
  created () {
    this.search = this.$router.query?.search
  },
  mounted () {
    this.search = this.$router.query?.search
    this.unsubscribeFromStoreAction = this.$store.subscribeAction(action => {
      if (action.type === 'category-next/loadAvailableFiltersFrom') {
        this.aggregations = action.payload.aggregations;
      }
    });
    this.$bus.$on('product-after-list', this.initPagination);
    window.addEventListener('resize', this.getBrowserWidth);
    this.getBrowserWidth();
    this.startSearch();
  },
  beforeDestroy () {
    this.unsubscribeFromStoreAction();
    this.$bus.$off('product-after-list', this.initPagination);
    window.removeEventListener('resize', this.getBrowserWidth);
  },

  async beforeMount () {
    await this.$store.dispatch('wishlist/load')
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    async addToWishlist (product) {
      this.$store.dispatch(
        'notification/spawnNotification',
        {
          type: 'success',
          message: i18n.t('Product has been added to wishlist!', {
            productName: htmlDecode(product.name)
          }),
          action1: { label: i18n.t('OK') }
        },
        { root: true }
      );
      this.$store.state['wishlist'] ? this.$store.dispatch('wishlist/addItem', product) : false
    },
    removefromWishlist (product) {
      this.$store.dispatch(
        'notification/spawnNotification',
        {
          type: 'success',
          message: i18n.t(
            'Product {productName} has been removed from wishlist!',
            { productName: htmlDecode(product.name) }
          ),
          action1: { label: i18n.t('OK') }
        },
        { root: true }
      );
      this.$store.dispatch('wishlist/removeItem', product)
    },

    toggleWishlist (product) {
      this.isOnWishlist(product) ? this.removefromWishlist(product) : this.addToWishlist(product);
    },
    title (filterType) {
      if (filterType === 'right_left_filter') {
        return 'Fitting Position (R / L)';
      } else if (filterType === 'price_filter') {
        return 'Price';
      } else if (filterType === 'size_filter') {
        return 'Size';
       } else if (filterType === 'brand_filter') {
        return 'Brand';
      }
      else if (filterType === 'color_filter') {
        return 'Colour';
      } else return filterType;
    },
    getBrowserWidth () {
      return (this.browserWidth = window.innerWidth);
    },
    async startSearch () {
      console.log(this.search, 'search');
      if (this.search?.length >= 3) {
        this.makeSearch();
      }
    },
    openSvgViewer () {
      this.openModal({
        name: ModalList.OmVehicleViewerModal,
        payload: {
          nationalCode: this.activeVehicle.National_Code,
          visualGroup: '14'
        }
      });
    },
    getSvgImageData (product) {
      if (product.image_list && product.image_list.length) {
        const imageAry = product.image_list[0].split('_');

        return {
          id: imageAry[0],
          code: imageAry[1]
        };
      }

      return {
        id: null,
        code: null
      };
    },
    async onBottomScroll () {
      if (!this.isLazyLoadingEnabled || this.loadingProducts) {
        return;
      }

      this.loadingProducts = true;
      await this.$store.dispatch('category-next/loadMoreCategoryProducts');
      this.loadingProducts = false;
    },
    async changePage (page = this.currentPage) {
      this.loading = true;
      const start = (page - 1) * THEME_PAGE_SIZE;

      if (
        start < 0 ||
        start >= this.getCategoryProductsTotal ||
        this.getCategoryProductsTotal < THEME_PAGE_SIZE
      ) {
        return;
      }

      const { includeFields, excludeFields } = config.entities.productList;
      const { filters } = this.getCurrentSearchQuery;
      if (
        this.getCurrentCategory?.page_layout &&
        this.getCurrentCategory?.page_layout === 'category-full-width'
      ) {
        // Nothing to do
      } else {
        if (this?.activeVehicle && Object.keys(this.activeVehicle).length) {
          let national_code = [];
          national_code.push({
            attribute_code: 'national_code.keyword',
            id: this.activeVehicle.National_Code,
            label: this.activeVehicle.National_Code,
            type: 'national_code.keyword'
          });
          filters['national_code.keyword'] = national_code;
        }
      }

      const filterQuery = prepareQuickSearchQuery(this.$route.query?.search);

      const searchResult = await quickSearchByQuery({
        query: filterQuery,
        sort: this.sortOrder,
        start: start,
        size: THEME_PAGE_SIZE,
        includeFields: includeFields,
        excludeFields: excludeFields
      });

      this.getMoreCategoryProducts = await this.$store.dispatch(
        'category-next/processCategoryProducts',
        {
          products: searchResult.items,
          filters: filters
        }
      );

      createSmoothscroll(
        document.documentElement.scrollTop || document.body.scrollTop,
        0
      );
      this.currentPage = page;
      this.loading = false;
    },
    initPagination () {
      this.currentPage = 1;
    },
    changeSortOder (sortOrder) {
      if (this.getCurrentSearchQuery.sort !== sortOrder) {
        this.$store.dispatch('category-next/switchSearchFilters', [
          { id: sortOrder, type: 'sort' }
        ]);
      }
    },
    changeFilter (filter) {
      this.$store.dispatch('category-next/switchSearchFilters', [filter]);
    },
    clearAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters');
    },
    getFilterCount (filter) {
      const aggregations = [
        `agg_range_${filter.type}`,
        `agg_terms_${filter.type}`,
        `agg_terms_${filter.type}_options`
      ];

      return aggregations.reduce((result, aggregation) => {
        const bucket =
          this.aggregations &&
          this.aggregations[aggregation] &&
          this.aggregations[aggregation].buckets.find(
            bucket => String(bucket.key) === String(filter.id)
          );

        return bucket ? result + bucket.doc_count : result;
      }, 0);
    },
   isJpgRender (product) {
      if (product.image_list[0] == null) return true;
    },
    getImageId (imageCode) {
      if (imageCode) {
        const imageCodeAry = imageCode.split('_');
        return imageCodeAry[0];
      } else {
        return null;
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    const {
      meta_title,
      meta_description,
      name,
      slug
    } = this.getCurrentCategory;
    const meta = meta_description
      ? [
        {
          vmid: 'description',
          name: 'description',
          content: htmlDecode(meta_description)
        }
      ]
      : [];

    return {
      title: htmlDecode(meta_title || name),
      meta
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.search-btn {
    background-color: #5c5c5c;
    border-bottom: 1px solid #333;
    border: none;
    border-radius: 4px;
    height: 40px;
    margin: 4px 10px;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

#category {
  box-sizing: border-box;
  background: #f3f4f4;
  @include for-desktop {
    max-width: 100%;
  }
}
.o-search-bar {
  display: flex;
  padding-top: 15px;
  margin-bottom: 15px;
}
.main {
  margin: auto !important;
}
.breadcrumbs {
  padding: 10px 0 20px 0;
  margin: 0 40px;
}
.navbar {
  position: relative;
  display: flex;
  border: 0;
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    margin-bottom: 15px;
  }
  &__aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 300px;
    padding: var(--spacer-sm) var(--spacer-sm);
    border-width: 0 1px 0 0;
    background: #fff;
    box-shadow: 1px 2px 6px 0px #bbbbbb;
    .vehicle-cart-card {
      border-radius: 0;
      margin-bottom: 20px;
    }
    .vehicle-change-button {
      width: 100%;
      height: 40px;
      border-radius: 0;
    }
  }
  &__main {
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex: 1;
    @include for-desktop {
    }
  }
  &__filters-button {
    display: flex;
    align-items: center;
    font-size: 1rem;
    grid-column: 1;
    justify-self: start;
    &:hover {
      .sf-icon {
        fill: var(--c-primary);
      }
    }
    @include for-mobile {
      --button-text-transform: uppercase;
      font-size: var(--font-xs);
      &.sort-by__button {
        order: 1;
      }
    }
  }
  &__filter {
    display: flex;
  }
  &__filters-icon {
    margin: 0;
  }
  &__label {
    font-family: var(--font-family-bold);
    font-weight: 700;
    color: var(--c-text-muted);
    margin: 0 var(--spacer-2xs) 0 0;
    @include for-mobile {
      display: none;
    }
  }
  &__select {
    padding: 10px 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    --select-padding: 0 var(--spacer-lg) 0 var(--spacer-2xs);
    --select-margin: 0;
    --select-selected-padding: 0 var(--spacer-xl) 0 0;
  }
  &__sort {
    display: flex;
    align-items: center;
    justify-self: end;
    grid-area: sort;
    @include for-desktop {
      justify-self: center;
    }
  }
  &__counter {
    font-family: var(--font-family-secondary);
    grid-column: 3;
    justify-self: end;
    grid-area: counter;
  }
  &__view {
    display: flex;
    align-items: center;
    margin: 0 var(--spacer-xl);
    @include for-desktop {
      margin: 0 0 0 var(--spacer-2xl);
    }
    &-icon {
      cursor: pointer;
    }
    &-label {
      margin: 0 var(--spacer-sm) 0 0;
      font: var(--font-medium) var(--font-xs) / 1.6 var(--font-family-secondary);
      text-decoration: underline;
    }
  }
}
.sort-by {
  --select-dropdown-z-index: 2;
  flex: unset;
  padding: 0;
  ::v-deep {
    .sf-select__dropdown {
      min-width: max-content;
    }
    .sf-select-option {
      cursor: pointer;
    }
  }
  // This is needed to hide SfSelect main element on mobile view.
  // This code can be removed when SfSelect supports better customization.
  @include for-mobile {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    --select-dropdown-z-index: 2;
    ::v-deep .sf-select__cancel {
      margin: 16px;
      box-shadow: 4px 12px 24px rgba(119, 121, 122, 0.25);
      --button-width: calc(100% - 32px);
    }
  }
}
.products__grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0;
  gap: 30px;
  padding-bottom: 20px;
  @media (min-width: 700px) and (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
  }
@media (min-width: 1px) and (max-width: 699px) {
    grid-template-columns: 1fr;
    margin: 0;
    gap: 10px;
  }
}
.main {
  display: flex;
  gap: 30px;
}
.sidebar {
  flex: 0 0 25% !important;
  padding: 30px 0 !important;
}
.sidebar-filters {
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
}
.list {
  --menu-item-font-size: var(--font-sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__grid {
    justify-content: space-between;
  }
  &__product-card {
    --product-card-max-width: 100%;
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  @include for-desktop {
    margin: 0;
    background: #f2f2f2;
    &__pagination {
      display: flex;
      justify-content: center;
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      --product-card-max-width: 100%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
}
::v-deep .sf-accordion-item__header {
  padding: 15px 10px;
  background: #ddd;
  font-weight: 700;
}
.filters {
  margin: 15px 0;
  &__title {
    --heading-title-font-size: var(--font-xl);
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
    width: 100%;
    /* &:first-child {
      margin: calc(var(--spacer-xl) + var(--spacer-base)) 0 var(--spacer-xs) 0;
    } */
  }
  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
    border: 1px solid var(--c-light);
  }
  &__item {
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    border: none !important;
    padding: 10px;
    width: auto;
    &:last-child {
      border-bottom: 0;
    }
    @include for-desktop {
      --checkbox-padding: 0;
      margin: 10px 0;
      padding: 10px;
    }
  }
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
}
::v-deep .om-vehicle-cart-card {
  padding: 25px 30px;
  .sf-call-to-action.header {
    padding: 0;
  }
  .title {
    font-size: 16px;
    margin: 0;
    padding-right: var(--spacer-sm);
  }
  .products__product-card {
    --product-card-max-width: 30%;
  }
}
::v-deep .sidebar {
  flex: 0 0 23%;
  --_image-width: 100;
  --_image-height: 200;
}

.products {
  ::v-deep .sf-image {
    --_image-width: 600 !important;
    --_image-height: 600 !important;
    img {
      position: absolute !important;
      top: 50%;
      left: 50%;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
    }
    &:after {
      display: block;
      content: "";
      padding-bottom: calc(var(--_image-height) / var(--_image-width) * 100%);
    }
  }
  ::v-deep .sf-product-card__image-wrapper {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    a {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  ::v-deep .products__product-card {
    --product-card-max-width: 100%;
    margin: 0;
    border-radius: 8px;
    display: grid;
    height: 100%;
    padding: 0 !important;
    box-shadow: #d6d5d5 0px 1px 3px 0px;
    overflow: hidden;
  }
  ::v-deep .sf-product-card {
    &__title {
      --product-card-title-margin: 2px;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
      @include for-mobile {
        font-size: 16px !important;
      }
    }
  }
}
.category-title {
  .sf-heading__title {
    font-size: 32px;
    font-weight: 700;
  }
}
.category-description {
  max-width: 800px;
  text-align: center;
  margin: auto;
}
@include for-desktop {
  .navbar__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sidebar {
    padding: 0 !important;
    border: none;
    .sidebar-wrapper {
      padding: var(--spacer-sm);
      margin-top: 30px;
      box-shadow: 1px 2px 6px 0px #bbbbbb;
    }
  }
}
::v-deep .sf-checkbox__checkmark {
  border-radius: 4px;
}
::v-deep .sf-accordion-item__content {
  padding: 0;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none;
  width: 100%;
  background: #fff;
}
::v-deep .sf-accordion-item__content.tyres {
  z-index: 1;
  width: 100%;
}
.sf-accordion-item {
    position: relative;
    margin: 20px 0;
    box-shadow: rgb(214,213,213) 0px 1px 3px 0px;
    border-radius: 8px;
    overflow: hidden;
  }
::v-deep .sf-product-card-horizontal {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
::v-deep .sf-product-card__brand {
  height: 60px;
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  .brand-logo {
    max-height: 30px;
  }
}
::v-deep .action-area__wrap {
  background: #000;
  padding: 15px;
  display: grid;
}
::v-deep .action-area__wrap--price {
  padding: 0 10px;
}
::v-deep .action-area__wrap--addtocart {
  display: flex;
  gap: 10px;
}
::v-deep .product-card__action-area {
  flex: 1;
}
::v-deep .action-area__wrap--message1 {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
    color: #fff;
    font-size: 12px;
    margin: 5px 0;
  }
}

::v-deep .action-area__wrap--message2 {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
    color: #fff;
    font-size: 12px;
    margin: 5px 0;
  }
}
::v-deep .action-area__wrap--promobanner {
  height: 25px;
  width: 100%;
  background: grey;
  color: #fff;
  font-size: 12px;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
::v-deep .stock-status{
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  .stock-pill {
    background: green;
    padding: 5px 10px;
    border-radius: 25px;
    font-size: 11px;
    color: #fff;
    margin-right: 0;
  }
}
::v-deep .action-area__wrap--stock {
  height: 45px;
  padding: 0 5px;
  width: 100%;
  background: #000;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  .stock-pill {
    background: green;
    padding: 5px 10px;
    border-radius: 25px;
    font-size: 11px;
    color: #fff;
    margin-right: 15px;
  }
}
::v-deep .sf-product-card__price {
justify-content: center;
gap: 15px;
}
.filter-btn{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
</style>
