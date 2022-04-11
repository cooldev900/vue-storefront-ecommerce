<template>
  <div class="om-panzoom">
    <div class="om-panzoom__command">
      <button @click="zoom(1)">
        ZoomIn
      </button>
      <button @click="zoom(-1)">
        ZoomOut
      </button>
      <button @click="reset()">
        Reset
      </button>
      <input
        class="desktop-only range-input"
        type="range"
        :min="rangeMin"
        :max="rangeMax"
        step="0.1"
        v-model="range"
        @change="setZoom"
      >
    </div>
    <div class="om-panzoom__container" @wheel.prevent="wheel">
      <div :id="`panzoom-element-${domKey}`" @dblclick="zoom(1)">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import Panzoom from '@panzoom/panzoom';
import { SfButton } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'OmPanZoom',
  components: { SfButton },
  props: {
    options: { type: Object, default: () => {} }, // default option + withCommand: boolean,
    showOpenModalButton: { type: Boolean, default: false },
    visualGroup: { type: [String, Number], default: '' },
    domKey: { type: String, default: 'modal' }, // modal or product
    imageCode: { type: [String, Number], default: '' }
  },
  data () {
    return {
      range: 1,
      panStatus: true,
      defaultOption: {
        animate: true,
        canvas: true,
        maxScale: 2,
        minScale: 0.5
      },
      instance: null
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      tooltips: 'vehicles/tooltips'
    }),
    shouldShowOpenModalButton () {
      return this.showOpenModalButton && this.activeVehicle.national_code && this.visualGroup;
    },
    rangeMax () {
      return this.options.maxScale || this.defaultOption.maxScale;
    },
    rangeMin () {
      return this.options.minScale || this.defaultOption.minScale;
    }
  },
  mounted () {
    const elem = document.getElementById('panzoom-element-' + this.domKey)
    this.instance = Panzoom(elem, { ...this.defaultOption, ...this.options });
    this.instance.reset();
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal'
    }),
    zoom (level) {
      level === -1 ? this.instance.zoomOut() : this.instance.zoomIn();
      this.range = this.instance.getScale();
    },
    reset () {
      this.instance.reset();
      this.range = 1;
    },
    wheel (event) {
      this.instance.zoomWithWheel(event)
      this.range = this.instance.getScale();
    },
    setZoom () {
      this.instance.zoom(this.range, { animate: true });
    },
    changePanStatus () {
      this.instance.setOptions({ ...this.defaultOption, ...this.options, disablePan: !this.panStatus })
    },
    openSvgViewer () {
      const tooltip = this.tooltips.find(tooltip => +tooltip.calloutNumber === +this.imageCode)
      if (tooltip) {
        this.openModal({
          name: ModalList.OmVehicleViewerModal,
          payload: { tooltip }
        });
      } else {
        this.openModal({
          name: ModalList.OmVehicleViewerModal,
          payload: { tooltip: null }
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-panzoom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  background: #f9f9f9;
  &__command {
    position: absolute;
    bottom: 15px;
    z-index: 1;
    display: flex;
    gap: 7px;
    flex-direction: row;
    @include for-mobile{
      right: 15px;
      flex-direction: column;
    }
  }

  &__container {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .show-modal {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>
