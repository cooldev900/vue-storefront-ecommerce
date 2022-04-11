<template>
  <div class="om-card">
     <router-link :to="info.link">
    <SfImage :src="info.imgUrl" loading="lazy" class="image" :alt="info.text" />
    <h1>{{ info.title }}</h1>
     </router-link>
  </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'TeaserV1Card',
  components: {
    SfImage
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        imgUrl: '',
        title: 'Cart Title',
        link: ''
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-card {
  display: flex;
  flex-direction: column;
  width: 100% !important;
  color: var(--c-grey-text);
  h1 {
    margin-top: var(--spacer-xl);
    margin-bottom: 0;
    font-family: var(--font-family-bold);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    margin-bottom: 10px;
    text-align: center;
    color: #0c121c;
  }
  .sf-image {
    border-radius: 0;
  }
  .link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    color: var(--c-primary);
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    .sf-icon {
      margin-left: var(--spacer-xl);
    }
  }
}
::v-deep .sf-image--has-size {
  width: 100%;
  max-width: none;
}
</style>
