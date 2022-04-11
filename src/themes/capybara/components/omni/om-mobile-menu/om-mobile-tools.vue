<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon mobile-only"
    @click="goToMenu"
  >
    <div :class="['sf-header__custom-icon', menuStyle]">
      <i class="icon-burger-menu" />
    </div>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'OmMobileTools',
  components: { SfIcon, SfButton },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isMobileMenu: state => state.ui.isMobileMenu
    })
  },
  methods: {
    goToMenu () {
      this.$store.commit('ui/setSearchpanel', false)
      this.isMobileMenu
        ? this.$store.commit('ui/closeMenu')
        : this.$store.commit('ui/openMenu')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-header__custom-icon{
font-size: 48px;
color: #0c121c;
line-height: 48px;
  &.navigation-transparent{
    color: #ffffff;
  }
}
</style>
