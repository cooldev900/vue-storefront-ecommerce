<template>
  <div>
    <div id="category">
      <OmCategoryHeader
        v-if="!!getCurrentCategory"
        :title="getCategoryTitle"
        :products="getCurrentCategory.children_data"
        :description="getCurrentCategory.description"
        :parent-id="getCurrentCategory.parent_id"
      />
      <div class="navbar section grid-container">
        <div class="navbar__main">
          <div class="navbar__filter mobile-only">
            <SfButton
              class="sf-button--text navbar__filters-button"
              @click="isFilterSidebarOpen = true"
            >
              <SfIcon
                size="18px"
                class="navbar__filters-icon"
                color="#BEBFC4"
                icon="filter"
              />
              {{ $t("Filters") }}
            </SfButton>
            <template v-if="activeFiltersCount">
              ({{ activeFiltersCount }})
              <span> &nbsp;&mdash;&nbsp;</span>
              <button
                @click="clearAllFilters"
                class="sf-button sf-button--text navbar__filters-clear-all"
              >
                {{ $t("Clear all") }}
              </button>
            </template>
          </div>
          <div class="navbar__counter">
            <span class="navbar__label desktop-only">
              {{ $t("Products found") }}:
            </span>
            <strong class="desktop-only">{{ productTotalCount }}</strong>
            <span class="navbar__label mobile-only">
              {{ $t("{count} items", { count: productTotalCount }) }}
            </span>
          </div>
          <div class="navbar__sort">
            <span class="navbar__label desktop-only">{{ $t("Sort By") }}:</span>
            <!-- <SfSelect
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
              </SfSelect> -->
            <select
              class="navbar__select select-mobile"
              ref="SortBy"
              @change="changeSortOder"
              :value="sortOrder"
            >
              <option
                v-for="option in sortOptions"
                :value="option.id"
                :key="option.id"
              >
                {{ option.label }}
              </option>
            </select>
            <!-- <SfButton
                class="
                  sf-button--text
                  navbar__filters-button
                  sort-by__button
                  mobile-only
                "
                @click="$refs.SortBy.toggle()"
              >
                {{ $t("Sort By") }}
                <ASortIcon />
              </SfButton> -->
          </div>
        </div>
      </div>
      <div class="main grid-container">
        <div class="sidebar desktop-only">
          <div>
            <omTyreFinder v-if="shouldShowVehicleCard" />
          </div>
          <div class="filters">
            <lazy-hydrate :trigger-hydration="!loading">
              <SfAccordion
                class="tyre-filters"
                open="all"
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
          <div v-if="loading">
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
            v-if="isCategoryEmpty && !loading"
            :title="$t('No products found!')"
            :subtitle="
              $t(
                'Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!'
              )
            "
          />
          <template v-if="!isCategoryEmpty && !loading">
            <!-- <lazy-hydrate :trigger-hydration="!loading"> -->

            <transition-group
              appear
              name="products__slide"
              tag="div"
              class="products__grid"
            >
              <OmProductCard
                v-for="product in currentPageProducts"
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
              class="products__pagination desktop-only"
              :current="currentPage"
              :total="totalPages"
              :visible="3"
            />
          </template>
        </div>
      </div>
      <SfSidebar
        :visible="isFilterSidebarOpen"
        :title="$t('Filters')"
        class="sidebar-filters"
        @close="isFilterSidebarOpen = false"
      >
        <div v-if="shouldShowVehicleCard">
          <OmVehicleCartCard :vehicle="activeVehicle" :active="true" />
        </div>
        <div class="filters">
          <lazy-hydrate :trigger-hydration="!loading">
            <SfAccordion
              :first-open="true"
              open="all"
              :multiple="true"
              transition=""
              show-chevron
            >
              <template v-for="(filters, filterType) in availableFilters">
                <SfAccordionItem :key="filterType" :header="title(filterType)">
                  <template v-if="filterType === 'colour_filter'">
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
        <template #content-bottom>
          <div class="filters__buttons">
            <SfButton
              class="sf-button--full-width om-btn--primary"
              @click="isFilterSidebarOpen = false"
            >
              {{ $t("Done") }}
            </SfButton>
            <SfButton
              class="sf-button--full-width filters__button-clear om-btn--secondary"
              @click="clearAllFilters"
            >
              {{ $t("Clear all") }}
            </SfButton>
          </div>
        </template>
      </SfSidebar>
    </div>
    <SbTeaseV2 />
  </div>
</template>

<script>
import SbTeaseV2 from 'theme/components/storyblok/sb-teaser-v2.vue';
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
import omTyreFinder from 'theme/components/omni/om-vehicle/om-tyre-finder';
import OmCategoryHeader from 'theme/components/omni/om-category-header';
import OmProductCardLoader from 'theme/components/omni/skeletons/om-product-card-loader.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { ModalList } from 'theme/store/ui/modals';
import { createSmoothscroll } from 'theme/helpers';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import OmAppointmentSelector from 'theme/components/omni/om-appointment-selector.vue';
import OmProductCard from 'theme/components/omni/om-product-card.vue';
import buildQuery from '@vue-storefront/core/modules/catalog/helpers/associatedProducts/buildQuery.ts';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import { Logger } from '@vue-storefront/core/lib/logger';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { onlineHelper } from '@vue-storefront/core/helpers'
const THEME_PAGE_SIZE = 12;
const LAZY_LOADING_ACTIVATION_BREAKPOINT = 1024;

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params);
    const cachedCategory = store.getters['category-next/getCategoryFrom'](
      route.path
    );
    const currentCategory =
      cachedCategory && !forceLoad
        ? cachedCategory
        : await store.dispatch('category-next/loadCategory', { filters });
    await store.dispatch('category-next/loadCategoryProducts', {
      route,
      category: currentCategory,
      pageSize: THEME_PAGE_SIZE
    });
    const breadCrumbsLoader = store.dispatch(
      'category-next/loadCategoryBreadcrumbs',
      {
        category: currentCategory,
        currentRouteName: currentCategory.name,
        omitCurrent: true
      }
    );

    if (isServer) await breadCrumbsLoader;
    catalogHooksExecutors.categoryPageVisited(currentCategory);
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
    omTyreFinder,
    SvgViewer,
    SfSearchBar,
    OmCategoryHeader,
    OmProductCardLoader,
    SfImage,
    OmAppointmentSelector,
    OmProductCard,
    SbTeaseV2
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
      sortOrderValue: ''
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
      activeVehicle: 'vehicles/activeVehicle',
      qty: 'vehicles/getQty'
    }),
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
        .map((route) => ({
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
    categories () {
      return getTopLevelCategories(this.getCategories)
        .map((category) => {
          const viewAllMenuItem = {
            ...category,
            name: i18n.t('View all'),
            position: 0
          };

          const subCategories = category.children_data
            ? category.children_data
              .map((subCategory) =>
                prepareCategoryMenuItem(
                  this.getCategories.find(
                    (category) => category.id === subCategory.id
                  )
                )
              )
              .filter(Boolean)
            : [];

          return {
            ...prepareCategoryMenuItem(category),
            items: [prepareCategoryMenuItem(viewAllMenuItem)]
              .concat(subCategories)
              .sort((a, b) => a.position - b.position)
          };
        })
        .sort((a, b) => a.position - b.position);
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
      return Object.entries(config.products.sortByAttributes).map(
        (attribute) => {
          const [label, id] = attribute;
          return { id, label };
        }
      );
    },
    sortLabel () {
      const selectedSortOrder =
        this.sortOptions.find(
          (sortOption) => sortOption.id === this.sortOrder
        ) || {};
      return selectedSortOrder.label || '';
    },
    availableFilters () {
      const result = Object.entries(this.getAvailableFilters || {})
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
      Object.keys(this.getCurrentFilters).forEach((key) => {
        if (!key.includes('national_code')) {
          counter += this.getCurrentFilters[key].length;
        }
      });
      return counter;
    },
    isFilterActive () {
      return (filter) =>
        castArray(this.getCurrentFilters[filter.type]).find(
          (variant) => variant && variant.id === filter.id
        ) !== undefined;
    },
    getCategoryTitle () {
      return (
        this.breadcrumbs?.length &&
        this.breadcrumbs[this.breadcrumbs.length - 1].text
      );
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
    }
  },
  watch: {
    sortOrder () {
      if (this.currentPage > 1) {
        this.changePage();
      }
    },
    activeVehicle (value) {
      if (value?.national_code) this.$store.dispatch('category-next/switchSearchFilters', [
        { id: 'updated_at:desc', type: 'sort' }
      ]);
    },
    $route: {
      immediate: true,
      handler (to, from) {
        this.$store.commit('vehicles/toggleSetPrompt', false);
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
    if (isServer) next();
    // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async (vm) => {
        vm.loading = true;
        await composeInitialPageState(vm.$store, to, true);
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }); // await here is because we must wait for the hydration
        vm.loading = false;
      });
    } else {
      // Pure CSR, with no initial category state
      next(async (vm) => {
        vm.loading = true;
        vm.$store.dispatch('category-next/cacheProducts', { route: to });
        vm.loading = false;
      });
    }
  },
  mounted () {
    this.unsubscribeFromStoreAction = this.$store.subscribeAction((action) => {
      if (action.type === 'category-next/loadAvailableFiltersFrom') {
        this.aggregations = action.payload.aggregations;
      }
    });
    this.$bus.$on('product-after-list', this.initPagination);
    window.addEventListener('resize', this.getBrowserWidth);
    this.getBrowserWidth();
  },
  beforeDestroy () {
    this.unsubscribeFromStoreAction();
    this.$bus.$off('product-after-list', this.initPagination);
    window.removeEventListener('resize', this.getBrowserWidth);
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    async addToCart (product) {
      const res = await this.$store.dispatch('stock/check', {
        product: product,
        qty: product.qty
      });
      let manageQuantity = res.isManageStock;
      let max = res.qty || res.isManageStock ? res.qty : null;
      let isAvailable = !onlineHelper.isOnline || !!max || !manageQuantity || ['simple', 'configurable'].includes(
        this.product.type_id
      );
      if (!isAvailable) return;

      this.isAddingToCart = true;
      const query = buildQuery([product.sku]);
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
        productData.qty = this.qty;
        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, productData, { qty: this.qty })
        });

        const cartItems = await StorageManager.get('cart').getItem('current-cart');
        cartItems.forEach(item => {
          if (item.groupedParents) {
            item.groupedParents.map(p => {
              if (p.name === productData?.name && this.activeVehicle?.National_Code) {
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
              if (p.name === productData?.name && productData?.main_image) {
                item.main_image = productData?.main_image;
              }
            })
          } else {
            if (item.sku === productData?.sku && this.activeVehicle?.National_Code) {
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
            qty: this.qty,
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
      this.$store.dispatch('vehicles/saveQTY', 1);
      this.isAddingToCart = false;
    },
    title (filterType) {
      if (filterType === 'oe_brand_filter') {
        return 'Brand';
      } else if (filterType === 'price_filter') {
        return 'Price';
      } else if (filterType === 'vehicle_type_filter') {
        return 'Vehicle Type';
      } else if (filterType === 'battery_capacity_filter') {
        return 'Battery Capacity';
      } else if (filterType === 'litres_filter') {
        return 'Litres';
      } else if (filterType === 'grade_filter') {
        return 'Grade';
      } else if (filterType === 'oil_type_filter') {
        return 'Oil Type';
      } else if (filterType === 'color_filter') {
        return 'Colour';
      } else return filterType;
    },
    getBrowserWidth () {
      return (this.browserWidth = window.innerWidth);
    },
    async startSearch () {
      if (this.search.length >= 3) {
        await this.$store.dispatch('category-next/switchSearchFilters', [
          { id: 'search', value: this.search }
        ]);
      } else if (this.search.length === 0) {
        await this.$store.dispatch('category-next/switchSearchFilters', [
          { id: 'search', value: '' }
        ]);
      }
    },
    openSvgViewer () {
      this.openModal({
        name: ModalList.OmVehicleViewerModal,
        payload: {
          nationalCode: this.activeVehicle.national_code,
          visualGroup: '14'
        }
      });
    },
    getSvgImageData (product) {
      if (product.available_images && product.available_images.length) {
        const imageAry = product.available_images[0].split('_');

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
            id: this.activeVehicle.national_code,
            label: this.activeVehicle.national_code,
            type: 'national_code.keyword'
          });
          filters['national_code.keyword'] = national_code;
        }
      }

      const filterQuery = buildFilterProductsQuery(
        this.getCurrentCategory,
        filters
      );

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
    changeSortOder (event) {
      let sortOrder = event.target.value;
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
            (bucket) => String(bucket.key) === String(filter.id)
          );

        return bucket ? result + bucket.doc_count : result;
      }, 0);
    },
    isCategoryActive (category) {
      if (!this.getCurrentCategory.path) {
        return false;
      }

      // The 'View all' sub-category (always at position 0) should be marked as active only if it exactly matches current category path,
      // but all other sub-categories will be marked as active when current category path belongs to them.
      return category.position === 0
        ? this.getCurrentCategory.path === category.path
        : this.getCurrentCategory.path.startsWith(category.path);
    },
    isJpgRender (product) {
      if (product.main_image == null) return true;
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
    const { meta_title, meta_description, name, slug } =
      this.getCurrentCategory;
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
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
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
    display: grid;
    flex: 1;
    grid-template-columns: 1fr minmax(auto, max-content) 1fr;
    grid-template-areas: "filter counter sort";
    @include for-desktop {
      grid-template-areas: "filter sort counter";
      grid-column-gap: var(--spacer-2xl);
      grid-template-columns: max-content max-content auto;
      padding: var(--spacer-xs) var(--spacer-xl);
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
    grid-area: filter;
    margin-bottom: 1rem;
  }
  &__filters-icon {
    margin: 0 var(--spacer-sm) 0 0;
  }
  &__label {
    font-family: var(--font-family-secondary);
    font-weight: var(--font-normal);
    color: var(--c-text-muted);
    margin: 0 var(--spacer-2xs) 0 0;
    @include for-mobile {
      font-size: var(--font-xs);
    }
  }
  &__select {
    padding: 10px 5px;
    margin-left: 10px;
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
  margin: 0 0 0 30px;
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
  margin: 0;
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
      margin: var(--spacer-xl) 0 0 0;
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
  margin: 15px;
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
    padding-right: 0px !important;
    padding-left: 15px;
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
  overflow: scroll;
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

.select-mobile {
  @include for-mobile {
    margin-bottom: 16px;
  }
}
</style>
