<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon navigation-icon desktop-only"
    @click="openVehicleCart({ type: 'vehiclecart' })"
  >
    <span class="sf-header__custom-icon">عربى</span>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OmVehicleIcon',
  components: { SfIcon, SfButton, SfBadge },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters({
      vehicles: 'vehicles/vehicles'
    }),
    vehicleCount () {
      if (this.vehicles && this.vehicles.length) {
        return this.vehicles.length;
      } else return false;
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.navigation-icon{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;  
  height: 100%;
}
.sf-header__custom-icon{
font-size: 14px;
color: #ffffff;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
position: relative;
margin: 0 15px;
font-family: var(--font-family-primary);
  &.navigation-transparent{
    color: #ffffff;
  }
}
</style>
