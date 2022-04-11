<template>
  <div class="om-locator-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <div class="om-locator-modal__content">
        <OmLocationCartCard
          v-for="location in locations"
          :key="location.magento_code"
          :data="location"
          :brand="'hey'"
          @close="closeModal"
        />
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal } from '@storefront-ui/vue';
import OmLocationCartCard from 'theme/components/omni/om-location-cart/om-location-cart-card';
import Locations from 'theme/resource/locations.json';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OmLocatorsModal',
  components: { SfModal, OmLocationCartCard },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data () {
    return {
      showAllLocations: true
    }
  },
  computed: {
    locations () {
      if (this.showAllLocations) {
      //   return Locations['locations'].filter(location => {
      //     return location.brands.includes(this.currentProductBrand);
      //   });
      // } else {
        const { storeId } = currentStoreView();
        return Locations['locations'][storeId];
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>

<style lang="scss">
.om-locator-modal {
  overflow-y: auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
    max-height: 600px;
  }
}
</style>
