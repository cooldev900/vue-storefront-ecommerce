<template>
  <div class="grid-container">
    <div class="sb-our-services">
      <div
        class="sb-our-services__card"
        v-for="(card, index) in serviceCard" :key="index"
      >
        <router-link :to="card.url.url">
          <div class="icon">
            <img :src="card.image.filename || '' ">
          </div>
          <h2 class="title">
            {{ card.title }}
          </h2>
          <p class="description">
            {{ card.copy }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfButton, SfImage } from '@storefront-ui/vue';
export default {
  name: 'SbOurServices',
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
    varient: {
      type: String,
      default: 'light' // light/grey/dark
    }
  },
  computed: {
    serviceCard () {
      return Object.keys(this.content) ? this.content.our_service_card : [];
    }
  },
  methods: {}
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-our-services {
  margin: 60px auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  gap: 20px;
  @include for-mobile {
    flex-direction: column;
      grid-template-columns: 1fr;
  }
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 1.25rem 0.5rem;
    text-decoration: none;
    text-align: center;
    transition: all 200ms ease-in-out 0s;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.375rem;
    cursor: pointer;
    &:hover{
      border: 1px solid var(--c-primary);
    }
    .sf-button {
      width: fit-content;
      margin: var(--spacer-lg) 0;
    }
    .description{
        font-weight: normal;
    }
    .icon{
      padding-bottom: 14px;
      img{
        max-width: 100px;
      }
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
}
</style>
