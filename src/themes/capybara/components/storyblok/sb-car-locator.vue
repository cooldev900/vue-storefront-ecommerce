<template>
  <div class="sb-car-locator">
    <SfCallToAction :image="leftImage">
      <template #description>
        <h2 class="sub-title">
          {{ content.left_title }}
        </h2>
        <div class="button-container">
          <div class="hero-selector-modal">
            <SfButton class="sf-button sf-button--outline" @click="onClick('left')">
              <div class="search-button-content">
                {{ content.left_button_text }}
              </div>
            </SfButton>
          </div>
        </div>
      </template>
    </SfCallToAction>
    <SfCallToAction :image="rightImage">
      <template #description>
        <h2 class="sub-title">
          {{ content.right_title }}
        </h2>
        <div class="button-container">
          <div class="hero-selector-modal">
            <SfButton class="sf-button sf-button--outline" @click="onClick('left')">
              <div class="search-button-content">
                {{ content.right_button_text }}
              </div>
            </SfButton>
          </div>
        </div>
      </template>
    </SfCallToAction>
  </div>
</template>

<script>
import { SfCallToAction, SfButton } from '@storefront-ui/vue';
import { checkWebpSupport } from 'theme/helpers';

export default {
  name: 'SbCarLocator',
  components: {
    SfCallToAction,
    SfButton
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    leftImage () {
      const imageUrl = this.content?.left_image?.filename
      if (imageUrl) {
        const webSupportedImage = checkWebpSupport([
          {
            image: {
              webp: imageUrl,
              fallback: imageUrl
            }
          }
        ]);

        return webSupportedImage[0].image;
      } else {
        return 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472';
      }
    },
    rightImage () {
      const imageUrl = this.content?.right_image?.filename
      if (imageUrl) {
        const webSupportedImage = checkWebpSupport([
          {
            image: {
              webp: imageUrl,
              fallback: imageUrl
            }
          }
        ]);

        return webSupportedImage[0].image;
      } else {
        return 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472';
      }
    }
  },
  methods: {
    onClick (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.sb-car-locator {
    display: grid;
    @include for-desktop {
        grid-template-columns: 1fr 1fr;
    }
    grid-template-columns: 1fr;
    padding: 5px;

    .sf-call-to-action {
        height: 18.5rem;
        align-items: flex-end;
        margin: 5px;

        .sub-title {
            color: white;
            margin: 10px 0;
        }

        .sf-button {
            border-color: white;
            font-weight: bold;
            color: white;
        }
    }
}
</style>
