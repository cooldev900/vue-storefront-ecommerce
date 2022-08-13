<template>
  <div ref="range" type="range" class="sf-range" :disabled="disabled">
    <slot v-bind="$attrs" />
  </div>
</template>
<script>
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
export default {
  name: "SfRange",
  props: {
    /*
     * Sets the starting values for slider(s), if only one number is given than only one slider appears
     */
    value: {
      type: Array,
      default: () => [0, 1],
    },
    /*
     * Disabling the slider
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /*
     * Settings for noUiSlider library
     */
    config: {
      type: Object,
      default: () => {
        return {
          start: [0, 1],
          range: {
            min: 0,
            max: 10,
          },
          step: 1,
        };
      },
    },
  },
  watch: {
    config: {
      handler(newConfig) {
        if (this.$refs && this.$refs.range && this.$refs.range.noUiSlider) {
          this.$refs.range.noUiSlider.destroy();
          const newSlider = this.noUiSliderInit(newConfig);
          return newSlider;
        }
      },
      deep: true,
    },
    value: {
      handler(values) {
        if (this.$refs && this.$refs.range && this.$refs.range.noUiSlider) {
          return this.$refs.range.noUiSlider.set(values);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.noUiSliderInit(this.config);
  },
  beforeDestroy() {
    if (this.$refs && this.$refs.range && this.$refs.range.noUiSlider) {
      this.$refs.range.noUiSlider.destroy();
    }
  },
  methods: {
    noUiSliderInit(config) {
      const configSettings = Object.assign(this.config, config);
      noUiSlider
        .create(this.$refs.range, configSettings)
        .on("change", (values) => {
          this.$emit("change", values);
        });
    },
  },
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers";

.sf-range { 
  padding-left: 15px;
  position: relative;
  width: 100%;
  height: 7px;
  margin: var(--spacer-xl);
  background-color: var(--c-light);
  border: none;
  box-shadow: none;
  .noUi {
    &-handle {
      width: 33px;
      height: 33px;
      border-radius: 50%;
      transform: translate3d(0, -20%, 0);
      box-shadow: none;
      @include border(--range-handle-border, 1px, solid, var(--c-primary));
      background-color: var(--c-white);
      &::before,
      &::after {
        display: none;
      }
      &:focus {
        outline: none;
      }
      &.noUi-active .noUi-touch-area {
        background-color:  var(--c-primary);
      }
    }
    &-connect {
      background-color: var(--c-primary);
    }
    &-touch-area {
      background-color: var(--c-white);
      border-radius: 50%;
      &:hover {
        background-color: var(--c-primary-variant);
      }
    }
    &-tooltip {
      bottom: -120%;
      color: var(--c-secondary-variant);
      @include font(
        --range-tooltip-font,
        var(--font-weight--normal),
        var(--font-size--xs),
        1.2,
        (--font-family--secondary)
      );
      @include border(--range-tooltip-border, 0, none, var(--c-primary));
    }
  }
  &[disabled="disabled"] {
    .noUi {
      &-handle {
        border-color: var(--c-text-disabled);
      }
      &-connect {
        background-color: var(--c-text-disabled);
      }
      &-touch-area:hover {
        background-color: var(--c-base);
      }
      &-tooltip {
        display: none;
      }
    }
  }
}
.noUi-vertical {
  height: 300px;
  width: 7px;
  .noUi-handle {
    transform: translate3d(20%, 0, 0);  
  }
}
.noUi-txt-dir-rtl.noUi-horizontal {
  .noUi-handle {
    left: 0 !important;
    right: 0 !important;
  }
}

// .noUi-tooltip:nth-child(2) {
//   top: -120%;
//   bottom: 0;
// }
</style>