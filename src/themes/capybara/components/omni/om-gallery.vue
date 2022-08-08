<template>
  <div class="sf-gallery">
    <CoolLightBox
      :items="lightBoxItems"
      :index="lightBoxIndex"
      :effect="'fade'"
      :use-zoom-bar="true"
      @close="lightBoxIndex = null"
    />
    <div class="sf-gallery__stage">
      <swiper
        ref="swiper"
        :slides-per-view="1"
        :space-between="50"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(picture, index) in images"
          :key="'slide-' + index"
          @mouseover.native="startZoom(picture)"
          @mousemove.native="moveZoom($event, index)"
          @mouseout.native="removeZoom(index)"
        >
          <SfImage
            ref="sfGalleryBigImage"           
            :src="picture.desktop.url"
            :alt="picture.alt"
            :lazy="false"            
            @click="clickImage(picture, index)"
            :class="{ 'sf-gallery__big-image--has-zoom': enableZoom }"            
          />
        </swiper-slide>
      </swiper>
      <transition name="fade">
        <div
          v-if="outsideZoom && pictureSelected"
          ref="outSide"
          class="sf-gallery__zoom"
          :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }"
        >
          <SfImage
            ref="imgZoom"
            :src="pictureSelected"
            :width="imageWidth"
            :height="imageHeight"
            :lazy="false"
          />
        </div>
      </transition>
    </div>
    <div class="sf-gallery__thumbs">
      <slot name="thumbs" v-bind="{ images, active: activeIndex, go }">
        <SfButton
          v-for="(image, index) in images"
          :key="'img-' + index"
          class="sf-button--pure sf-gallery__item"
          :class="{ 'sf-gallery__item--selected': index === activeIndex }"
          @click="go(index)"
        >
          <SfImage
            class="sf-gallery__thumb"            
            :src="image.mobile.url"
            :alt="image.alt"
            :width="thumbWidth"
            :height="thumbHeight"
            :lazy="false"            
          />
        </SfButton>
      </slot>
    </div>
  </div>
</template>
<script>
import Glide from '@glidejs/glide';
import { SfButton, SfImage } from '@storefront-ui/vue';

export default {
  name: 'OmGallery',
  components: {
    SfImage,
    SfButton
  },
  props: {
    /**
     * Images list
     */
    images: {
      type: Array,
      default: () => []
    },
    /**
     * Images width, without unit
     */
    imageWidth: {
      type: [Number, String],
      default: 422
    },
    /**
     * Images height, without unit
     */
    imageHeight: {
      type: [Number, String],
      default: 664
    },
    /**
     * Thumb width, without unit
     */
    thumbWidth: {
      type: [Number, String],
      default: 100
    },
    /**
     * Thumb height, without unit
     */
    thumbHeight: {
      type: [Number, String],
      default: 100
    },
    /**
     * Initial image number (starting from 1)
     */
    current: {
      type: Number,
      default: 1
    },
    /**
     * Glide slider options (https://glidejs.com/docs/options/)
     */
    sliderOptions: {
      type: Object,
      default () {
        return {
          type: 'slider',
          autoplay: false,
          rewind: false,
          gap: 0
        };
      }
    },
    /**
     * Image zoom inside or overlap the stage
     */
    outsideZoom: {
      type: Boolean,
      default: false
    },
    /**
     * Toogle for image zoom or overlap the stage
     */
    enableZoom: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      positionStatic: {},
      eventHover: {},
      pictureSelected: '',
      glide: null,
      activeIndex: 0,
      style: '',
      lightBoxIndex: null,
      swiper: null,
    };
  },
  computed: {
    mapPictures () {
      // map images to handle picture tags with SfImage
      return this.images.map(({ desktop, big }) => ({
        mobile: desktop,
        desktop: big
      }));
    },
    updatedSliderOptions () {
      return { ...this.sliderOptions, startAt: this.activeIndex };
    },
    lightBoxItems () {
      return this.images.map(image => image.desktop.url)
    }
  },
  async mounted () {
    this.swiper = this.$refs.swiper.$swiper;
  },
  beforeDestroy () {
    if (this.glide) {
      this.glide.destroy();
    }
  },
  watch: {
    images (value) {
      console.log('images', value);
      this.$forceUpdate();
    }
  },
  methods: {
    rerender () {
      this.$forceUpdate();
    },
    initiateGlide () {
      if (this.glide) this.glide.destroy();
      const glide = new Glide(this.$refs.glide, this.updatedSliderOptions);
      glide.on('run', () => {
        this.go(glide.index);
      });
      glide.mount();
      this.glide = glide;
    },
  },
  beforeDestroy () {
    if (this.glide) {
      this.glide.destroy();
    }
  },
  methods: {
    positionObject (index) {
      if (this.$refs.sfGalleryBigImage) {
        if (this.outsideZoom) {
          return this.$refs.glide.getBoundingClientRect();
        } else {
          return this.$refs.sfGalleryBigImage[
            index
          ].$el.getBoundingClientRect();
        }
      }
      return '';
    },
    go (index) {
      this.activeIndex = index;
      this.swiper.slideTo(index);
    },
    startZoom (picture) {
      if (this.enableZoom) {
        const { zoom, big, desktop } = picture;
        this.pictureSelected = (zoom || big || desktop).url;
      }
    },
    moveZoom ($event, index) {
      if (this.enableZoom) {
        this.eventHover = $event;
        if (this.outsideZoom) {
          this.positionStatic = this.positionObject(index);
          this.$refs.imgZoom.$refs.image.style.transformOrigin = `${
            $event.clientX - this.positionStatic.x
          }px ${$event.clientY - this.positionStatic.y}px`;
        } else {
          this.positionStatic = this.positionObject(index);
          this.$refs.sfGalleryBigImage[index].$refs.image.style.top = '0';
          this.$refs.sfGalleryBigImage[index].$refs.image.style.transform =
            'scale(2)';
          this.$refs.sfGalleryBigImage[
            index
          ].$refs.image.style.transformOrigin = `${
            $event.clientX - this.positionStatic.x
          }px ${$event.clientY - this.positionStatic.y}px`;
        }
      }
    },
    removeZoom (index) {
      if (this.enableZoom) {
        this.pictureSelected = '';
        this.$refs.sfGalleryBigImage[index].$refs.image.style.transform =
          'translate3d(0, -50%, 0)';
        this.$refs.sfGalleryBigImage[index].$refs.image.style.top = '50%';
      }
    },
    clickImage (picture, index) {
      console.log('click')
      this.$emit('click:stage', { picture, index })
      this.lightBoxIndex = index;
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-gallery__thumbs{
  padding: 20px;
}
.sf-gallery__item--selected{
  border: 1px solid var(--c-primary);
}
.sf-gallery__item{
  border: 1px solid var(--c-primary);
}
</style>
