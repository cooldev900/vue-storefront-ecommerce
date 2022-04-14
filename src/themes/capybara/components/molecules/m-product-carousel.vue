<template>
  <SfCarousel
    class="m-product-carousel"
    :settings="{
      animationDuration: 2000,
      rewindDuration: 2000
    }"
  >
    <SfCarouselItem v-for="(product, i) in carouselProducts" :key="i">
      <OmProductCard
        :title="product.title"
        :image="product.image"
        :regular-price="product.price.regular"
        :special-price="product.price.special"
        :max-rating="product.rating.max"
        :score-rating="product.rating.score"
        :link="product.link"
        :wishlist-icon="false"
        link-tag="router-link"
      />
    </SfCarouselItem>
  </SfCarousel>
</template>
<script>
import { SfProductCard, SfCarousel } from '@storefront-ui/vue';
import { prepareCategoryProduct } from 'theme/helpers';
import OmProductCard from "theme/components/omni/om-product-card.vue";
export default {
  name: 'MProductCarousel',
  components: {
    SfCarousel,
    SfProductCard,
    OmProductCard
  },
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    carouselProducts () {
      return this.products.map(prepareCategoryProduct);
    }
  }
};
</script>
