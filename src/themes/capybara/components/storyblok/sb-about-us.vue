<template>
  <div class="sb-sign-post" :style="{ backgroundColor: theme.bgColor, color: theme.color }">
    <div class="content">
      <h4 class="subtitle">
        {{ subTitle }}
      </h4>
      <h1 class="title">
        {{ title }}
      </h1>
      <p class="description">
        {{ copy }}
      </p>
    </div>
    <div class="image-wrapper" :class="imagePosition">
      <img :src="image">
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfButton, SfImage } from '@storefront-ui/vue';
export default {
  name: 'SbAboutUs',
  components: {
    SfCallToAction,
    SfButton,
    SfImage
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    variant: {
      type: String,
      default: 'light' // light/grey/dark
    }
  },
  computed: {
    title () {
      return this.content.title || ''
    },
    subTitle () {
      return this.content.sub_title || ''
    },
    copy () {
      return this.content.copy || ''
    },
    image () {
      return this.content.image.filename
    },
    imagePosition () {
      return this.content.image_position
    },
    theme () {
      if (this.variant === 'light') {
        return {
          bgColor: 'none',
          color: '#000'
        }
      } else if (this.variant === 'grey') {
        return {
          bgColor: 'none',
          color: '#000'
        }
      } else if (this.variant === 'dark') {
        return {
          bgColor: 'none',
          color: '#000'
        }
      }
    }
  },
  methods: {
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-sign-post {
  display: flex;
  max-width: 1400px;
    margin: 30px auto;
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
  .image-left{
    order: 1;
     @include for-mobile {
      order: 1;
      width: 100%;
    }
  }
  .subtitle{
    color: orange;
    margin-bottom: 0;
  }
  .title{
    font-size: 24px;
  }
}
</style>
