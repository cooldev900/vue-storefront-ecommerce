<template>
  <div class="om-card">
    <SfImage :src="info.imgUrl" loading="lazy" class="image" :alt="info.text" />
    <div class="om-card--body">
    <h4>{{ info.title }}</h4>
    <p class="copy">
      {{ info.text }}
    </p>
    </div>
  </div>
</template>

<script>
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OmCardNav',
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
        title: 'Cart Title'
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
  position: relative;
  max-width: 600px;
  color: var(--c-grey-text);
  .om-card--body{
    position: absolute;
    z-index: 1;
    background: linear-gradient(0deg,#000 0%,#000 29%,transparent 100%);
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    bottom: 0;
    padding: 10px;
  h4 {
   font-size: 16px;
       font-weight: 600;
       line-height: 16px;
       margin-bottom: 24px;
       letter-spacing: .8px;
       color: #fff;
  }
  .copy{
  margin-top: 0px;
  font-size: 14px;
      font-weight: 300;
      margin-bottom: 21px;
      letter-spacing: .2px;
      color: #fff;
  }
  }
  .sf-image {
    border-radius: 0;
  }
  .link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    text-transform: uppercase;
        color: #4a4f54;
        font-weight: 600;
        letter-spacing: .173em;
    font-size: 10px;
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
