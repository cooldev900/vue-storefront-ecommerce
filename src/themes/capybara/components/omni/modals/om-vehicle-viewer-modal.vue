<template>
  <div class="om-vehicle-viewer-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <div v-if="isVisible" class="om-vehicle-viewer-modal__content">
        <OmVehicleSvgViewer
          :tooltip="modalData.payload.tooltip"
        />
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal } from '@storefront-ui/vue';
import OmVehicleSvgViewer from 'theme/components/omni/om-vehicle-svg-viewer.vue';
import { mapGetters } from 'vuex';
import config from 'config';
import axios from 'axios';

export default {
  name: 'OmVehicleViewerModal',
  components: { SfModal, OmVehicleSvgViewer },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: '',
        payload: {
          tooltip: null
        }
      }),
      required: true
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      currentProduct: 'product/getCurrentProduct',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    })
  },
  data () {
    return {};
  },
  methods: {
    async closeModal () {
      const visiualCategory = this.getAttributeLabelById('visual_group', this.currentProduct.visual_group[0]);
      const {
        data: {
          result: { tooltips }
        }
      } = await axios.post(`${config.api.url}/api/vehicle/tooltip`, {
        national_code: this.activeVehicle.national_code,
        VISUAL_CATEGORY: visiualCategory
      });
      this.$store.commit('vehicles/setTooltips', tooltips);

      const criterias = tooltips?.reduce((result, tooltip) => {
        if (tooltip.criteria) {
          const labels = result.map(r => r.label)

          if (!labels.includes(tooltip.criteria)) {
            result = [
              ...result,
              {
                code: tooltip.criteriaCode,
                label: tooltip.criteria,
                selected: false
              }
            ];
          }
        }

        return result;
      }, [])
      this.$store.commit('vehicles/setCriterias', criterias);
      this.$emit('close', this.modalData.name);
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
::v-deep.sf-modal__close {
  position: absolute;
  right: 0;
  z-index: 9;
  top: 0;
  background: #ccc;
  padding: 10px;
  font-size: 30px;
}
.om-vehicle-viewer-modal {
  overflow-y: auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
  }

  .sf-modal {
    &__container {
      width: calc(100vw - 85px) !important;
      height: calc(100vh - 45px) !important;
      @include for-mobile {
        width: 100vw !important;
        height: 100vh !important;
      }
    }

    &__content {
      height: 100%;
      padding: 0;
    }
  }
}
</style>
