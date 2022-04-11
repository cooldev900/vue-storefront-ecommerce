<template>
  <div class="m-menu sf-mega-menu">
    <SfMegaMenu
      :title="categoryTitle || currentCategoryTitle"
      :visible="visible"
    >
      <SfMegaMenuColumn :title="categoryTitle">
        <SfList>
          <SfListItem
            v-for="categoryItem in subCategory"
            :key="categoryItem._uid"
            @click.native="setCurrentCategory(categoryItem)"
          >
            <SfMenuItem v-if="categoryItem.tier_3_linked.length" :label="categoryItem.tier_2_name" />
            <router-link
              v-else
              :to="categoryItem.tier_2_link.url"
              @click.native="$emit('close')"
            >
              <SfMenuItem :label="categoryItem.tier_2_name" />
            </router-link>
          </SfListItem>
        </SfList>
      </SfMegaMenuColumn>
      <div class="nav-tier-3" :class="{ 'active': currentCategory }">
        <div class="b" v-if="currentCategory">
        <SfList>
          <SfListItem
            v-for="categoryItem in currentCategory.tier_3_linked"
            :key="categoryItem._uid"
          >
            <router-link
              :to="categoryItem.tier_3_link_url.url"
              @click.native="$emit('close')"
            >
              <SfMenuItem :label="categoryItem.tier_3_link_title" />
            </router-link>
          </SfListItem>
        </SfList>
      </div>
      </div>
      <template #aside>
        <div class="aside-menu">
          <router-link :to="promoInfo.link" @click.native="$emit('close')">
            <OmCardNav :info="promoInfo" />
          </router-link>
        </div>
      </template>
    </SfMegaMenu>
  </div>
</template>
<script>
import { SfMegaMenu, SfList, SfMenuItem, SfBanner } from '@storefront-ui/vue';
import { mapGetters, mapState } from 'vuex';
import { checkWebpSupport } from 'theme/helpers';
import OmCardNav from 'theme/components/omni/navigation/om-navigation-card.vue';

export default {
  components: { SfMegaMenu, SfList, SfMenuItem, SfBanner, OmCardNav },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    category: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    visible (value) {
      this.currentCategory = null;
    }
  },
  computed: {
    ...mapState({
      isWebpSupported: (state) => state.ui.isWebpSupported
    }),
    ...mapGetters({
      getCategories: 'category/getCategories',
      getCurrentCategory: 'category/getCurrentCategory',
      getPromotedOffers: 'promoted/getPromotedOffers'
    }),
    currentCategoryTitle () {
      return this.getCurrentCategory.name || '';
    },
    banners () {
      return checkWebpSupport(
        this.getPromotedOffers.menuAsideBanners,
        this.isWebpSupported
      );
    },
    categoryTitle () {
      return this.category && this.category.navigation_level_1_title
        ? this.category.navigation_level_1_title
        : '';
    },
    subCategory () {
      return this.category && this.category.level_1
        ? this.category.level_1
        : [];
    },
    promoInfo () {
      if (this.category && this.category.navigation_level_1_promo_title) {
        return {
          text: this.category.navigation_level_1_promo_copy,
          imgUrl: this.category.navigation_level_1_promo_image.filename,
          link: this.category.navigation_level_1_promo_link.url,
          title: this.category.navigation_level_1_promo_title,
          link_title: this.category.navigation_level_1_promo_link_title,
          id: this.category._uid
        };
      } else {
        return {
          copy: '',
          image: {
            filename: ''
          },
          link: {
            url: '/'
          },
          title: '',
          link_title: '',
          id: ''
        };
      }
    }
  },
  methods: {
    setCurrentCategory (category) {
      this.currentCategory = category;
    }
  },
  data () {
    return {
      currentCategory: null
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.m-menu {
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
}
.sf-mega-menu{
    background-color: var(--c-mm-background);
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
::v-deep .sf-mega-menu__content{
    max-width: 100%;
    padding: 0;
    border-top: 1px solid #ccc;
}
::v-deep .sf-mega-menu-column{
  background: #fff;
  width: 300px;
  z-index: 1;
  box-shadow: 1px 0 4px 0 rgba(1,1,1,0.1);
padding: 20px;
overflow: visible;
position: relative;
}
.nav-tier-3{
  width: 300px;
  transform: translateX(0);
  transition: transform .4s cubic-bezier(.2,0,.2,1);
  position: absolute;
  background: #fff;
  top: 0;
  left: 40px;
  bottom: 0;
}
.nav-tier-3.active{
transform: translateX(300px);
}
</style>
