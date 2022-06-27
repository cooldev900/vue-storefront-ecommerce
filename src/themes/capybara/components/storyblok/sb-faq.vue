<template>
<div class="grid-container">
    <h2>{{ faqTitle }}</h2>
  <SfAccordion open="" :multiple="false" transition="" show-chevron>
    <SfAccordionItem v-for="(item, index) in faqs" :key="index" :header="item.title">
      {{ item.copy }}
    </SfAccordionItem>
  </SfAccordion>
</div>
</template>

<script>
import { SfAccordion } from '@storefront-ui/vue';

export default {
  name: 'SbFaq',
  components: {
    SfAccordion
  },
  props: {
    storyblokKey: {
      type: String,
      default: 'home'
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    faqs () {
      return Object.keys(this.content) ? this.content.faq_items : []
    },
    faqTitle () {
      return Object.keys(this.content) ? this.content.title : []
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.mercedes__cart-header{
  background: #000;
  padding: var(--spacer-lg) 0;
.cart-header{
    display: flex;
  &__title{
    width: 50%;
    h1{
      color: #fff;
    }
  @include for-mobile{
    width: 100%;
    text-align: center;
  }
  }
  &__illustration-img{
    width: 50%;
    object-fit: contain;
    align-self: center;
  }
}
}
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    padding: 0;
    background: #f4f4f4;
    margin: 0 auto;
  }
}

.grid {
  margin: 0;
  padding: 0;
  @include for-desktop{
  padding: 0 15px;
  }
  @include for-desktop {
    margin-left: auto;
    margin-right: auto;
    padding-right: 12px;
    padding-left: 12px;
    max-width: 1280px;
  }
}

.checkout {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  width: 100%;

  @include for-desktop {
    --steps-content-padding: 0;
    flex-direction: row;
    padding: 0 12px;
  }

  &__main {
    background-color: #f4f4f4;
    width: 100%;
    order: 2;

    @include for-desktop {
      flex: 1;
      width: 66%;
      order: 1;
    }
  }

  &__aside {
    padding: 0px;
    order: 1;

    @include for-desktop {
      padding: 16px;
      width: 33%;
      order: 2;
    }
  }
}
.sf-accordion{
  @include for-mobile{
    padding: 0 10px
  }
}
::v-deep .sf-steps__content {
  display: flex;
  @include for-mobile {
    display: block;
    margin-top: 20px;
  }
}
::v-deep .sf-steps__header {
  @include for-desktop {
    max-width: 600px;
    margin: 20px auto;
  }
}
.order-review {
  margin: var(--spacer-sm) 0;
}
.container {
  display: flex;
}

.sf-accordion-item {
  position: relative;
  background: #fff;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 0 2px 0 rgba(0,0,0,0.1), 0 2px 4px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
  .edit {
    position: absolute;
    top: 40px;
    font-size: 12px;
    right: 20px;
    cursor: pointer;
    color: #333;
  }
}

.confirm {
  width: 100%;
  padding: 0;
  line-break: anywhere;
}
::v-deep .sf-accordion-item__content{
  padding: 10px 0 !important;
  border: none !important
}
</style>
