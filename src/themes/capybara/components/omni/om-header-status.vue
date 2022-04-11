<template>
  <div class="om-header-status">
    <div class="om-header-status__inner">
    <div
      v-for="item in confidenceBarItems"
      :key="item._uid"
      class="status-item desktop-only"
    >
      <div class="status-item__icon">
       <img :src="item.confidence_icon" />
       </div>
      <div class="status-item__title">
        {{ item.confidence_title }}
      </div>
    </div>
    <swiper ref="carousel" :options="swiperOptions" class="carousel mobile-only">
      <swiper-slide v-for="item in confidenceBarItems" :key="item._uid">
        <div class="slide-item__title">
          {{ item.confidence_title }}
        </div>
      </swiper-slide>
    </swiper>
  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SfImage } from '@storefront-ui/vue';
import { SwiperSlide } from 'vue-awesome-swiper';
import LazyHydrate from 'vue-lazy-hydration';

export default {
  name: 'OmHeaderStatus',
  components: {
    SfImage,
    LazyHydrate,
    SwiperSlide
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: {
          delay: 4000
        },
        speed: 300,
        loop: true,
        slidesPerGroup: 1,
        breakpoints: {
          768: {
            slidesPerView: 2
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('vehicles', ['globalSbData']),
    confidenceBarItems () {
      if (this.globalSbData) {
        const confidenceBar = this.globalSbData['header_links'].find(
          item => item.component === 'Confidence Bar'
        );
        return confidenceBar ? confidenceBar.confidence_message : [];
      } else {
        return [];
      }
    },
    swiper () {
      return this.$refs.carousel ? this.$refs.carousel.$swiper : '';
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-header-status {
  background: var(--c-confidence-bar);
  height: 50px;
  color: #333;
  z-index: 0;
  position: relative;
  &__inner{
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: auto;
  }
  .status-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 50px;

    &__title {
      margin-left: 1em;
      font-size: 14px;
    }
    &__icon{
      img{
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }
  }

  .slide-item {
    &__title {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }
}
</style>
