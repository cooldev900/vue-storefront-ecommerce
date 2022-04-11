<template>
  <div class="om-vehicle-tooltips" id="vehicleTooltips">
    <SfLoader v-if="loading" loading="loading" class="loading-container" />
    <!-- <swiper :options="swiperOptions" class="carousel" @click-slide="onClick">
      <swiper-slide
        v-for="(tooltip, index) in tooltips"
        :key="index"
        class="om-vehicle-tooltips__tooltip"
        :class="{ 'active': activeTooltip.sku === tooltip.sku }"
      >
        <span class="om-vehicle-tooltips__tooltip-label">{{ tooltip.tooltip }}</span>
      </swiper-slide>
    </swiper> -->
    <!-- <div
      v-for="(tooltip, index) in tooltips"
      :key="index"
      class="om-vehicle-tooltips__tooltip"
      :class="{ 'active': activeTooltip.sku === tooltip.sku }"
      @click="onClick(tooltip)"
      @mouseover="onHover(tooltip)"
    >
      <span class="om-vehicle-tooltips__tooltip-label">{{ tooltip.tooltip }}</span>
    </div> -->
    <div
      v-for="(tooltip, index) in tooltips"
      :key="index"
      :id="`tooltipItem_${index}`"
      class="om-vehicle-tooltips__tooltip"
      :class="{ 'active': activeTooltip.calloutNumber === tooltip.calloutNumber && activeTooltip.sku === tooltip.sku }"
      @click="onClick(tooltip)"
    >
      <span class="om-vehicle-tooltips__tooltip-label">{{ tooltip.tooltip }}</span>
    </div>
    <div v-if="tooltips.length > 10" class="om-vehicle-tooltips_navigator left-navigator">
      <SfCircleIcon
        class="icon"
        icon="chevron_left"
        icon-size="20px"
        icon-color="white"
        @click="sliderMoveToLeft()"
      />
    </div>
    <div v-if="tooltips.length > 10" class="om-vehicle-tooltips_navigator right-navigator">
      <SfCircleIcon
        class="icon"
        icon="chevron_right"
        icon-size="20px"
        icon-color="white"
        @click="sliderMoveToRight()"
      />
    </div>
  </div>
</template>

<script>
import { SfLoader, SfCircleIcon } from '@storefront-ui/vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { mapGetters } from 'vuex';
import { SwiperSlide } from 'vue-awesome-swiper';
import i18n from '@vue-storefront/i18n';

const CARD_WIDTH = 177;

export default {
  name: 'OmVehicleTooltips',
  components: {
    SfLoader,
    SvgViewer,
    SwiperSlide,
    SfCircleIcon
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    imageId: {
      type: String,
      default: '718710710202'
    },
    activeTooltip: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 5,
        spaceBetween: 10,
        breakpoints: {
          768: {
            slidesPerView: 3
          },
          1200: {
            slidesPerView: 5
          }
        }
      },
      internalActiveTooltip: null
    }
  },
  watch: {
    activeTooltip: {
      deep: true,
      immediate: true,
      handler (tooltip) {
        if (tooltip && tooltip.calloutNumber && tooltip.sku && !this.internalActiveTooltip) {
          const index = this.tooltips.findIndex(t => t.calloutNumber === tooltip.calloutNumber && t.sku === tooltip.sku);
          let container = document.getElementById('vehicleTooltips');
          const currentItemLeft = document.getElementById('tooltipItem_' + index).offsetLeft;
          container.scrollTo({ top: 0, left: currentItemLeft - 180, behavior: 'smooth' });
        } else {
          if (!tooltip) {
            this.$store.dispatch(
              'notification/spawnNotification',
              {
                type: 'danger',
                message: 'There is no tooltip data.',
                action1: { label: i18n.t('OK') }
              },
              { root: true }
            );
          }
        }

        this.internalActiveTooltip = null;
      }
    }
  },
  computed: {
    ...mapGetters({
      tooltips: 'vehicles/tooltips'
    })
  },
  methods: {
    onClick (tooltip) {
      this.$emit('onClick', tooltip);
      this.internalActiveTooltip = tooltip;
    },
    sliderMoveToRight () {
      const container = document.getElementById('vehicleTooltips');
      const pageCardCount = Math.floor(container.offsetWidth / CARD_WIDTH);
      container.scrollTo({ top: 0, left: container.scrollLeft + CARD_WIDTH * pageCardCount, behavior: 'smooth' });
    },
    sliderMoveToLeft () {
      const container = document.getElementById('vehicleTooltips');
      const pageCardCount = Math.floor(container.offsetWidth / CARD_WIDTH);
      container.scrollTo({ top: 0, left: container.scrollLeft - CARD_WIDTH * pageCardCount, behavior: 'smooth' });
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-tooltips {
  overflow-y: auto;
  background-color: white;
  display: flex;
  padding: 0 10px;
  overflow-x: auto;

  &__tooltip {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    border: 1px solid green;
    border-radius: 10px;
    margin: 5px 15px;
    min-width: 125px;

    &.active {
      background-color: lightblue;
      transition: all .1s ease-in;
    }

    &:hover {
      cursor: pointer;
    }

    &-label {
      min-width: fit-content;
    }
  }

  &_navigator {
    position: absolute;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &.left-navigator {
      left: 0;
    }

    &.right-navigator {
      right: 0;
    }
  }

  .svg-container {
    min-width: 50px;
    min-height: 50px;
    display: inline-block;
  }
}
</style>
