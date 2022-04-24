<template>
<div class="grid-container">
  <div class="promo-area">
          <div class="promo-area__item" v-for="(card, index) in cards" :key="index">
        <img class="promo-area__item--img" :src="card.imgUrl" />
      </div>
  </div>
</div>
</template>

<script>
import OmCard from '../omni/om-card-collection/om-card.vue';
import {Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'SbBestMatchGrid',
  components: {
    OmCard,
    SwiperSlide,
    Swiper
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    cards () {
      if (this.content) {
        return this.content.logos.map(logo =>
          ({
            imgUrl: logo.logo.filename,
            title: logo.title,
            text: logo.description,
            cta: logo.cta.url
          }))
      } else {
        return []
      }
    },
    swiper () {
          return this.$refs.bestMatchCarousel.$swiper
    }
  },
  data () {
    return {
   swiperOption: {
          slidesPerView: 4,
          spaceBetween: 20,
          pagination: {
            el: '.swiper-pagination--best-match',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next--best-match',
            prevEl: '.swiper-button-prev--best-match'
          },
          breakpoints: {
            1401: {
              slidesPerView: 3.3,
              spaceBetween: 30,
            },
            1300: {
              slidesPerView: 3.2,
              spaceBetween: 30
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            320: {
              slidesPerView: 1.1,
              spaceBetween: 10
            }
          }
    }
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.promo-area {
  margin: var(--spacer-2xl) auto;
  margin: 60px auto;
  position: relative;
  display: grid;
  grid-column-gap: 15px;
  grid-template-columns: 1fr 1fr 1fr;
  @include for-mobile {
    grid-template-columns: 1fr; 
    padding: 0;
    margin: 40px auto;
  }
&__item{
  display: block;
&--img{
  width: 100%;
}
}
&__title{
  font-size: 30px;
  margin: 0;
  margin-bottom: 10px;
  @include for-mobile{
    font-size: 30px;
  }
}
&__copy{
  margin: 0;
  color: #333;
  font-size: 20px;
  margin-bottom: 40px;
  @include for-mobile{
    margin-bottom: 30px;
    font-size: 16px;
  }
}
.swiper-container{
  padding: 4px;
}
.swiper-pagination--best-match{
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .swiper-pagination-bullet{
      height: 10px;
      width: 10px;
    }
    .swiper-pagination-bullet-active{
      background: var(--c-primary);
    }
  }

  .swiper-button-disabled {
    visibility: hidden;
  }
   .swiper-button-next--best-match {
   right: 10px  !important;
   position: absolute;
   z-index: 1;
   cursor: pointer;
   top: 50%;
   transform: translateY(-50%);
    width: 38px;
    height: 38px;
    background: #fff;
    -webkit-box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    border-radius: 50%;
    border: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    @include for-desktop{
      height: 48px;
      width: 48px;
    }
        @include for-mobile{
      display: none;
    }
    svg{
      fill: var(--c-primary);
      height: 20px;
      width: 20px;
    }
    &:hover{
      background: #e8e8e8;
      border: 1px solid #bbb;
    }
  }
 .swiper-button-prev--best-match {
   left: 10px  !important;
   position: absolute;
   z-index: 1;
   cursor: pointer;
   top: 50%;
   transform: translateY(-50%);
    width: 38px;
    height: 38px;
    background: #fff;
    -webkit-box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    box-shadow: 0 4px 9px 1px rgba(0,0,0,0.1);
    border-radius: 50%;
    border: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    @include for-desktop{
      height: 48px;
      width: 48px;
    }
    @include for-mobile{
      display: none;
    }
    svg{
      fill: var(--c-primary);
      height: 20px;
      width: 20px;
    }
    &:hover{
      background: #e8e8e8;
      border: 1px solid #bbb;
    }
  }
  .swiper-slide{
    height: auto !important;
  }
}
</style>
