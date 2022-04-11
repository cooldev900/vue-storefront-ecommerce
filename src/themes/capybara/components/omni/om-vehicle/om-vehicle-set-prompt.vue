<template>
  <transition name="slide-bottom" mode="out-in">
    <div v-if="open && enableShow" class="om-vehicle-set-prompt">
      <div class="content">
        <div class="vehicle-name">
          {{ vehicleName }}
        </div>
        <span class="divider">|</span>
        <SfButton @click="onClick" class="sf-button color-primary om-btn--primary search-button">
          {{ $t('My Vehicles') }}
        </SfButton>
      </div>
    </div>
  </transition>
</template>
<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals';
export default {
  name: 'OmVehicleSetPrompt',
  components: { SfIcon, SfButton },
  data () {
    return {
      open: true
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode',
      isSidebarOpen: 'ui/isSidebarOpen',
      activeModals: 'ui/activeModals',
      getCurrentCategory: 'category-next/getCurrentCategory'
    }),
    vehicleName () {
      return `${this.activeVehicle?.Model || 'Select your Vehicle to find accessories'}`
    },
    enableShow () {
      const isNotProductPage = this.$route.meta.breadcrumb === 'Home' || this.$route.meta.breadcrumb === 'Category'
      const isStaticCategoryPage = this.getCurrentCategory?.page_layout && this.getCurrentCategory?.page_layout === 'category-full-width'
      return isNotProductPage && !isStaticCategoryPage
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    onClick () {
      if (this.activeVehicle?.level1) {
        this.openVehicleCart({ type: 'vehiclecart' })
      } else {
        this.openModal({
          name: ModalList.OmSelectorModal
        });
      }
    }
  },
  watch: {
    isSidebarOpen (status) {
      this.open = !status
    },
    activeModals (modals) {
      this.open = !modals.length
    }
  }
};
</script>
<style lang="scss" scoped>
.om-vehicle-set-prompt {
  z-index: 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -1px 8px 0 rgba(0,0,0,0.4);
  background-color: #fff;
  color: black;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    .vehicle-name {
      font-weight: bold;
    }
    .divider {
      margin: 0 30px;
    }
    .sf-button {
      padding: 13px 21px;
    }
  }
}
</style>
