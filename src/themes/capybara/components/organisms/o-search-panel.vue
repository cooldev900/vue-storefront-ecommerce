<template>
  <div class="o-search-panel">
    <SfButton class="sf-button--pure close-button" @click="$store.commit('ui/setSearchpanel', false)">
      <SfIcon
        icon="cross"
        size="xxs"
      />
    </SfButton>
    <div class="o-search">
      <!-- <SfSearchBar
        v-model="search"
        :placeholder="$t('Search')"
        class="sf-header__search"
        ref="searchInput"
        @input="startSearch"
        @click.native="goToSearch"
      /> -->
      <autocomplete
        ref="searchInput"        
        :search="getSearchResult"
        :placeholder="$t('Search')"
        class="sf-header__search"
        aria-label="Search Wikipedia"
        :get-result-value="getResultValue"
        @submit="submit"
        @click.native="goToSearch"
    ></autocomplete>
    </div>
    <div
      v-if="noResultsMessage"
      class="no-results"
    >
      {{ $t(noResultsMessage) }}
    </div>
    <div v-else class="grid-container">
      <div class="products">
        <!-- <SfHeading :level="3" :title="$t('Product suggestions')" class="products__title sf-heading--left" /> -->
        <div class="products__listing">
          <SfProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            :title="product.title"
            :image="product.image"
            :regular-price="product.price.regular"
            :special-price="product.price.special"
            :link="product.link"
            link-tag="router-link"
            :wishlist-icon="false"
            class="products__product-card"
            @click.native="$store.commit('ui/setSearchpanel', false)"
          >
            <template v-if="!isJpgRender(product)" #image>
              <SvgViewer
                :width="150"
                :height="150"
                :image-id="getImageId(product.main_image)"
                :image-code="product.main_image"
                :dom-id="product.id"
              />
            </template>
          </SfProductCard>
        </div>
        <SfButton
          v-if="OnlineOnly && readMore && visibleProducts.length >= pageSize"
          class="sf-button--full-width load-more"
          type="button"
          @click="$emit('see-more')"
        >
          {{ $t("Load more") }}
        </SfButton>
      </div>
      <div class="searchResult">
        <ul>
          <li v-for="(value, key) in searchResult" :key="key">{{value}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { prepareCategoryProduct } from 'theme/helpers';
import VueOfflineMixin from 'vue-offline/mixin';
import { SfHeading, SfButton, SfList, SfSearchBar, SfMenuItem, SfProductCard, SfIcon } from '@storefront-ui/vue';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore'
import config from 'config';
import axios from 'axios';
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

export default {
  name: 'OSearchPanel',
  components: {
    SfButton,
    SfList,
    SfMenuItem,
    SfProductCard,
    SfHeading,
    SfSearchBar,
    SfIcon,
    SvgViewer,
    Autocomplete
  },
  mixins: [VueOfflineMixin, SearchPanelMixin],
  data () {
    return {
      selectedCategoryIds: []
    };
  },
  props: {
    pageSize: {
      type: Number,
      required: true,
      default: 16
    }
  },
  computed: {
    visibleProducts () {
      const productList = this.selectedCategoryIds.length
        ? this.products.filter(product => product.category_ids.some(categoryId => this.selectedCategoryIds.includes(categoryId)))
        : this.products;

      return productList.map(product => prepareCategoryProduct(product));
    },
    categories () {
      const distinctCategories = this.products
        .filter(product => product.category)
        .map(product => product.category)
        .flat()
        .reduce((result, category) => {
          result[category.category_id] = category;
          return result;
        }, {});

      return Object.values(distinctCategories);
    },
    noResultsMessage () {
      return this.search.length < 3
        ? 'Searched term should consist of at least 3 characters.'
        : !this.visibleProducts.length
          ? 'No results were found.'
          : '';
    }
  },
  methods: {
    getResultValue(result) {
      return result.text + " / " + result.field; 
    },
    async getSearchResult(input) {
      this.search = input;
      this.startSearch();
      if (input.length >= 3) {
        try {
          const {
                data: {
                  result
                }
              } = await axios.post(`${config.api.url}/api/search/es-search`, {
                query: input
              });
          
          return result.filter((data, index, self) => index === self.findIndex( d => d?.text === data?.text && d?.field === data?.field));
        } catch(e) {
          return [];
        }
      } else {
        return []
      }
    },
    isCategorySelected (category) {
      return this.selectedCategoryIds.includes(category.category_id);
    },
    toggleCategory (category) {
      if (this.isCategorySelected(category)) {
        this.selectedCategoryIds = this.selectedCategoryIds.filter(categoryId => categoryId !== category.category_id);
      } else {
        this.selectedCategoryIds.push(category.category_id);
      }
    },
    startSearch () {
      if (this.search.length >= 3) {
        this.makeSearch();
      }
    },
    submit(result) {
      console.log(result, 'result');
      this.$router.push(localizedRoute('/search?search='+(result ? `&field=${result.field}&value=${result.text}`: this.search)));
      this.$store.commit('ui/setSearchpanel', false)
    },
    goToSearch(e) {
      this.search = e.target.value;
    },
    focusInput () {
      console.log(this.$refs.searchInput.$el.children[0].children[0], 'searchInput');
      this.$refs.searchInput.$el.children[0].children[0].focus();
    },
    isJpgRender (product) {
      if (product.main_image) return false
      else return true;
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
  watch: {
    categories () {
      this.selectedCategoryIds = [];
    }
  },
  mounted () {
    disableBodyScroll(this.$el);
    this.focusInput();
  },
  destroyed () {
    clearAllBodyScrollLocks()
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-search-panel {
  position: fixed;
  left: 0;
  right: 0;
  padding-top: 40px;
  top: var(--_header-height);
  background: var(--c-light);
  overflow: auto;
  max-height: calc(66vh - var(--_header-height));

  @include for-mobile {
    max-height: calc(100vh - var(--_header-height));
  }

  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    background: #fff;
    padding: 10px;
  }

  .container {
    display: flex;
    padding: 0 var(--spacer-sm);
    max-width: 1272px;
    margin: auto;
    @include for-desktop {
      border-top: 1px solid var(--c-light);
    }
    @include for-mobile {
      flex-direction: column;
      padding: 0 var(--spacer-xl);
    }
  }

  .categories {
    @include for-desktop {
      flex: 0 0 20%;
      padding-right: 3rem;
      border-right: 1px solid var(--c-light);
    }

    &__title {
      padding: 0;
      margin-top: var(--spacer-base);
      justify-content: start;
    }
    &__listing {
      @include for-desktop {
        margin-top: 2rem;
      }

      .sf-list__item {
        padding: 0.3rem 0;
      }
      .sf-menu-item.selected {
        --menu-item-font-weight: 500;
        text-decoration: underline;
      }
    }
  }

  .products {
    width: 100%;
    &__title {
      padding: 0;
      justify-content: start;
      margin-top: var(--spacer-base);
    }
    &__listing {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 10px;
      padding-bottom: 50px;
      @include for-mobile{
        grid-template-columns: 1fr 1fr;
      }
    }
    &__product-card {
      min-width: calc(var(--product-card-max-width) * 0.8);
      max-width: auto;
    }
  }

  .no-results {
    height: 5rem;
    line-height: 5rem;
    display: flex;
    justify-content: center;
  }

  .load-more {
    margin: var(--spacer-xl) 0;
  }

}

.o-search {
  --search-bar-border-width: 0;
  background-color: var(--c-light);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  .sf-search-bar {
    width: initial;
    height: initial;
  }
}
::v-deep .sf-search-bar__icon {
    --icon-size: 1.25rem;
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    bottom: 0;
    right: 10px;
}
::v-deep .sf-search-bar__input[type="search"] {
  text-transform: none;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  background: #fff;
  padding-left: 20px;
  
  &:focus {
    outline: none;
    border-width: 0 0 1px 0;
    border-color: #b1b1b1;
    transition: border-width 1s linear;
    font-size: 14px;
    text-transform: none;
  }

  .grid-container {
    display: flex;
  }
}
</style>
