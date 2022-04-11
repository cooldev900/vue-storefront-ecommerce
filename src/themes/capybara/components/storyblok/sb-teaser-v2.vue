<template>
  <div class="sb-key-info">
    <div class="sb-key-info__title">
      How to Buy Online
    </div>
    <div class="sb-key-info__content">
      <div v-for="(step, index) in steps" :key="index" class="sb-key-info__card">
        <SfImage
          class="sb-key-info__card-icon"
          loading="lazy"
          :width="70"
          src="../../assets/icons/recycle.png"
        />
        <div class="sb-key-info__card-step">
          STEP {{ index + 1 }}
        </div>
        <div class="sb-key-info__card-title">
          {{ step.title }}
        </div>
        <div class="sb-key-info__card-description">
          {{ step.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'SbTeaserV2',
  components: {
    SfImage
  },
data () {

return {
title: 'The Ocean BMW Shop',
description: 'Buy the Parts and Accessories you need from the comfort of your own home.',
steps: [
{
icon: 'recycle',
title: 'Choose Your Model',
description: 'Simply enter your registration or choose your model from our model selector.'
},
{
icon: 'speedometer',
title: 'Browse',
description: 'Use our intuitive visual parts finder to simply select the Part you need from your vehicle diagram or browse our categories to find the Accessory for you.'
},
{
icon: 'recycle',
title: 'Trust',
description: 'By supplying your vehicle details, our expert Parts team will check that the item you have ordered fits your vehicle before dispatch.'
},
{
icon: 'speedometer',
title: 'Delivery',
description: 'Receive your item, whether it’s a floor mat or a brake disc, in the post so it can be installed on your car.'
}
]
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
.sb-key-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: var(--spacer-lg) 0;
  text-align: center;

  &__title {
    text-transform: uppercase;
    font-size: 34px;
    font-weight: 300;
    margin-bottom: 30px;

  }

  &__description {
    margin: var(--spacer-lg) 0;
    font-size: 30px;
  }

  &__content {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: var(--spacer-lg);
  }

  &__card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--spacer-xs);
    font-size: 16px;
    gap: var(--spacer-base);
    padding: 0 var(--spacer-lg);
    max-width: 350px;
    text-align: center;

    &-title {
      font-weight: bold;
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
