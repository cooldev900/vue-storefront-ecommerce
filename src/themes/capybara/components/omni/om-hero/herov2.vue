<template>
  <div class="om-hero--v2">
    <!-- <div class="om-hero__container">
      <SfImage
        :src="newsletterImage"
        :srcsets="[{&quot;src&quot;:&quot;newsletterImage&quot;,&quot;width&quot;:109,&quot;breakpoint&quot;:480},{&quot;src&quot;:&quot;/assets/storybook/SfImage/product-216x326.jpg&quot;,&quot;width&quot;:1200,&quot;breakpoint&quot;:1200},{&quot;src&quot;:&quot;/assets/storybook/SfImage/product-109x164.webp&quot;,&quot;width&quot;:&quot;400px&quot;,&quot;breakpoint&quot;:768}]"
        :width="auto"
        :height="326"
      />
    </div>
    <div class="hero-copy">
      <h1>{{ title }}</h1>
    </div>-->
    <swiper ref="carousel" :options="swiperOptions" class="carousel" @slideChange="slideChange">
      <swiper-slide v-for="(slide, index) in slideItems" :key="index">
        <div class="slide">
          <img class="slide-image" :src="slide.image.filename" alt="hero-image">
          <div class="slide-content desktop-only">
            <div class="car-explorer__desktop">
              <h2 class="title">
                {{ slide.Title }}
              </h2>
              <div class="description">
                {{ slide.Sub_title }}
              </div>
              <SfButton class="sf-button--full-width form__submit" @click="findMore">
                FIND OUT MORE
              </SfButton>
            </div>
          </div>
          <div class="car-explorer__mobile mobile-only">
            <h2 class="title">
              {{ slide.Title }}
            </h2>
            <div class="description">
              {{ slide.Sub_title }}
            </div>
            <SfButton @click.native="findMore">
              FIND OUT MORE
            </SfButton>
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
      <div v-if="slideItems.length > 1" class="swiper-pagination" slot="pagination" />
    </swiper>
    <div class="autoplay">
      <transition name="fade">
        <span v-if="!autoplayStatus" class="autoplay-play">
          <svg @click="resumeAutoPlay" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50" style=" fill:#ffffff;">
            <path
              d="M 10 5.25 L 10 44.75 L 11.5 43.875 L 42.09375 25.875 L 43.5625 25 L 42.09375 24.125 L 11.5 6.125 Z M 12 8.75 L 39.59375 25 L 12 41.25 Z"
            />
          </svg>
        </span>
        <span v-else class="autoplay-stop">
          <svg @click="stopAutoPlay" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50" style=" fill:#ffffff;">
            <path
              d="M 12 8 L 12 42 L 22 42 L 22 8 Z M 28 8 L 28 42 L 38 42 L 38 8 Z M 14 10 L 20 10 L 20 40 L 14 40 Z M 30 10 L 36 10 L 36 40 L 30 40 Z"
            />
          </svg>
        </span>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfCallToAction, SfButton, SfImage } from '@storefront-ui/vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import { SfChevron } from '@storefront-ui/vue';

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
  name: 'OmHeroV2',
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
    }
  },
  computed: {
    ...mapGetters('vehicles', [
      'storyblok',
      'getAttributeIdByLabel',
      'storyblokContent'
    ]),
    swiper () {
      return this.$refs.carousel.$swiper;
    },
    slideItems () {
      const sbHeroSliderComponent = this.storyblokContent(
        'hero-slider',
        this.storyblokKey
      );
      if (sbHeroSliderComponent) {
        return sbHeroSliderComponent.hero_slide;
      }
    }
  },
  data () {
    return {
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
        loop: true
      },
      autoplayStatus: true
    };
  },
  methods: {
    slideChange () {
      console.log('slide change');
    },
    findMore () {
      console.log('find more');
    },
    clickAutoplay () {
      console.log('autoplay');
    },
    resumeAutoPlay () {
      this.swiper.autoplay.start();
      this.autoplayStatus = true;
    },
    stopAutoPlay () {
      this.swiper.autoplay.stop();
      this.autoplayStatus = false;
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-hero--v2 {
  --chevron-color: white;
  position: relative;
  width: 80%;

  .carousel {
    .slide {
      /* height:1070px;
      background-size: cover; */
      &-image {
        width: 100%;
      }

      &-content {
        position: absolute;
        top: 0;
        bottom: 40px;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;

        .car-explorer {
          &__desktop {
            width: 374px;
            margin-left: 100px;
            color: #fff;
            padding: var(--spacer-base);

            .title {
              margin: 0;
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
        margin-top: -5px;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;

        .title {
          margin: 0;
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

  .autoplay {
    position: absolute;
    bottom: 42px;
    left: 80px;
    z-index: 1;

    @include for-mobile {
      bottom: 242px;
    }

    svg {
      cursor: pointer;
    }
  }

  .swiper-pagination {
    bottom: 50px;

    @include for-mobile {
      bottom: 250px;
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
