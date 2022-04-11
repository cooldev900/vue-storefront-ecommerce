<template>
  <component
    v-if="sidebar.open || isMicrocartComponentLoaded || isVehicleCartLoaded || isLocationCartOpen"
    :is="currentComponent"
    @close="$store.commit('ui/closeSidebar')"
    @reload="reloadComponent()"
  />
</template>

<script>
import { mapState } from 'vuex';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';

const OMicrocartPanel = () =>
  import(
    /* webpackChunkName: "vsf-microcart" */ 'theme/components/organisms/o-microcart-panel'
  );
const OmVehicleCart = () =>
  import(
    /* webpackChunkName: "vsf-microcart" */ 'theme/components/omni/om-vehicle-cart/index'
  );
const OmLocationCartCard = () =>
  import(
    /* webpackChunkName: "vsf-microcart" */ 'theme/components/omni/om-location-cart/index'
  );

export default {
  data () {
    return {
      isMicrocartComponentLoaded: false,
      isVehicleCartLoaded: false,
      isLocationCartOpen: false,
      theMicrocartAsyncComponent: () => ({
        component: OMicrocartPanel().then((component) => {
          this.isMicrocartComponentLoaded = true;
          return component;
        }),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      }),
      theVehicleCartAsyncComponent: () => ({
        component: OmVehicleCart().then((component) => {
          this.isVehicleCartLoaded = true;
          return component;
        }),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      }),
      theLocationCartAsyncComponent: () => ({
        component: OmLocationCartCard().then((component) => {
          this.isLocationCartOpen = true;
          return component;
        }),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.ui.sidebar
    }),
    currentComponent () {
      switch (this.sidebar.type) {
        case 'microcart':
          return this.theMicrocartAsyncComponent
        case 'vehiclecart':
          return this.theVehicleCartAsyncComponent
        case 'locationcart':
          return this.theLocationCartAsyncComponent
      }
    }
  },
  methods: {
    reloadComponent () {
      switch (this.sidebar.type) {
        case 'microcart':
          this.theMicrocartAsyncComponent = () => ({
            component: OMicrocartPanel().then((component) => {
              this.isMicrocartComponentLoaded = true;
              return component;
            }),
            loading: ALoadingSpinner,
            error: ALoadingError,
            timeout: 3000
          })
          break;
        case 'vehiclecart':
          this.theVehicleCartAsyncComponent = () => ({
            component: OmVehicleCart().then((component) => {
              this.isVehicleCartLoaded = true;
              return component;
            }),
            loading: ALoadingSpinner,
            error: ALoadingError,
            timeout: 3000
          })
          break;
        case 'locationcart':
          this.theLocationCartAsyncComponent = () => ({
            component: OmVehicleCart().then((component) => {
              this.isLocationCartOpen = true;
              return component;
            }),
            loading: ALoadingSpinner,
            error: ALoadingError,
            timeout: 3000
          })
          break;
      }
    }
  }
};
</script>
