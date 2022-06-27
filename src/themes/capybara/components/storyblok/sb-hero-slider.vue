<template>
  <div class="om-hero--v2" :class="{'dir-rtl': storeId === 3}">
    <swiper ref="carousel" :options="swiperOptions" class="carousel" @slideChange="slideChange">
      <swiper-slide v-for="(slide, index) in slideItems" :key="index">
        <div class="slide">
          <img class="slide-image desktop-only" :src="slide.image.filename" alt="hero-image">
          <img class="slide-image mobile-only" :src="slide.image_mobile.filename" alt="hero-image">
          <div class="slide-content desktop-only" :class="{'dir-rtl': storeId === 3}">
            <div class="car-explorer__desktop">
              <h2 class="title">
                {{ slide.Title }}
              </h2>
              <div class="description">
                {{ slide.Sub_title }}
              </div>
            </div>
          </div>
          <div class="car-explorer__mobile mobile-only">
            <h2 class="title">
              {{ slide.Title }}
            </h2>
            <div class="description">
              {{ slide.Sub_title }}
            </div>

            <a :href="slide.link.url">
              <SfButton class="sf-button--full-width om-btn--primary">
                Shop Now
              </SfButton>
            </a>
          </div>
        </div>
      </swiper-slide>

      <div v-if="slideItems.length > 1" class="swiper-button-next" slot="button-next">
        <span class="swiper-button-control">
          <SfChevron class="sf-chevron--right" />
        </span>
      </div>
      <div v-if="slideItems.length > 1" class="swiper-button-prev" slot="button-prev">
        <span class="swiper-button-control">
          <SfChevron class="sf-chevron--left" />
        </span>
      </div>
    </swiper>
  </div>
</template>
<script>
import { SfCallToAction, SfButton, SfImage, SfChevron } from '@storefront-ui/vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size',
  'Trim'
];

export default {
  name: 'SbHeroSlider',
  components: {
    SfCallToAction,
    SfButton,
    SfImage,
    SwiperSlide,
    SfChevron
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
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode',
      isSidebarOpen: 'ui/isSidebarOpen',
      activeModals: 'ui/activeModals',
      currentStoreViewStoreId () {
        return currentStoreView().storeId;
      }
    }),
    swiper () {
      return this.$refs.carousel.$swiper;
    },
    slideItems () {
      return Object.keys(this.content) ? this.content.hero_slide : []
    }
  },
  data () {
    return {
      storeId: 0,
      initialSelectorData: [],
      selectorData: [],
      selectedItems: {},
      resultProducts: [],
      isVisible: false,
      swiperOptions: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 6000
        },
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 500,
        loop: false
      },
      autoplayStatus: true
    };
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    slideChange () {
      // console.log('slide change');
    },
    findMore () {
      // console.log('find more');
    },
    clickAutoplay () {
      // console.log('autoplay');
    },
    resumeAutoPlay () {
      this.swiper.autoplay.start();
      this.autoplayStatus = true;
    },
    stopAutoPlay () {
      this.swiper.autoplay.stop();
      this.autoplayStatus = false;
    },
    onClick () {
      this.openModal({
        name: ModalList.OmSelectorModal,
        payload: { dropdownKeys: [], enableAction: true }
      });
    }
  },
  watch: {
    isSidebarOpen (status) {
      this.open = !status
    },
    activeModals (modals) {
      this.open = !modals.length
    }
  },
  beforeMount () {
    this.storeId = currentStoreView().storeId;
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-hero--v2 {
  --chevron-color: white;
  position: relative;
    max-width: 2000px;
    margin: auto;
    overflow: hidden;
  .carousel {
    .slide {
        @include for-desktop {
       min-height: 400px;
            }
         @include for-mobile {
           height: 100%;
         }
        &:before{
       background: radial-gradient(ellipse at 66%, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 100%);
       transition: background .5s ease-in;
       height: 100%;
       width: 100%;
       content: '';
       position: absolute;
       @include for-mobile{
         display: none;
       }
     }
      &-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
           @include for-desktop{
          height: 350px;
        }
        @include for-desktop{
          height: 500px;
          vertical-align: middle;
        }
      }

      &-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        &.dir-rtl{
         flex-direction: row-reverse;
        }
        .car-explorer {
          &__desktop {
            width: 374px;
            margin-left: 200px;
            color: #fff;
            padding: var(--spacer-base);

            .title {
              margin: 0;
              font-size: 32px;
              word-break: break-word;
              margin-bottom: var(--spacer-sm);
            }

            .description {
              font-weight: 500;
              word-break: break-word;
              margin-bottom: var(--spacer-lg);
            }
          }
        }
      }

      .car-explorer__mobile {
        padding: 15px;
        position: relative;
        bottom: 0;
        display: flex;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
         @include for-mobile {
          .om-btn--primary{
            width: 100%;
          }
        }

        .title {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .description {
          color: #333;
          margin-bottom: var(--spacer-sm);
        }
      }
    }
  }

  .autoplay {
    position: absolute;
    bottom: 42px;
    left: 80px;
    z-index: 1;

    @include for-mobile {
      bottom: 242px;
      display: none;
    }

    svg {
      cursor: pointer;
    }
  }

  .swiper-pagination {
    bottom: 50px;

    @include for-mobile {
      bottom: 250px;
      display: none;
    }
    &-bullet {
      margin: 0 10px !important;
      width: 15px !important;
      height: 15px !important;
      @include for-mobile {
        margin: 0 7px !important;
        width: 10px !important;
        height: 10px !important;
      }
    }
  }
  .swiper-button-next {
    right: 1rem;

    &::after {
      content: "";
    }
  }

  .swiper-button-prev {
    left: 1rem;

    &::after {
      content: "";
    }
  }

  .swiper-button-control {
    padding: 10px 5px;
    padding-left: 7px;

    .sf-chevron {
      transform: scale(2);
    }
  }
}
</style>
