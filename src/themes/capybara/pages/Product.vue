<template>
<div>
  <div id="product" itemscope itemtype="http://schema.org/Product">
  <div class="product-container">
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link" class="sf-breadcrumbs__breadcrumb">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <OProductDetails
      :product="getCurrentProduct"
      :product-gallery="getProductGallery"
      :product-configuration="getCurrentProductConfiguration"
      :product-custom-options="getCurrentCustomOptions"
      :product-attributes="getCustomAttributes"
      :product-stock="stock"
    />
  </div>
  </div>
  <SbTeaseV2/>
</div>
</template>

<script>
import SbTeaseV2 from "theme/components/storyblok/sb-teaser-v2.vue";
import { mapGetters, mapState } from 'vuex';
import {
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { ReviewModule } from '@vue-storefront/core/modules/review';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import OProductDetails from 'theme/components/organisms/o-product-details';
import { checkWebpSupport } from 'theme/helpers'
import { SfBreadcrumbs } from '@storefront-ui/vue';
import { filterChangedProduct } from '@vue-storefront/core/modules/catalog/events'
import * as VehicleStorage from 'theme/store/vehicles-storage.ts';

export default {
  name: 'Product',
  components: {
    OProductDetails,
    SfBreadcrumbs,
    SbTeaseV2
  },
  provide () {
    return {
      configurableOptionCallback: this.configurableOptionCallback
    }
  },
  data () {
    return {
      stock: {
        isLoading: false,
        max: 0,
        manageQuantity: true
      }
    };
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      promotedOffers: 'promoted/getPromotedOffers',
      dummyInstagramImages: 'instagram/getInstagramImages',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
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
    isOnline () {
      return onlineHelper.isOnline;
    },
    getCustomAttributes () {
      return Object.values(this.attributesByCode)
        .filter(a => {
          return (
            a.is_visible &&
            a.is_user_defined &&
            (parseInt(a.is_visible_on_front) ||
              a.is_visible_on_front === true) &&
            this.getCurrentProduct[a.attribute_code]
          );
        })
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id;
        });
    },
    banners () {
      return checkWebpSupport(this.promotedOffers.productBanners, this.isWebpSupported)
    },
    instagramImages () {
      return checkWebpSupport(this.dummyInstagramImages, this.isWebpSupported)
    }
  },
  watch: {
    isOnline: {
      handler (isOnline) {
        if (isOnline) {
          this.getQuantity();
        }
      }
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );
    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  beforeCreate () {
    registerModule(ReviewModule);
  },
  async mounted () {
    await VehicleStorage.setRecentViewed(this.getOriginalProduct.sku)
    await Promise.all([
      this.$store.dispatch('review/list', { productId: this.getOriginalProduct.id }),
      this.$store.dispatch('instagram/updateInstagramImages')
    ])
  },
  beforeRouteEnter (to, from, next) {
    if (isServer) {
      next();
    } else {
      next(vm => {
        vm.getQuantity();
      });
    }
  },
  methods: {
    async configurableOptionCallback (variant) {
      const selectedConfiguration = Object.assign({ attribute_code: variant.type }, variant)
      await filterChangedProduct(selectedConfiguration, this.$store, this.$router)
      this.getQuantity();
    },
    async getQuantity () {
      if (this.stock.isLoading) return; // stock info is already loading
      this.stock.isLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });
        this.stock.manageQuantity = res.isManageStock;
        this.stock.max = res.qty || res.isManageStock ? res.qty : null;
      } finally {
        this.stock.isLoading = false;
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    return {
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      meta: this.getCurrentProduct.meta_description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(this.getCurrentProduct.meta_description)
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#product {
  box-sizing: border-box;
  padding: 0;
  background: #f5f5f5;
  .product-container{
  @include for-desktop {
    max-width: 1255px;
    padding: 0 20px 25px 20px;
    margin: auto;
    position: relative;
  }
  @include for-mobile {
     margin: auto;
     padding: 0 15px;
  }
  }
}
.product__bottom {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    padding: 0;
    max-width: 1272px;
  }
}

.breadcrumbs {
  padding: 30px 0;
}

::v-deep {
  .product__colors button {
    border: 1px solid var(--c-light);
  }
  .sf-image, img {
    border-radius: 0;
  }
}

.banner {
  margin: var(--spacer-xl) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
</style>
