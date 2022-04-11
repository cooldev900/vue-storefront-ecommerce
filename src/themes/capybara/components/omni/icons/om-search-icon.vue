<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon"
    @click="goToMenu"
  >
    <div :class="['sf-header__custom-icon', menuStyle]">
      <i class="icon-search" />
    </div>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'OmSearchIcon',
  components: { SfIcon, SfButton },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isOpen: state => state.ui.searchpanel
    })
  },
  methods: {
    goToMenu () {
      this.$store.commit('ui/setSearchpanel', !this.isOpen)
      // this.$store.commit('ui/setSearchpanel', false)
      // this.isMobileMenu
      //   ? this.$store.commit('ui/closeMenu')
      //   : this.$store.commit('ui/openMenu')
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
