<template>
  <div class="sb-slider">
    <h2 v-if="!loading && content">
      {{ content.title }}
    </h2>
    <swiper v-if="!loading" ref="carousel" :options="swiperOptions" class="carousel" @slideChange="slideChange">
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
                :image="product.image"
                :regular-price="product.price.regular"
                :special-price="product.price.special"
                :link="product.link"
                link-tag="router-link"
                :wishlist-icon="false"
                class="products__product-card"
              />
            </transition-group>
          </lazy-hydrate>
        </div>
      </swiper-slide>

      <div v-if="showPagination" class="swiper-pagination" slot="pagination" />
    </swiper>
    <div v-if="!loading && showPagination" class="swiper-button-next" slot="button-next">
      <span class="swiper-button-control">
        <span class="sf-circle-icon__icon sf-icon" aria-hidden="true">
          <svg class="sf-icon-path" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path
              d="M8.364 22L7 20.4l7.254-8.4L7 3.6 8.364 2 17 12z"
              fill="white"
            />
          </svg>
        </span>
      </span>
    </div>
    <div v-if="!loading && showPagination" class="swiper-button-prev" slot="button-prev">
      <span class="swiper-button-control">
        <span class="sf-circle-icon__icon sf-icon" aria-hidden="true">
          <svg class="sf-icon-path" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path
              d="M15.636 2L17 3.6 9.746 12 17 20.4 15.636 22 7 12z"
              fill="white"
            />
          </svg>
        </span>
      </span>
    </div>
    <div v-if="loading" class="loader">
      Loading...
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
  name: 'SbProductCarousel',
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
    swiper () {
      return this.$refs.carousel ? this.$refs.carousel.$swiper : '';
    },
    showPagination () {
      return this.products.length > this.swiperOptions.slidesPerView
    }
  },
  data () {
    return {
      isVisible: false,
      products: [],
      swiperOptions: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        slidesPerView: 5,
        spaceBetween: 10,
        breakpoints: {
          768: {
            slidesPerView: 3
          },
          1200: {
            slidesPerView: 5
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
    }
  },
  async mounted () {
    let productSkus = [];
    if (this.content) {
      productSkus = this.content.products.map(product => product.Part_Number)
    } else {
      productSkus = await VehicleStorage.getRecentViewed();
    }
    let products = [];
    this.loading = true;
    await Promise.all(productSkus.map(async sku => {
      let relatedProductsQuery = prepareRelatedQuery('sku', sku);

      const response = await this.$store.dispatch('product/findProducts', {
        query: relatedProductsQuery,
        size: 1,
        prefetchGroupProducts: false,
        updateState: false
      });
      if (response) {
        products = [...products, ...response.items]
      }
    }))

    this.loading = false;
    this.products = products.map(prepareCategoryProduct);
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.sb-slider {
  --chevron-color: white;
  position: relative;
  margin: var(--spacer-lg) 6%;
  min-height: 400px;

  .loader {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sf-product-card {
    height: 470px;

    &__image-wrapper {
      width: 300px;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(126,126,126,.1);
    }

    .sf-product-card__title {
      width: 300px;
    }
  }

  .carousel {
    .slide {
      display: flex;
      justify-content: center;
      background-color: white;

      &-image {
        width: 100%;
      }

      .sf-image {
        &:before{
          background-color: rgba(126,126,126,.1);
          position: absolute;
          width: 100%;
          left: 0;
          height: 100%;
          z-index: 1;
          mix-blend-mode: multiply;
          pointer-events: none;
          content: ""
          }
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
        background-color: rgba(126,126,126,.1);

        .sf-product-card {
          width: 100%;
          max-width: 100%;
        }
      }

    }
  }

  .swiper-slide {
    display: flex !important;
    width: fit-content !important;
  }

  .swiper-pagination {
    position: relative;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    bottom: 0;
    /* @include for-mobile {
      bottom: 250px;
    } */

    &-bullet {
      width: 100% !important;
      height: 8px !important;
      border-radius: 0;
      margin: 0 !important;
      background: #818181;

      &-active {
        border-radius: 1rem;
        background-color: rgb(83, 86, 90);
      }

      &:first-child {
        border-bottom-left-radius: 1rem;
        border-top-left-radius: 1rem;
      }

      &:last-child {
        border-bottom-right-radius: 1rem;
        border-top-right-radius: 1rem;
      }
    }
  }

  .swiper-button-next {
    right: -4%;
    @include for-mobile {
      right: 1rem;
    }

    &::after {
      content: "";
    }
  }

  .swiper-button-prev {
    left: -4%;
    @include for-mobile {
      left: 1rem;
    }

    &::after {
      content: "";
    }
  }

  .swiper-button-control {
    padding: 5px;
    background: black;
    border-radius: 50%;
  }
}
</style>
