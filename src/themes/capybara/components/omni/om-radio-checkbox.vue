<template>
  <div class="om-radio-checkbox">
    <SfRadio
      v-for="item in radioItems"
      :key="item.value"
      :name="item.title"
      :value="String(item.value)"
      :selected="selectedValue"
      @input="clickHandler(String(item.value))"
      :class="{'selected': selectedValue === String(item.value)}"
    >
      <template #label>
        <div class="label-wrapper">
          <h4>{{ item.title }}</h4>
        </div>
      </template>

      <template #details>
        <div class="details-wrapper">
          <div class="details-wrapper__text">
            {{ item.description }}
          </div>
        </div>
      </template>

      <template #description>
        <div class="description-wrapper">
          <div class="description-wrapper__text">
            <span v-if="item.value === false">
              Free
            </span>
            <span v-else>{{ price | price }}</span>
          </div>
        </div>
      </template>
    </SfRadio>
  </div>
</template>

<script>
import { SfRadio } from '@storefront-ui/vue';

export default {
  name: 'OmRadioCheckbox',
  components: {
    SfRadio
  },
  props: {
    items: {
      type: Array,
      /** should be 2 items for true or false
       *  [{
       *    value: true,
       *    title: string,
       *    description: string,
       *    price: number
       * }]
      */
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      radioItems: [],
      selectedValue: 'false'
    }
  },
  watch: {
    items: {
      required: true,
      immediate: true,
      handler: function (value) {
        this.radioItems = value;
      }
    },
    value: {
      required: true,
      immediate: true,
      handler: function (value) {
        this.selectedValue = String(value);
      }
    }
  },
  methods: {
    clickHandler (value) {
      this.selectedValue = value;

      this.$emit('input', value === 'true')

      this.$emit('change');
    }
  }
}
</script>

<style lang="scss">
.om-radio-checkbox {
  display: flex;
  gap: var(--spacer-sm);
  width: 100%;

  .sf-radio {
    background: white;
    margin: calc(var(--spacer-sm) * 0.3) 0;
    padding: var(--spacer-xs) var(--spacer-sm);
    border-radius: var(--border-radius);
    width: 100%;
    border: 1px solid #ccc;
    &.is-disabled {
      .label-wrapper {
        color: #bfbfbf;
        .om-add-cart-step2__location_name {
          color: #bfbfbf;
        }
      }
    }

    &.selected {
      border: 1px solid;
      background: #005a2b !important;
    }
  }
  .label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      text-transform: none;
      margin: var(--spacer-sm) 0;
    }

    .label-price {
      font-weight: 600;
      font-size: 20px;
      color: var(--add-cart-step-text-color);
    }
  }

  .details-wrapper {
    margin-bottom: var(--spacer-sm);
    color: var(--add-cart-step-text-color);

    &__text {
      margin-bottom: var(--spacer-xs);
    }
  }

  .description-wrapper {
    margin-bottom: var(--spacer-sm);

    &__text {
      margin-bottom: var(--spacer-xs);
    }

    &__option {
      a {
        text-decoration: underline;
      }
    }
  }

  &__location_name {
    color: var(--_c-red-primary-lighten);
  }
}

::v-deep {
  --radio-container-align-items: center;
  .sf-radio--is-active {
    background: transparent;
  }
}
</style>
