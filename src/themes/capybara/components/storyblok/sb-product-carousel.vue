<template>
  <div class="sb-products-carousel">
    <div class="carousel-container" style="position: relative;">
      <h2 class="sb-products-carousel__title">
        {{ title }}
      </h2>
      <swiper
        v-if="!loading"
        ref="carousel"
        :options="swiperOptions"
        class="carousel"
        @slideChange="slideChange"
      >
        <swiper-slide v-for="(product, key) in products" :key="key">
          <div class="slide">
            <lazy-hydrate :trigger-hydration="!loading">
              <transition-group
                appear
                name="products__slide"
                tag="div"
                class="products__grid"
              >
            <SfProductCard
              :key="key"
              :title="product.title"
              :image="product.articlemainimage"
              :regular-price="product.price.regular"
              :special-price="product.price.special"
              :link="product.link"
              link-tag="router-link"
              :wishlist-icon="false"
              class="products__product-card"
            >
              <template v-if="!product.price.regular && !product.price.special" #price>
                <p style="color: #333;">
                  Currently Unavailable
                </p>
              </template>
              <template v-if="product.price.special" #badge>
                <p class="offer-badge">
                  Offer
                </p>
              </template>
            </SfProductCard>
              </transition-group>
            </lazy-hydrate>
          </div>
        </swiper-slide>
      </swiper>
      <div v-if="!loading" class="swiper-pagination--product-carousel" slot="pagination" />
      <div v-if="!loading" class="swiper-button-prev--product-carousel" slot="button-prev">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.777 12.02l7.071-7.071 1.414 1.414-7.07 7.071z" /><path d="M7.737 11.98l1.415-1.414 7.07 7.071-1.414 1.414z" /></svg>
      </div>
      <div v-if="!loading" class="swiper-button-next--product-carousel" slot="button-next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.737 17.637l7.07-7.071 1.415 1.414-7.071 7.07z" /><path d="M7.777 6.363L9.19 4.95l7.071 7.071-1.414 1.414z" /></svg>
      </div>
      <div v-if="loading" class="loader">
        Loading...
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfCallToAction, SfButton, SfImage, SfChevron, SfProductCard } from '@storefront-ui/vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import * as VehicleStorage from 'theme/store/vehicles-storage.ts';
import LazyHydrate from 'vue-lazy-hydration';
import { prepareCategoryProduct } from 'theme/helpers';

export default {
  name: 'SbPopularProductsCarousel',
  components: {
    SfCallToAction,
    SfButton,
    SfImage,
    SwiperSlide,
    SfChevron,
    SfProductCard,
    LazyHydrate
  },
  props: {
    content: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters('vehicles', [
      'storyblok',
      'storyblokContent'
    ]),
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct'
    }),
    swiper () {
      return this.$refs.carousel ? this.$refs.carousel.$swiper : '';
    },
    title () {
      return this.content ? 'Popular products' : 'Recently visited products';
    }
    // showPagination () {
    //   return this.$refs.carousel && this.$refs.carousel.$swiper.snapGrid.length > 1;
    // }
  },
  data () {
    return {
      isVisible: false,
      products: [],
      swiperOptions: {
        slidesPerView: 4,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination--product-carousel',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next--product-carousel',
          prevEl: '.swiper-button-prev--product-carousel'
        },
        breakpoints: {
          1401: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1.1,
            spaceBetween: 10
          }
        }
      },
      loading: false
    };
  },
  methods: {
    slideChange () {
      // console.log('slide change');
    },
    findMore () {
      console.log('find more');
    },
    async getRecentViewedProduct () {
      let productSkus = [];
      if (this.content) {
        productSkus = this.content.products;
      } else {
        productSkus = await VehicleStorage.getRecentViewed();
      }
      let products = [];
      this.loading = true;
      
      productSkus = productSkus.filter(sku => this.getCurrentProduct.sku !== sku);
      
      let relatedProductsQuery = prepareRelatedQuery('sku', productSkus);

      const response = await this.$store.dispatch('product/findProducts', {
        query: relatedProductsQuery,
        prefetchGroupProducts: false,
        updateState: false
      });
      if (response) {
        products = [...products, ...response.items]
      }

      this.loading = false;
      this.products = products.map(prepareCategoryProduct);
    }
  },
  async mounted () {
    this.getRecentViewedProduct();
  },
  watch: {
    getCurrentProduct: { 
      async handler (value) {
      this.getRecentViewedProduct();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.carousel-container{
  margin: var(--spacer-2xl) auto;
  padding: 0 40px;
  max-width: 1680px;
  margin: 80px auto 0 auto;
  width: 86%;
  position: relative;
  @include for-mobile {
    padding: 0 20px;
  }
}
.swiper-button-next, .swiper-button-prev{
    z-index: 1;
  @include for-mobile{
    top: 42%;
  }
}
.sb-products-carousel {
  --chevron-color: white;
  position: relative;
  min-height: 400px;
  background: #f4f4f4;

  &__title {
    padding: 0 0 40px 0;
    font-size: 30px;
    margin: 0;
    @include for-mobile {
     padding: 25px 0;
    }
  }

  .loader {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sf-product-card {
    height: 485px;

    &__image-wrapper {
     padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    a{
    width: 100%;
    height: 100%;
    }
    }
   .sf-image {
    --_image-width: 600 !important;
    --_image-height: 600 !important;
    img {
    position: absolute !important;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(0, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    }
  &:after{
    display: block;
    content: "";
    padding-bottom: calc(var(--_image-height) / var(--_image-width) * 100%);
  }
  }
.sf-product-card__title{
    font-family: var(--font-family-primary);
    font-size: 18px;
    color: #767676;
    margin: 10px 0 0 0;
  }
.sf-price__regular{
    font-family: var(--font-family-primary);
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }
  }

  .carousel {
    .slide {
      display: flex;
      justify-content: center;

      &-image {
        width: 100%;
      }

      &-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        .car-explorer {
          &__desktop {
            width: 374px;
            margin-left: 100px;
            background: white;
            color: black;
            padding: var(--spacer-base);

            .title {
              margin: 0;
              word-break: break-word;
              margin-bottom: var(--spacer-sm);
            }

            .description {
              font-weight: 500;
              word-break: break-word;
              margin-bottom: var(--spacer-lg);
            }
          }
        }
      }

      .car-explorer__mobile {
        margin-top: -5px;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;

        .title {
          margin: 0;
          word-break: break-word;
          margin-bottom: var(--spacer-sm);
        }

        .description {
          font-weight: 500;
          word-break: break-word;
          margin-bottom: var(--spacer-lg);
        }
      }

      .products__grid {
        width: 100%;
        padding: 0 2px 20px 2px;
        .sf-product-card {
          width: 100%;
          --product-card-max-width: 100%;
          margin: 0;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
      }
    }
  }
  .swiper-button-disabled {
    visibility: hidden;
  }
  .swiper-pagination--product-carousel{
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-bottom: 30px;
    .swiper-pagination-bullet{
      height: 10px;
      width: 10px;
      margin: 0 4px;
    }
    .swiper-pagination-bullet-active{
      background: var(--c-primary);
    }
  }
   .swiper-button-next--product-carousel {
   right: 10px  !important;
   position: absolute;
   z-index: 1;
   cursor: pointer;
   top: 50%;
   transform: translateY(-50%);
    width: 38px;
    height: 38px;
    background: #fff;
    -webkit-box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    border-radius: 50%;
    border: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    @include for-desktop{
      height: 48px;
      width: 48px;
    }
        @include for-mobile{
      display: none;
    }
    svg{
      fill: var(--c-primary);
      height: 20px;
      width: 20px;
    }
    &:hover{
      background: #e8e8e8;
      border: 1px solid #bbb;
    }
  }
 .swiper-button-prev--product-carousel {
   left: 10px  !important;
   position: absolute;
   z-index: 1;
   cursor: pointer;
   top: 50%;
   transform: translateY(-50%);
    width: 38px;
    height: 38px;
    background: #fff;
    -webkit-box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    border-radius: 50%;
    border: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    @include for-desktop{
      height: 48px;
      width: 48px;
    }
    @include for-mobile{
      display: none;
    }
    svg{
      fill: var(--c-primary);
      height: 20px;
      width: 20px;
    }
    &:hover{
      background: #e8e8e8;
      border: 1px solid #bbb;
    }
  }
}
</style>
