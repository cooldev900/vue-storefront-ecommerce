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
.sf-accordion{
  @include for-mobile{
    padding: 0
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
  border: 1px solid transparent;
  &:hover{
    border: 1px solid var(--c-primary);
  }
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
::v-deep .sf-accordion-item__header{
   font-weight: 700 !important;
   border: none;
}
</style>
