<template>
  <div class="om-card">
    <router-link :to="info.cta">
    <SfImage :src="info.imgUrl" loading="lazy" class="image" :alt="info.text" />
    <h1>{{ info.title }}</h1>
    <p class="copy">{{ info.text }}</p>
    </router-link>
  </div>
</template>

<script>
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OmCard',
  components: {
    SfImage,
    SfIcon
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        imgUrl: '',
        text: 'Card Text',
        title: 'Cart Title',
        cta: ''
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
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 8.9px 1.1px rgba(0,0,0,0.08);
  border-radius: 10px;
  overflow: hidden;
  color: var(--c-grey-text);
  h1 {
    margin-top: var(--spacer-xl);
    font-family: var(--font-family-bold);
    font-size: 18px;
    line-height: 28px;
    margin-bottom: 10px;
    padding: 0 20px;
    color: #0c121c;
  }
  .copy{
    font-family: var(--font-family-primary);
    padding: 0 20px;
  }
  .sf-image {
    border-radius: 0;
  }
  .link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    color: var(--c-primary);
    padding: 15px;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
  }
}
::v-deep .sf-button{
  width: 100%;
  margin-bottom: var(--spacer-base);
}
::v-deep .sf-image--has-size {
  width: 100%;
  max-width: none;
}
</style>

</style>
