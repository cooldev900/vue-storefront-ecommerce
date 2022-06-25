<template>
  <div class="sb-key-info">
    <div class="grid-container">
      <div class="sb-key-info__title">
        {{ introTitles.title }}
      </div>
      <p class="sb-key-info__description">
        {{ introTitles.copy }}
      </p>
      <div class="sb-key-info__content">
        <div v-for="(step, index) in steps" :key="index" class="sb-key-info__card">
          <img :src="step.icon.filename">
          <div class="sb-key-info__card-step">
            {{ index + 1 }}
          </div>
          <div class="sb-key-info__card-title">
            {{ step.title }}
          </div>
          <div class="sb-key-info__card-description">
            {{ step.copy }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';
export default {
  name: 'SbTeaserV2',
  components: {
    SfImage
  },
  computed: {
    ...mapGetters('vehicles', ['globalSbData']),
    introTitles () {
      if (this.globalSbData) {
        const step = this.globalSbData['header_links'].find(
          item => item.component === 'teaser-v2'
        );
        return step || [];
      } else {
        return [];
      }
    },
    steps () {
      if (this.globalSbData) {
        const step = this.globalSbData['header_links'].find(
          item => item.component === 'teaser-v2'
        );
        return step ? step.teaser_v2_card : [];
      } else {
        return [];
      }
    }
  },
  methods: {
    getIcon (name) {
      const images = require.context('../../assets/icons/', false, /\.png$/)
      return images('./' + name + '.png')
    }
  }
}
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-key-info {
  display: flex;
  justify-content: flex-start;
  background: var(--c-primary);
  align-items: center;
  flex-direction: column;
  margin: 0;
  text-align: center;
  padding: 50px 20px;

  &__title {
    text-transform: uppercase;
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #fff;
  }

  &__description {
    margin: var(--spacer-lg) 0;
    font-size: 24px;
    color: #fff;
    margin: 0 0 60px 0;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
    @include for-mobile{
    grid-template-columns: 1fr;
    grid-row-gap: 40px;
    }
  }

  &__card {
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
    flex-direction: column;
    gap: var(--spacer-xs);
    font-size: 16px;
    gap: var(--spacer-base);
    padding: 60px var(--spacer-lg) 40px var(--spacer-lg);
    text-align: center;
    background: #fff;

    &-title {
      font-weight: bold;
    }
    &-step{
    background-color: var(--c-primary);
    border: 3px solid #ffffff;
    border-radius: 50%;
    color: #ffffff;
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: -1.5rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    font-weight: 700;
    font-size: 24px;
    }
    .sf-image {
      display: none;
      img {
        width: 70px;
        height: 70px;
      }
    }
  }
}
</style>
