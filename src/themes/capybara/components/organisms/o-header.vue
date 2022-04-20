<template>
  <div class="o-header" :class="navigationItemColors">
    <SfOverlay
      class="overlay"
      :visible="isHoveredMenu || isSearchPanelVisible"
      @click="$store.commit('ui/setSearchpanel', false)"
    />
    <SfHeader
      :active-icon="activeIcon"
      :class="{
        'sf-header--has-mobile-search': isSearchPanelVisible,
        'sf-header--is-sticky': isSearchPanelVisible,
      }"
      :style="{ 'z-index': isHoveredMenu ? 2 : 1 }"
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
        <div class="sf-header__icons">
          <OmMobileTools class="sf-header__action" :menu-style="navigationItemColors" />
          <OmLanguageIcon class="sf-header__action" :menu-style="navigationItemColors" />
          <AAccountIcon class="sf-header__action desktop-only" :menu-style="navigationItemColors" />
          <AMicrocartIcon class="sf-header__action" :menu-style="navigationItemColors" />
        </div>
      </template>
      <template #logo>
        <ALogo :menu-style="navigationItemColors" />
      </template>
    </SfHeader>
    <OmMobileMenu
      v-if="isMobileMenu"
      class="mobile-menu"
      :category="_categories"
      @close="$store.commit('ui/closeMenu')"
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
  SfButton
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

export default {
  name: 'OHeader',
  components: {
    SfHeader,
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
    OTopBar
  },
  data () {
    return {
      isHoveredMenu: false,
      clickedNavItemUId: 0
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
    async isMobileMenu (status) {
      if (this.isMobileMenu) {
        // we can't add this style to body because sfui also add/remove overflow to body and there may be conflict
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.sf-header-navigation-item {
  a {
    font-size: var(--nav-font-size);
    font-family: var(--font-family-navigation);
    font-weight: var(--nav-font-weight);
    text-transform: var(--nav-font-transform);
    color: #fff;
  }
  &::after {
    bottom: 0;
    width: 0;
  }
  &:hover {
    .m-menu {
      opacity: 1;
      visibility: visible;
    }
    &::after {
      width: 100%;
    }
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
      width: 100%;
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
      --mega-menu-aside-menu-height: calc(
        100vh - var(--bottom-navigation-height) - var(--bar-height)
      );
    }
  }
}
::v-deep .sf-header__actions{
  height: 100%;
  flex: 1;
}
.sf-header {
  @include for-mobile {
    &__icons {

    }
  }
  @include for-desktop {
    &__icons {
      display: flex;
      .sf-header__icon {
        cursor: pointer;
      }
    }
  }
}
.compact-layout {
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
::v-deep .sf-search-bar{
  display: none;
}
</style>
