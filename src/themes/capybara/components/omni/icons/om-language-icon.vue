<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon navigation-icon desktop-only"
  >
    <router-link
      :to="storeId !== 3 ? '/ar/' : '/'"
      :title="$t('Home Page')"
    >
    <span class="sf-header__custom-icon">{{ $t('Language') }}</span>
     </router-link>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

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
    },
    storeId () {
      return currentStoreView().storeId;
    },
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
&:hover{
  color: var(--c-primary);
}
}
</style>
