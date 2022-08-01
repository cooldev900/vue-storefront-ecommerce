<template>
  <div class="o-header" :class="navigationItemColors">
    <SfOverlay
      class="overlay"
      :visible="isHoveredMenu || isSearchPanelVisible || isMobileMenu"
      @click="$store.commit('ui/setSearchpanel', false)"
    />
    <SfHeader
      :active-icon="activeIcon"
      :class="{
        'sf-header--has-mobile-search': isSearchPanelVisible,
        'sf-header--is-sticky': isSearchPanelVisible,
      }"
      :style="{ 'z-index': isHoveredMenu ? 2 : 1}"
    >
      <template #navigation>
        <SfHeaderNavigationItem
          v-for="category in _categories"
          :key="category._uid"
          class="navigation-link"
          @mouseover="triggerSubMenu(category)"
          @mouseleave="isHoveredMenu = false"
        >
          <router-link
            :to="category.navigation_level_1_link.url"
          >
            {{ category.navigation_level_1_title }}
          </router-link>
          <MMenu
            v-if="!category.navigation_level_1_link.url"
            :visible="isHoveredMenu && !isSearchPanelVisible"
            :category="category"
            @close="isHoveredMenu = false"
          />
        </SfHeaderNavigationItem>
      </template>
      <template #header-icons>
        <ACartIconMobile class="mobile-only mobile-icon__cart" :menu-style="navigationItemColors" />
        <div class="sf-header__icons">
          <OmLanguageIcon class="sf-header__action" :menu-style="navigationItemColors" />
          <AAccountIcon class="sf-header__action desktop-only" :menu-style="navigationItemColors" />
          <AMicrocartIcon class="sf-header__action" :menu-style="navigationItemColors" />
        </div>
      </template>
      <template #logo>
        <div @click="showMobileMenu = true" class="sf-header__action mobile-icon__burger mobile-only">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               width="25" height="25"
               viewBox="0 0 30 30"
               style=" fill:#fff;"
          ><path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z" /></svg>
        </div>
        <div class="mobile-icon__search mobile-only search-icon" @click="$store.commit('ui/setSearchpanel', true)" :class="[{
          'sf-header__icon--is-active': isLoggedIn
        }, menuStyle]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               width="25" height="25"
               viewBox="0 0 30 30"
               style=" fill:#fff;"
          ><path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" /></svg>
        </div>
        <ALogo :menu-style="navigationItemColors" />
        <a href="https://wa.me/message/WY4AEO7EDPQAA1" target="_blank" title="Whatsapp" class="sf-header__action mobile-icon__whatsapp mobile-only">
          <img src="/assets/whatsapp.png" width="22">
        </a>
      </template>
      <template #search>
        <div class="search-container">
          <OSearch :class="{ 'desktop-only': !isSearchPanelVisible }" />
          <SfButton
            v-if="isSearchPanelVisible"
            class="sf-button--text form__action-button form__action-button--secondary mobile-only"
            @click="$store.commit('ui/setSearchpanel', false)"
          >
            {{ $t("Cancel") }}
          </SfButton>
        </div>
      </template>
    </SfHeader>
    <OmMobileMenu
      class="mobile-only"
      :category="_categories"
      :visible="showMobileMenu"
      @close="showMobileMenu = false"
    />
    <div class="compact-layout">
      <OmHeaderStatus />
    </div>
  </div>
</template>
<script>
import {
  SfHeader,
  SfOverlay,
  SfButton,
  SfIcon
} from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import ALogoGroup from 'theme/components/atoms/a-logo-group';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import { mapState, mapGetters } from 'vuex';
import OmMobileMenu from 'theme/components/omni/om-mobile-menu/index.vue';
import MMenu from 'theme/components/molecules/m-menu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import { getTopLevelCategories } from 'theme/helpers';
import OmHeaderStatus from 'theme/components/omni/om-header-status.vue';
import OmVehicleIcon from 'theme/components/omni/icons/om-vehicle-icon.vue';
import OmLanguageIcon from 'theme/components/omni/icons/om-language-icon.vue';
import OmMobileTools from 'theme/components/omni/om-mobile-menu/om-mobile-tools';
import OSearch from 'theme/components/organisms/o-search';
import OTopBar from 'theme/components/organisms/o-top-bar';
import ACartIconMobile from 'theme/components/atoms/a-cart-icon-mobile'

export default {
  name: 'OHeader',
  components: {
    SfHeader,
    SfIcon,
    SfButton,
    SfOverlay,
    ALogo,
    ALogoGroup,
    AAccountIcon,
    AMicrocartIcon,
    MMenu,
    OmMobileMenu,
    OmHeaderStatus,
    OmVehicleIcon,
    OmLanguageIcon,
    OmMobileTools,
    OSearch,
    OTopBar,
    ACartIconMobile
  },
  data () {
    return {
      isHoveredMenu: false,
      clickedNavItemUId: 0,
      showMobileMenu: false
    };
  },
  computed: {
    ...mapState({
      isSearchPanelVisible: (state) => state.ui.searchpanel
    }),
    ...mapState('ui', ['isMobileMenu']),
    ...mapGetters('category', ['getCategories', 'getCurrentCategory']),
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('vehicles', ['globalSbData']),
    activeIcon () {
      return this.isLoggedIn ? 'account' : '';
    },
    categories () {
      return getTopLevelCategories(this.getCategories);
    },
    _categories () {
      if (this.globalSbData) {
        return this.globalSbData?.header_links[0].navigation_items
      } else {
        return []
      }
    },
    navigationItemColors () {
    }
  },
  methods: {
    categoryLink (category) {
      return formatCategoryLink(category);
    },
    isCategoryActive (category) {
      return this.getCurrentCategory.path
        ? this.getCurrentCategory.path.startsWith(category.path)
        : false;
    },
    navigationItemClick (category) {
      if (this.isHoveredMenu) {
        this.isHoveredMenu = false;
        this.clickedNavItemUId = null;
      } else {
        this.isHoveredMenu = true;
        this.clickedNavItemUId = category._uid;
      }
    },
    closeMenu () {
      this.isHoveredMenu = false;
    }
  },
  watch: {
    async showMobileMenu (value) {
      console.log(value, 'isMobileMenu')
      if (value) {
        // we can't add this style to body because sfui also add/remove overflow to body and there may be conflict
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.router-link-active{
  color: var(--c-primary) !important;
}
.sf-header-navigation-item {
  a {
    font-size: var(--nav-font-size);
    font-family: var(--font-family-navigation);
    font-weight: var(--nav-font-weight);
    text-transform: var(--nav-font-transform);
    color: #fff;
    border-bottom: 0;
     @media (min-width: 1px) and (max-width: 1350px) {
      font-size: 11px;
      padding-left: 8px;
      padding-right: 8px;
     }
    &:hover {
    color: var(--c-primary);
    border-color: transparent;
       }
    &:focus{
      border-color: transparent;
    }
  }
  &::after {
    bottom: 0;
    width: 0;
  }
  &:hover {
   border: none;
  }
  &.navigation-transparent{
    a {
      color: #fff;
    }
  }
}
.overlay {
  position: absolute;
  z-index: 1;
}
.o-header {
  --header-navigation-item-margin: 0 0 0 0;
  box-sizing: border-box;
  &.navigation-transparent{
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
  }
  a {
    &.active {
      font-weight: bold;
    }
  }
  .search-container {
    .o-search {
      flex-grow: 1;
    }
    @include for-mobile {
      .sf-button {
        margin: 0 0 0 var(--spacer-sm);
      }
    }
  }
  @include for-mobile {
    .mobile-menu {
      position: fixed;
      opacity: 1;
      visibility: visible;
      top: 0;
      z-index: 1;
      width: 90%;
      max-width: 400px;
      --mega-menu-aside-menu-height: calc(
        100vh - var(--bottom-navigation-height) - var(--bar-height)
      );
    }
  }
}
::v-deep .sf-header__actions{
  height: 100%;
  flex: 1;
@include for-mobile{
  flex: initial;
}
}
.sf-header {
  @include for-mobile {
    &__icons {

    }
  }
  @include for-desktop {
    &__icons {
      display: flex;
    }
  }
}
.compact-layout {
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.mobile-icon{
  &__cart{
    position: absolute;
    right: 18px;
    transform: translateY(-50%);
    top: 50%;
  }
  &__burger{
    display: flex;
    position: absolute;
    left: 15px;
    transform: translateY(-50%);
    top: 50%;
  }
  &__whatsapp{
    display: flex;
    position: absolute;
    right: 50px;
    transform: translateY(-50%);
    top: 50%;
  }
   &__search{
    display: flex;
    position: absolute;
    left: 50px;
    fill: #fff;
    transform: translateY(-50%);
    top: 50%;
  }
}
</style>
