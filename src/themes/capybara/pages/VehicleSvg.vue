<template>
<div>
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
    <div class="vehicle-page__info">
      <!-- <div class="vehicle-page__image-tooltip">
        {{ currentHoverTooltip.tooltip }}
      </div> -->
      <transition name="slide-right" mode="out-in">
        <div v-if="showAddToCart" class="vehicle-page__add-to-cart">
          <SfLoader
            v-if="productLoading"
            loading="loading"
            class="vehicle-page__add-to-cart-loading"
          />
          <div v-else-if="!productLoading && product">
            <p class="vehicle-page__info-description">
              Product title: {{ productTitle }}
            </p>
            <SvgViewer
              :image-id="imageId"
              :image-code="currentClickedTooltip.calloutNumber"
              :width="100"
              :height="100"
              :dom-id="currentClickedTooltip.calloutNumber"
            />
            <MProductAddToCart
              class="vehicle-page__add-to-cart-content"
              :product="product"
              :stock="stock"
            />
          </div>
        </div>
      </transition>

      <h5>List View</h5>
      <div v-if="!loading && criterias.length" class="vehicle-page__image-svg_criterias">
        <SfCheckbox
          v-for="criteria in criterias"
          v-model="criteria.selected"
          :key="criteria.code"
          :label="criteria.label"
          :value="criteria.code"
        />
      </div>
    </div>
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
      <!-- <div class="vehicle-page__image-svg">
        <span v-if="!imageId && !loading">No data</span> -->
      <div class="vehicle-page__image-svg">
        <OmniPanZoom :options="{ minScale: 0.5, maxScale: 2 }">
          <SvgViewer
            :is-full-image="true"
            :image-id="imageId"
            dom-id="full"
            :hovered-image-code="hoveredSvgCode"
            :clicked-image-code="clickedSvgCode"
            @onClick="getProductBySku"
          />
        </OmniPanZoom>
      </div>
      <!-- </div> -->
    </div>
    <div class="vehicle-page__footer">
      <OmVehicleTooltips
        :loading="loading"
        :image-id="imageId"
        @onHover="hoverTooltip"
        @onClick="clickTooltip"
      />
    </div>
  </div>
<SbTeaseV2/>
</div>
</template>

<script>
import SbTeaseV2 from "theme/components/storyblok/sb-teaser-v2.vue";
import NewVehicle from 'theme/components/omni/om-hero/new-vehicle.vue';
import OmVehicleTooltips from 'theme/components/omni/om-vehicle/om-vehicle-tooltips.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { SfImage, SfLoader, SfSticky, SfCheckbox } from '@storefront-ui/vue';
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
import MProductAddToCart from 'theme/components/molecules/m-product-add-to-cart';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import buildQuery from '@vue-storefront/core/modules/catalog/helpers/associatedProducts/buildQuery.ts';
import PartItems from 'theme/resource/partItems.json';
import config from 'config';

export default {
  name: 'VehicleHero',
  components: {
    NewVehicle,
    SfImage,
    SfLoader,
    SvgViewer,
    SfSticky,
    OmVehicleTooltips,
    MProductAddToCart,
    SfCheckbox,
    SbTeaseV2
  },
  data () {
    return {
      vehicle: {},
      imageId: null,
      loading: false,
      fullSvgData: null,
      hoveredSvgCode: null,
      clickedSvgCode: null,
      product: null,
      stock: {
        isLoading: false,
        max: 0,
        manageQuantity: true
      },
      productLoading: false,
      showAddToCart: false,
      currentClickedTooltip: {
        tooltip: '',
        sku: '',
        calloutNumber: ''
      },

      selectedPartItem: PartItems[0]['child'][0],
      selectedParentPartItem: PartItems[0],
      partItems: PartItems
    };
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode'
    }),
    ...mapState({
      criterias: (state) => state.vehicles.criterias
    }),
    description () {
      return `${this.vehicle?.level1 || ''} ${this.vehicle?.level2 || ''} ${this
        .vehicle?.level5 || ''} ${this.vehicle?.level6 || ''} ${this.vehicle
        ?.level7 || ''} ${this.vehicle?.level3 || ''}`;
    },
    brand () {
      return this.vehicle?.level1 || '';
    },
    nationalCode () {
      return this.$route.params.nationalCode;
    },
    regCode () {
      if (this.vehicle?.reg) {
        return this.vehicle?.reg;
      } else {
        return null;
      }
    },
    getTooltips () {
      return this.tooltips.length ? this.tooltips.slice(0, 1) : [];
    },
    productTitle () {
      return this.product ? this.product.name : '';
    }
  },
  methods: {
    changeVehicle () {
      console.log(this.nationalCode);
    },
    hoverTooltip ({ calloutNumber }) {
      this.hoveredSvgCode = calloutNumber;
    },
    async clickTooltip (tooltip) {
      this.clickedSvgCode = tooltip.calloutNumber;

      await this.getProductBySku({ tooltip, eventName: 'hover' });
    },
    async getProductBySku ({ tooltip, eventName }) {
      this.showAddToCart = false;
      if (eventName === 'click') {
        this.currentClickedTooltip = tooltip;
      }
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

      this.product = items[0] || null;
      this.$store.dispatch('product/setCurrent', this.product);
      this.productLoading = false;
      this.stock.isLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.product,
          qty: this.product?.qty
        });
        this.stock.manageQuantity = res.isManageStock;
        this.stock.max = res.isManageStock ? res?.qty : null;
        this.stock.isLoading = false;
      } finally {
        this.stock.isLoading = true;
      }
      this.showAddToCart = true;
    },
    clickParentPartItem (partItem) {
      this.selectedParentPartItem = partItem;
      if (!partItem.value) {
        this.selectedPartItem = partItem.child[0];
        this.$router.push({
          name: 'vehicle-svg',
          params: {
            nationalCode: this.nationalCode,
            visualGroup: this.selectedPartItem.value
          }
        })
      } else {
        this.$router.push({
          name: 'vehicle-svg',
          params: {
            nationalCode: this.nationalCode,
            visualGroup: partItem.value
          }
        })
      }
    },
    clickPartItem (partItem) {
      this.selectedPartItem = partItem;
      this.$router.push({
        name: 'vehicle-svg',
        params: {
          nationalCode: this.nationalCode,
          visualGroup: this.selectedPartItem.value
        }
      })
    },
    async fetchTooltips (visual_category) {
      this.showAddToCart = false;
      this.loading = true;
      this.vehicle = this.getVehicleByNationalCode(this.nationalCode);

      const {
        data: {
          result: { imageId, tooltips }
        }
      } = await axios.post(`${config.api.url}/api/vehicle/tooltip`, {
        national_code: this.nationalCode,
        VISUAL_CATEGORY: visual_category
      });

      this.loading = false;
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
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler () {
        await this.fetchTooltips(this.$route.params.visualGroup);
      }
    },
    activeVehicle () {
      this.vehicle = this.getVehicleByNationalCode(this.nationalCode);
    }
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
    background: #f6f6f6;
    width: 400px;

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
    background: #fff;
    flex: 1;

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
    left: 400px;
    bottom: 0;
    right: 0;
    border-top: 1px solid #ccc;
    display: flex;
    align-items: center;
    background: #f4f4f4;

    &-title {
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #ccc;
      margin-right: 20px;
    }
  }
}
</style>
