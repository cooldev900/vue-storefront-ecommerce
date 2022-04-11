
<template>
  <div id="vehicle">
    <VehicleLandingHero 
    title="test" 
    copy="test"
    image="https://prod-suzuki.azureedge.net/media/18282/507-v2-small.jpg?anchor=center&mode=crop&width=710&format=webp&quality=80&rnd=132683324380000000"
    />
  </div>
</template>

<script>
import VehicleLandingHero from 'theme/components/omni/om-vehicle-landing/hero.vue'
export default {
  name: 'Vehicle',
  components: {
    VehicleLandingHero
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
#vehicle {
  box-sizing: border-box;
  padding: var(--spacer-sm) var(--spacer-sm);
  background: var(--c-light-variant);
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
</style>
