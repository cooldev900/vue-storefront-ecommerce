<template>
  <div class="sb-sign-post">
    <div class="content">
      <h2 class="title">
        {{ title }}
      </h2>
      <p class="description">
        {{ copy }}
      </p>
    </div>
    <div class="image-wrapper">
      <img :src="image">
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfButton, SfImage } from '@storefront-ui/vue';
export default {
  name: 'VehicleLandingHero',
  components: {
    SfCallToAction,
    SfButton,
    SfImage
  },
  props: {
  title: '',
  image: '',
  copy: ''
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-sign-post {
  display: flex;
  max-width: 1400px;
    margin: 20px auto;
    border-radius: 10px;
    overflow: hidden;
  justify-content: center;
  align-content: center;
  --button-background: var(--c-primary);
  @include for-mobile {
    flex-direction: column;
  }
  .content {
    width: 45%;
    display: flex;
    flex-direction: column;
    padding: 40px;
    justify-content: center;
    @include for-mobile {
      order: 2;
      padding: var(--spacer-base);
      width: auto;
    }
    .sf-button {
      width: fit-content;
      margin: var(--spacer-lg) 0;
    }
  }
  .image-wrapper {
    width: 55%;
    @include for-mobile {
      order: 1;
      width: 100%;
    }
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
}
</style>
