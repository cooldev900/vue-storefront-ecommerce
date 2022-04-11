<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon navigation-icon"
    @click="openVehicleCart({ type: 'vehiclecart' })"
  >
    <div :class="['sf-header__custom-icon', menuStyle]">
     <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="30" height="30"
viewBox="0 0 30 30"
style=" fill:#57585A;">    <path d="M26.206,12.559l-2.058-5.88C23.587,5.077,22.069,4,20.371,4H9.629C7.931,4,6.413,5.077,5.853,6.678l-2.058,5.88 C2.696,13.281,2,14.53,2,15.904V23c0,1.105,0.895,2,2,2s2-0.895,2-2v-1.261c0,0,5.281,0.261,9,0.261s9-0.261,9-0.261V23 c0,1.105,0.895,2,2,2s2-0.895,2-2v-7.096C28,14.53,27.303,13.281,26.206,12.559z M6.595,10.613l1.146-3.274 C8.022,6.537,8.779,6,9.629,6h10.742c0.85,0,1.607,0.537,1.888,1.339l1.146,3.274c0.18,0.515-0.249,1.034-0.788,0.947 C20.656,11.243,18.135,11,15,11c-3.135,0-5.656,0.243-7.617,0.56C6.844,11.647,6.415,11.128,6.595,10.613z M6.5,18 C5.672,18,5,17.328,5,16.5S5.672,15,6.5,15S8,15.672,8,16.5S7.328,18,6.5,18z M18,17h-6c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1h6 c0.552,0,1,0.448,1,1C19,16.552,18.552,17,18,17z M23.5,18c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5 S24.328,18,23.5,18z"></path></svg>
    </div>
    <span class="sf-header__custom-icon">Garage</span>
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
color: #000;
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
