<template>
  <div v-if="visible" class="om-mobile-menu">
    <SfSidebar
      title=""
      :visible="true"
    >
      <template #bar>
        <SfBar
          close
          :back="isLevel2"
          @click:back="back"
          @click:close="close"
        >
          <template #title>
            <div v-if="isLevel2">
              {{ selectLevel1Category }}
            </div>
          </template>
        </SfBar>
      </template>

      <div class="content">
        <SfList>
          <transition-group name="fade" mode="out-in">
            <SfListItem
              v-for="categoryItem in _category"
              :key="categoryItem._uid"
            >
              <SfMenuItem
                :label="getLabel(categoryItem)"
                @click="onClickItem(categoryItem)"
              />
            </SfListItem>
          </transition-group>
        </SfList>
      </div>
      <SfButton
        @click="goto"
        class="sf-button--pure om-vehicle-icon navigation-icon lang-switcher"
      >
        <span>{{ $t('Language') }}</span>
      </SfButton>
      <SfButton
        @click="goToAccount"
        class="sf-button--pure om-vehicle-icon navigation-icon mobile-my-account"
      >
        <span>{{ $t('Account') }}</span>
      </SfButton>
    </SfSidebar>
  </div>
</template>

<script>
import {
  SfMegaMenu,
  SfList,
  SfMenuItem,
  SfIcon,
  SfBar,
  SfSidebar,
  SfImage
} from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OmMobileMenu',
  components: {
    SfMegaMenu,
    SfList,
    SfMenuItem,
    SfIcon,
    SfBar,
    SfSidebar,
    SfImage
  },
  props: {
    category: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    isLevel2 () {
      return !!this.subCategory.length;
    },
    storeId () {
      return currentStoreView().storeId;
    },
    _category () {
      if (!this.isLevel2) {
        return this.category;
      } else {
        return this.subCategory;
      }
    }
  },
  data () {
    return {
      subCategory: [],
      selectLevel1Category: ''
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    close () {
      this.$emit('close');
    },
    goto () {
      if (this.storeId === 3) {
        location.href = '/';
      } else {
        location.href = '/ar/';
      }
    },
    goToAccount () {
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'));
        this.$emit('close');
      } else {
        this.openModal({ name: ModalList.Auth, payload: 'login' });
        this.$emit('close');
      }
    },
    onClickItem (item) {
      if (item.show_dropdown !== 'no') {
        if (!this.isLevel2) {
          this.subCategory = item.level_1;
          this.selectLevel1Category = item.navigation_level_1_title;
        } else {
          this.$router.push(item.tier_2_link.url);
          this.subCategory = [];
          this.selectLevel1Category = '';
          this.$emit('close');
        }
      } else {
        this.$router.push(item.level_1[0].tier_2_link.url);
        this.$emit('close');
      }
    },
    getLabel (item) {
      if (!this.isLevel2) {
        return item.navigation_level_1_title;
      } else {
        return item.tier_2_name;
      }
    },
    back () {
      this.subCategory = []
    }
  }
}
</script>

<style lang="scss">
.om-mobile-menu {

  .sf-sidebar__content {
    padding: 0 !important;
    background: #f4f4f4;
  }
  .mobile-logo{
    width: 40px;
    height: 40px;
  }
  .sf-bar {
    padding: 15px 20px;
    color: #fff;
    height: auto;
    min-height: 40px;
    font-size: 16px;
    font-weight: 700;
    font-family: var(--font-family-primary);
    background: #000;
    .sf-icon{
      svg{
        fill: #fff;
      }
    }
  }
  .sf-bar__icon{
   color: #fff;
   --button-color: #fff;
  }

  .content {
    padding: 0 var(--spacer-xl);
    box-shadow: 0 4px 8px 1px rgba(0,0,0,0.1);

    .sf-menu-item {
      font-size: 20px;
      min-height: 56px;
      margin: var(--spacer-sm) 0;
    }
  }
}
.lang-switcher{
  background: white;
    padding: 20px 40px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    text-align: center;
}
.mobile-my-account{
  background: white;
    padding: 20px 40px;
    border-bottom: 1px solid #ccc;
    text-align: center;
}
</style>
