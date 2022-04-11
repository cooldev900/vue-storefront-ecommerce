<template>
  <div class="sb-our-services">
    <div
      class="sb-our-services__card"
      v-for="(card, index) in serviceCard"
      :key="index"
    >
      <div class="cart--icon"><img :src="card.icon" /></div>
      <h2 class="title">
        {{ card.title }}
      </h2>
      <p class="description">
        {{ card.copy }}
      </p>
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfButton, SfImage } from "@storefront-ui/vue";
export default {
  name: "SbOurServices",
  components: {
    SfCallToAction,
    SfButton,
    SfImage,
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    varient: {
      type: String,
      default: "light", // light/grey/dark
    },
  },
  computed: {
    serviceCard() {
      return Object.keys(this.content) ? this.content.our_service_card : [];
    },
  },
  methods: {},
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-our-services {
  padding: 0 40px;
  max-width: 1680px;
  margin: 60px auto;
  width: 86%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  gap: 20px;
  @include for-mobile {
    flex-direction: column;
  }
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: white;
    border: 1px solid #ddd;
    box-sizing: border-box;
    padding: 1.25rem 0.5rem;
    text-decoration: none;
    text-align: center;
    transition: all 200ms ease-in-out 0s;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.375rem;
    cursor: pointer;
    .sf-button {
      width: fit-content;
      margin: var(--spacer-lg) 0;
    }
    .description{
        font-weight: normal;
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
