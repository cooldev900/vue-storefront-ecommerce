<template>
  <div class="m-product-short-info">
    <div class="product__price-and-rating">
      <AProductPrice
        :product="product"
        :custom-options="customOptions"
      />
      <div class="product__part-info">
        <Pill />
      <span class="part-number">Product Code: {{ title }}</span>
    </div>
    </div>
  </div>
</template>

<script>
import { SfHeading, SfIcon } from '@storefront-ui/vue';
import AProductPrice from 'theme/components/atoms/a-product-price';
import Pill from 'theme/components/omni/ui/pill'
import { createSmoothscroll } from 'theme/helpers'
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
    SfIcon,
    Pill,
    AProductPrice
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    },
    reviews: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    reviewsCount () {
      return this.reviews.length
    },
    title () {
    return this.product.sku;
    }
  },
  methods: {
    openReviewsTab () {
      this.$store.commit('ui/setReviewProductTab', true);

      const reviewsEl = document.querySelector('#m-product-additional-info');
      if (!reviewsEl) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      createSmoothscroll(scrollTop, scrollTop + reviewsEl.getBoundingClientRect().top);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";

.product {
  &__header {
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    padding: 15px;
    background: #fff;
    align-items: center;
    @include for-desktop {
      display: block;
      margin: 0;
    }
  }
  &__description {
    color: var(--c-link);
    @include font(
      --product-description-font,
      var(--font-light),
      var(--font-base),
      1.6,
      var(--font-family-primary)
    );
  }
  &__part-info{
    display: flex;
    align-items: center;
   .part-number{
    font-size: 12px;
    margin-left: 15px;
  }
  }
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
