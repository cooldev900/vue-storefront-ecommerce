<template>
  <div class="om-mobile-menu sf-mega-menu">
    <SfBar
      :title="title"
      :back="!!selectedItems.length"
      class="mobile-only"
      close
      @click:close="closeMenu"
      @click:back="change('back')"
    />
    <SfList>
      <transition-group name="slide-left">
        <SfListItem v-for="item in currentItems" :key="item.id">
          <SfMenuItem
            @click="change('forward', item)"
            :label="item.title"
            :icon="item.level !== 3 ? 'chevron_right' : ''"
            class="sf-mega-menu__menu-item"
          />
        </SfListItem>
      </transition-group>
    </SfList>
  </div>
</template>

<script>
import {
  SfMegaMenu,
  SfList,
  SfMenuItem,
  SfBanner,
  SfFooter,
  SfIcon,
  SfBar
} from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { mapState } from 'vuex';

export default {
  name: 'OmMobileMenu',
  components: {
    SfMegaMenu,
    SfList,
    SfMenuItem,
    SfBanner,
    SfFooter,
    SfIcon,
    SfBar
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentItems: [],
      selectedItems: []
    }
  },
  computed: {
    ...mapState({
      isMobileMenu: state => state.ui.isMobileMenu
    }),
    title () {
      if (this.selectedItems.length) {
        return this.selectedItems[this.selectedItems.length - 1].title;
      }

      return '';
    }
  },
  methods: {
    change (direction, item = {}) {
      if (direction === 'forward') {
        this.selectedItems = [ ...this.selectedItems, { ...item, parent: this.currentItems } ];
        if (item.level === 1) {
          this.currentItems = item.children.map(child => ({
            id: child._uid,
            title: child.tier_2_name,
            children: child.tier_3_linked,
            link: child.tier_2_link.url,
            level: 2
          }));
        } else if (item.level === 2) {
          if (item.children.length) {
            this.currentItems = item.children.map(child => ({
              id: child._uid,
              title: child.tier_3_link_title,
              link: child.tier_3_link_url.url,
              level: 3
            }));
          } else {
            this.$router.push(localizedRoute(item.link));
            this.closeMenu();
          }
        } else if (item.level === 3) {
          this.$router.push(localizedRoute(item.link));
          this.closeMenu();
        }
      } else if (direction === 'back') {
        const prevLevel = this.selectedItems.pop();
        this.currentItems = prevLevel.parent;
      }
    },
    closeMenu () {
      this.$store.commit('ui/setSearchpanel', false)
      this.isMobileMenu
        ? this.$store.commit('ui/closeMenu')
        : this.$store.commit('ui/openMenu')
    }
  },
  watch: {
    category: {
      immediate: true,
      deep: true,
      handler (items) {
        this.currentItems = items.map(item => ({
          id: item._uid,
          title: item.navigation_level_1_title,
          children: item.level_1,
          level: 1
        }));
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-mobile-menu {
  padding: 0;
  position: absolute;
  left: 0;
  width: 100%;
  top: 100%;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s;
  .router-link-exact-active {
    --menu-item-font-weight: bold;
  }
  .sf-mega-menu{
    background-color: var(--c-mm-background);
  }
  .sf-mega-menu__content{
    max-width: 100%;
    padding: 40px;
    border-top: 1px solid #ddd;
    margin-top: 60px;
  }
  .sf-mega-menu-column__title{
    font-family: var(--font-family-bold);
    font-size: 18px;
      font-weight: 700;
      line-height: 18px;
      margin-bottom: 30px;
      letter-spacing: .8px;
      color: #0c121c;
  }
  .aside-menu {
    display: flex;
    justify-content: stretch;
    flex-wrap: wrap;
    @include for-desktop {
      justify-content: space-between;
    }
    &--promo-link {
      text-decoration: underline;
    }
  }
  .aside-banner {
    margin-bottom: var(--spacer-sm);
    text-transform: uppercase;
    --banner-height: 300px;
    &--mobile {
      display: none;
      @include for-mobile {
        display: block;
      }
    }
    &--desktop {
      --banner-width: 300px;
      display: none;
      margin: 0 var(--spacer-sm);
      @include for-desktop {
        display: block;
      }
    }
  }
  .tier2-list-item {
    display: flex;
    align-items: center;

    .sf-icon {
      margin-left: var(--spacer-sm);
    }
  }
}
</style>
