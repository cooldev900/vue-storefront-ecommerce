<template>
  <div class="vehicle-page">
    <SfSticky>
      <div class="vehicle-page__holder">
        <ul class="vehicle-page__holder-content">
          <li
            v-for="(partItem, index) in partItems"
            :key="index"
            @click="clickParentPartItem(partItem)"
            :class="{'active': selectedParentPartItem.label === partItem.label}"
          >
            {{ partItem.label }}
          </li>
        </ul>
      </div>
    </SfSticky>
    <div class="vehicle-page__image">
      <div class="vehicle-page__image_menu">
        <transition name="fade">
          <ul v-show="selectedParentPartItem.child.length" class="vehicle-page__image_menu-item">
            <li
              v-for="(partItem, index) in selectedParentPartItem.child"
              :key="index"
              @click="clickPartItem(partItem)"
              :class="{'active': selectedPartItem.label === partItem.label}"
            >
              {{ partItem.label }}
            </li>
          </ul>
        </transition>
      </div>

      <div class="vehicle-page__image-svg">
        <OmPanZoom
          :options="{ minScale: 1, maxScale: 3 }"
          ref="panzoomInModal"
          dom-key="modal"
        >
          <SvgViewer
            :is-full-image="true"
            :image-id="imageId"
            :image-code="currentClickedTooltip && currentClickedTooltip.calloutNumber"
            :loaded-svg-data="fullSvgData"
            @loadSvg="loadSvg"
            dom-id="modal"
            @clickPartSvg="getProductBySku"
          />
        </OmPanZoom>
      </div>
    </div>

    <div class="vehicle-page__info">
      <transition name="slide-right" mode="out-in">
        <div class="vehicle-page__add-to-cart">
          <SfLoader
            :loading="productLoading"
            class="vehicle-page__add-to-cart-loading"
          >
            <div v-if="currentClickedTooltip && selectedProduct">
              <p class="vehicle-page__info-description">
                {{ productTitle }}
              </p>
              <SfPrice
                :regular="ProductPrice"
              />
              <SvgViewer
                :image-id="imageId"
                :image-code="`${imageId}_${currentClickedTooltip.calloutNumber}`"
                :width="200"
                :height="200"
                :dom-id="'details_' + currentClickedTooltip.calloutNumber"
                :is-full-image="false"
              />
              <MProductAddToCart
                class="vehicle-page__add-to-cart-content"
                :product="selectedProduct"
              />
            </div>
            <div v-if="!selectedProduct && currentClickedTooltip">
              <OmAlertBox type="info" message="This item is not currently available online." />
            </div>
            <div v-if="!currentClickedTooltip && !selectedProduct">
              <OmAlertBox type="info" message="No selected product." />
            </div>
          </SfLoader>
        </div>
      </transition>
    </div>
    <!-- <div class="vehicle-page__footer">
      <OmVehicleTooltips
        :loading="loading"
        :image-id="imageId"
        :active-tooltip="currentClickedTooltip"
        @onClick="clickTooltip"
      />
    </div> -->
  </div>
</template>

<script>
import NewVehicle from 'theme/components/omni/om-hero/new-vehicle.vue';
import OmVehicleTooltips from 'theme/components/omni/om-vehicle/om-vehicle-tooltips.vue';
import OmAlertBox from 'theme/components/omni/om-alert-box.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { SfImage, SfLoader, SfSticky, SfCheckbox, SfPrice } from '@storefront-ui/vue';
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
import MProductAddToCart from 'theme/components/molecules/m-product-add-to-cart';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import buildQuery from '@vue-storefront/core/modules/catalog/helpers/associatedProducts/buildQuery.ts';
import PartItems from 'theme/resource/partItems.json';
import config from 'config';

// TODO: clicked and hovered workflow should be removed
export default {
  name: 'OmVehicleSvgViewer',
  components: {
    NewVehicle,
    SfImage,
    SfLoader,
    SvgViewer,
    SfSticky,
    SfPrice,
    OmVehicleTooltips,
    MProductAddToCart,
    SfCheckbox,
    OmAlertBox
  },
  props: {
    tooltip: {
      validator: prop => prop === null || typeof prop === 'object'
    }
  },
  data () {
    return {
      imageId: null,
      loading: true,
      fullSvgData: null,
      stock: {
        isLoading: false,
        max: 0,
        manageQuantity: true
      },
      productLoading: false,
      showAddToCart: false,
      currentClickedTooltip: this.tooltip,
      selectedPartItem: PartItems[0]['child'][0],
      selectedParentPartItem: PartItems[0],
      partItems: PartItems,
      visualCategory: null,
      selectedProduct: null
    };
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode',
      currentProduct: 'product/getCurrentProduct',
      tooltips: 'vehicles/tooltips',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    description () {
      return `${this.activeVehicle?.level1 || ''} ${this.activeVehicle?.level2 || ''} ${this
        .vehicle?.level5 || ''} ${this.activeVehicle?.level6 || ''} ${this.activeVehicle
        ?.level7 || ''} ${this.activeVehicle?.level3 || ''}`;
    },
    brand () {
      return this.activeVehicle?.level1 || '';
    },
    regCode () {
      if (this.activeVehicle?.reg) {
        return this.activeVehicle?.reg;
      } else {
        return null;
      }
    },
    productTitle () {
      return this.selectedProduct ? this.selectedProduct.name : '';
    },
    ProductPrice () {
      return this.selectedProduct ? this.selectedProduct.price : '';
    }
  },
  methods: {
    // async clickTooltip (tooltip) {
    //   this.currentClickedTooltip = tooltip;

    //   await this.getProductBySku({ tooltip });
    // },
    async getProductBySku (tooltip) {
      if (tooltip) {
        this.currentClickedTooltip = tooltip;
        this.productLoading = true;
        const query = buildQuery([tooltip.sku]);

        const { items = [] } = await ProductService.getProducts({
          query,
          size: 1,
          configuration: { sku: tooltip.sku },
          options: {
            prefetchGroupProducts: true,
            assignProductConfiguration: true
          }
        });

        this.selectedProduct = items[0] || null;
        this.productLoading = false;
      }
    },
    clickParentPartItem (partItem) {
      const visiualCategory = this.getAttributeLabelById('visual_group', this.currentProduct.visual_group[0]);
      this.selectedParentPartItem = partItem;
      if (!partItem.value) {
        this.clickPartItem(partItem.child[0]);
      } else {
        this.visualCategory = partItem.value;
        this.currentClickedTooltip = null;
        this.selectedProduct = null;
        if (+partItem.value === +visiualCategory) {
          this.currentClickedTooltip = this.tooltip;
        }
      }
    },
    clickPartItem (partItem) {
      const visiualCategory = this.getAttributeLabelById('visual_group', this.currentProduct.visual_group[0]);
      this.currentClickedTooltip = null;
      this.selectedProduct = null;
      if (+partItem.value === +visiualCategory) {
        this.currentClickedTooltip = this.tooltip;
      }
      this.selectedPartItem = partItem;
      this.visualCategory = this.selectedPartItem.value;
    },
    async fetchTooltips () {
      this.showAddToCart = false;

      const {
        data: {
          result: { imageId, tooltips }
        }
      } = await axios.post(`${config.api.url}/api/vehicle/tooltip`, {
        national_code: this.activeVehicle.national_code,
        VISUAL_CATEGORY: this.visualCategory
      });

      this.imageId = imageId;
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
    },
    loadSvg (data) {
      this.fullSvgData = data;
    }
  },
  watch: {
    async visualCategory () {
      await this.fetchTooltips();
      this.$refs.panzoomInModal.reset();
    }
  },
  async mounted () {
    if (this.currentProduct.visual_group && this.currentProduct.visual_group.length) {
      this.visualCategory = this.getAttributeLabelById('visual_group', this.currentProduct.visual_group[0]);
      this.partItems.map(partItem => {
        if (partItem.child.length) {
          const childItem = partItem.child.find(item => +item.value === +this.visualCategory);
          if (childItem) {
            this.selectedParentPartItem = partItem;
            this.selectedPartItem = childItem;
          }
        } else {
          if (+partItem.value === +this.visualCategory) {
            this.selectedParentPartItem = partItem;
          }
        }
      })
    }
    await this.getProductBySku(this.currentClickedTooltip);
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.vehicle-page {
  // color: red;
  display: flex;
  flex-wrap: wrap;

  .sf-sticky {
    width: 100%;
    z-index: 1;
  }

  &__info {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: #fff;
    flex: 1;

    @include for-mobile {
      /* box-shadow: rgb(14 30 37 / 12%) 0px 2px 4px 0px, rgb(14 30 37 / 32%) 0px 2px 16px 0px; */
    }

    &-link {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .change-vehicle {
        color: #5959f7;
      }
    }

    h1 {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    &-description {
      margin-top: 0px;
      margin-bottom: 20px;
      font-size: 18px;
    }

    &-item {
      margin-top: 5px;
      margin-bottom: 5px;
      border: 1px solid #b3b3b3;
      padding: 5px;
    }
  }

  &__image {
    padding: 0 20px;
    background: #f9f9f9;
    width: 75%;
    @include for-mobile{
      width: 100%;
    }
    &-svg {
      display: flex;

      &_criterias {
        width: 400px;
        height: 500px;
        overflow-y: auto;

        .sf-checkbox {
          margin: 10px 0;
        }
      }

      span {
        margin-top: 30px;
      }
    }

    &_menu {
      min-height: 64px;
      display: flex;
      justify-content: center;

      &-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        padding: 0;
        list-style: none;

        li {
          padding: 5px 15px;
          background: var(--_c-green-primary);
          margin: 0 20px;
          border-radius: 20px;
          color: #fff;
          font-size: 12px;
          box-shadow: 0 3px 6px #a3a3a3;

          &:hover {
            cursor: pointer;
          }

          &.active {
            border-bottom: 3px solid #000;
            bottom: 0;
          }
        }
      }
    }

    img {
      width: 100%;
    }

    &-tooltip {
      height: 200px;
      background: var(--_c-green-primary);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &::after {
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        content: "";
        transform: rotate(90deg);
        position: absolute;
        border-top: 0;
        border-top: 31px solid var(--_c-green-primary);
        left: -45px;
      }
    }
  }

  &__register {
    margin-bottom: 24px;
  }

  &__holder {
    height: 70px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #ccc;

    &-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        padding: 0 30px;
        position: relative;
        height: calc(100% - 3px);
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          cursor: pointer;
        }

        &.active {
          border-bottom: 3px solid #000;
          bottom: 0;
        }
      }
    }
  }

  &__footer {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    right: 0;
    border-top: 1px solid #ccc;
    display: flex;
    align-items: center;
    background: #fff;

    &-title {
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #ccc;
      margin-right: 20px;
    }
  }

  &__add-to-cart {
    &-loading {
      min-height: 80px;
    }
  }
}
</style>
