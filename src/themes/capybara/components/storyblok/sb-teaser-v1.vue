<template>
  <div class="teaser-v1">
    <div class="teaser-v1__container">
      <TeaserV1Card
        v-for="(card, index) in cards"
        :key="index"
        :info="card"
      />
    </div>
  </div>
</template>

<script>
import TeaserV1Card from './cards/teaser-v1-card';

export default {
  name: 'SbTeaserV1',
  components: {
    TeaserV1Card
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
        return this.content.teaser_v1_card.map(card =>
          ({
            imgUrl: card.Image.filename,
            title: card.Title,
            link: card.Linke.url
          }))
      } else {
        return []
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.teaser-v1 {
  width: 90%;
  margin: auto;
  .title-area{
    padding: 50px 30px 0 30px;
  h3{
    text-align: center;
    margin: 0;
  }
  h6{
    text-align: center;
  }
  }
  &__container{
  margin: 0 auto 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: var(--spacer-xl);
  padding: 40px 40px;
    @include for-mobile {
  grid-template-columns: 1fr 1fr;
  padding: 40px 0;
    }
    }
}
</style>
