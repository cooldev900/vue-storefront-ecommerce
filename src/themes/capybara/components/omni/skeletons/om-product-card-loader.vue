<template>
  <div class="sf-product-card products__product-card products__product-card product-card-loader">
    <VueSkeletonLoader
      type="rect"
      width="100%"
      height="20px"
      animation="fade"
      class="title"
    />
    <VueSkeletonLoader
      type="rect"
      rounded
      radius="50%"
      width="200px"
      height="200px"
      animation="fade"
      class="image"
    />
    <VueSkeletonLoader
      type="rect"
      width="30%"
      height="20px"
      animation="fade"
      class="price"
    />
  </div>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';

export default {
  name: 'OmProductCardLoader',
  components: {
    VueSkeletonLoader
  }
}
</script>

<style lang="scss">
.product-card-loader {
  min-height: 696.6px;
  display: flex;
  flex-direction: column;

  .image {
    margin: auto;
    width: 200px !important;
    height: 200px !important;
  }

  .title {
    margin-bottom: var(--spacer-xs);
  }
}
</style>
