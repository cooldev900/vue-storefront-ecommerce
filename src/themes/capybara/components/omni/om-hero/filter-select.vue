<template>
  <div class="filter-select">
    <SfButton
      class="color-light-variant button-wrapper"
      @click.stop="selectButtonHandler()"
    >
      <div class="button-wrapper">
        <span class="button-text">{{ title }}</span>
        <SfIcon
          v-if="dropdownData.showDropdown"
          icon="chevron_up"
          size="xxs"
          color="black"
          view-box="0 0 24 24"
          :coverage="1"
        />
        <SfIcon
          v-else
          icon="chevron_down"
          size="xxs"
          color="black"
          view-box="0 0 24 24"
          :coverage="1"
        />
      </div>
    </SfButton>
    <div
      class="filter-button-content"
      v-if="dropdownData.showDropdown"
      v-click-outside="closePopup"
    >
      <div v-if="!dropdownData.items.length" class="no-data">
        No data
      </div>
      <SfButton
        v-for="(item, i) in dropdownData.items"
        :key="i"
        @click.stop="onClickFilterItem(item)"
        class="color-light-variant"
      >
        <div class="button-wrapper filter-button">
          <span class="button-text">{{ item }}</span>
        </div>
      </SfButton>
    </div>
  </div>
</template>

<script>
import { SfButton, SfIcon } from '@storefront-ui/vue';

export default {
  components: {
    SfButton,
    SfIcon
  },
  props: {
    dropdownData: {
      type: Object,
      default: () => {}
    },
    dropdownIndex: {
      type: Number,
      default: 1
    }
  },
  computed: {
    title () {
      return this.dropdownTitle ? this.dropdownTitle : this.dropdownData.text
    }
  },
  data () {
    return {
      dropdownTitle: ''
    }
  },
  methods: {
    selectButtonHandler () {
      this.$emit('toggle-dropdown', this.dropdownIndex);
    },
    closePopup () {
      this.$emit('hide-dropdown');
    },
    onClickFilterItem (data) {
      this.dropdownTitle = data
      this.$emit('dropdown-item-click', data, this.dropdownIndex);
      this.$emit('toggle-dropdown', this.dropdownIndex + 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-select {
  .filter-button-content {
    position: absolute;
    z-index: 1;
    border: 1px solid #dedede;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    padding: 1.8rem 1rem;
    background: white;
    border-radius: var(--border-radius);
    margin-top: 10px;
    min-width: 200px;
    align-items: center;
    max-height: 150px;
    overflow-y: auto;
  }
  .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .sf-icon {
      margin-left: 1.5rem;
    }
    .button-text {
      font-size: 16px;
      font-weight: 400;
    }
    &.filter-button {
      margin-left: -1rem;
      .sf-icon {
        margin-left: 0;
      }
      .button-text {
        margin-left: 0.5rem;
      }
    }
  }
  .no-data {
    grid-column: 2;
  }
  .color-light-variant {
    width: 100%;
  }
}
</style>
