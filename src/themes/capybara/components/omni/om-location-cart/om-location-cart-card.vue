<template>
  <div class="om-location-cart-card">
    <h1 class="om-location-cart-card__title">
      {{ data.location_name }}
    </h1>
    <h4 class="om-location-cart-card__position">
      Legion Way, Roman Road, Hereford, Herefordshire, HR1 1LN
    </h4>
    <p class="om-location-cart-card__opening_times">
      Opening Times: {{ data.opening_hours }}
    </p>
    <SfButton
      class="a-select-location sf-button--full-width"
      @click="handleClick"
    >
      Select Location
    </SfButton>
  </div>
</template>

<script>
import { SfImage, SfCallToAction, SfButton } from '@storefront-ui/vue';

export default {
  name: 'OmVehicleCartCard',
  components: {
    SfImage,
    SfCallToAction,
    SfButton
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    brand: {
      type: String
    }
  },
  methods: {
    handleClick () {
      // const extractData = {
      //   brand: this.brand,
      //   magento_code: this.data.magento_code,
      //   location_name: this.data.location_name
      // };
      // LocationStorage.saveLocations(extractData);
      this.$store.commit('omLocator/setLocation', this.data);

      this.$emit('close');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-location-cart-card {
  display: flex;
  flex-direction: column;
  width: 100% !important;
  color: var(--c-grey-text);
  box-sizing: border-box;
  box-shadow: 5px 5px 15px 2px RGB(0 0 0 / 25%);
  padding: 20px;
  border-radius: 15px;
  &__position {
    margin: 2px 0;
  }
  &__opening_times {
    margin: 10px 0;
  }
  .sf-button {
    margin-top: 10px;
  }
}
</style>
