<template>
  <SfCallToAction class="sb-hero" :image="newsletterImage">
    <template #description>
      <div class="sub-title">
        {{ subTitle }}
      </div>
      <div class="button-container">
        <div class="hero-selector-modal">
          <SfButton
            class="color-primary search-button"
            @click="showSelectorModal()"
          >
            <div class="search-button-content">
              SELECT YOUR CAR
            </div>
          </SfButton>
        </div>
      </div>
    </template>

    <template #title>
      <div class="title">
        {{ title }}
      </div>
    </template>
  </SfCallToAction>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { SfCallToAction, SfButton } from '@storefront-ui/vue';
import { checkWebpSupport } from 'theme/helpers';
import { ModalList } from 'theme/store/ui/modals';

export default {
  name: 'SbHero',
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
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters('vehicles', [
      'storyblok',
      'getAttributeIdByLabel'
    ]),
    newsletterImage () {
      const imageUrl = this.content?.image?.filename
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
    title () {
      return this.content.Title || ''
    },
    subTitle () {
      return this.content.Sub_title || ''
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showSelectorModal () {
      this.openModal({
        name: ModalList.OmSelectorModal
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

 ::v-deep .sf-call-to-action__text-container{
    width: 600px !important;
    padding: 80px 40px;
    margin-top: 40px;
  }
.sb-hero {
  margin: 0;
  position: relative;
  box-sizing: border-box;
  min-height: 100vh;
  background-position: center;
  display: flex;
.sb-hero__overlay{
    background: linear-gradient(to left,rgba(255,255,255,0) 45%,rgba(0,0,0,.7) 100%);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
}
  @include for-desktop {
    margin: 0;
  }
  .title {
    color: #fff;
    font-weight: 400;
    order: 3;
    font-size: 18px;
    margin-top: 30px;
  }
  .button-container {
    margin-top: 30px;
    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      .select-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .hero-content-selector {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
        align-items: center;
      }
      .hero-content-selector::after {
        content: "";
        flex: auto;
      }
    }
    .hero-selector-modal {
      margin-top: 1rem;
    }
  }
  .search-button {
  border-radius: 0;
    height: 50px;
    color: #fff;
    background: #4d4d4d;
    border: 1px solid #4d4d4d;
    width: 400px;
    .search-button-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .sub-title {
    color: #fff;
    font-size: 38px;
    font-weight: 300;
    text-transform: uppercase;
  }
}
</style>
