<template>
  <SfButton
    class="sf-button--pure a-microcart-icon"
    @click="goToCart"
  >
    <div :class="menuStyle"
         class="sf-header__custom-icon"
         :aria-label="$t('Open microcart')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
           width="25" height="25"
           viewBox="0 0 30 30"
           style=" fill:#fff;"
      >    <path d="M 2 2 A 1.0001 1.0001 0 1 0 2 4 L 3.8789062 4 C 4.1048086 4 4.2933102 4.1414634 4.3574219 4.359375 L 8.6191406 18.847656 C 8.993174 20.11937 10.169409 21 11.496094 21 L 22.472656 21 C 23.821072 21 25.011657 20.088693 25.367188 18.789062 L 27.964844 9.2636719 A 1.0001 1.0001 0 0 0 27 8 L 7.5136719 8 L 6.2773438 3.7949219 A 1.0001 1.0001 0 0 0 6.2753906 3.7949219 C 5.9634991 2.7348335 4.9830041 2 3.8789062 2 L 2 2 z M 12 23 A 2 2 0 0 0 10 25 A 2 2 0 0 0 12 27 A 2 2 0 0 0 14 25 A 2 2 0 0 0 12 23 z M 22 23 A 2 2 0 0 0 20 25 A 2 2 0 0 0 22 27 A 2 2 0 0 0 24 25 A 2 2 0 0 0 22 23 z" /></svg>
      <SfBadge v-show="!floatingIcon && totalQuantity" class="sf-icon__badge sf-badge--number">
        {{ totalQuantity }}
      </SfBadge>
    </div>
  </SfButton>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default {
  components: { SfIcon, SfButton, SfBadge },
  props: {
    floatingIcon: {
      type: Boolean,
      default: false
    },
    menuStyle: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleSidebar'
    }),
    goToCart () {
      this.$router.push(localizedRoute('/cart'));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-header__custom-icon{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    width: 25px;
    height: 25px;
    fill: #fff;
    position: relative;
  }
  &.navigation-transparent{
    color: #ffffff;
  }
}
::v-deep .sf-badge--number{
    --badge-background: var(--c-primary);
}
::v-deep .sf-icon__badge{
    position: absolute;
    top: -6px;
    right: -13px;
}

</style>
