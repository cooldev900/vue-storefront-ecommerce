<template>
  <div
    class="o-product-details product"
    itemProp="offers"
    itemScope
    itemType="http://schema.org/Offer"
  >
    <meta
      itemProp="priceCurrency"
      :content="$store.state.storeView.i18n.currencyCode"
    >
    <meta
      itemProp="price"
      :content="parseFloat(product.price_incl_tax).toFixed(2)"
    >
    <meta itemProp="availability" :content="availability">
    <meta itemProp="url" :content="product.url_path">
    <div class="product__header">
      <h1>{{ product.enhanced_title || product.name | htmlDecode }}</h1>
      <div v-if="product.tyre_size" class="product__header--spec">
        <p>{{ $t('Tire Size') }}</p><span> {{ product.tyre_size }}</span>
      </div>
      <div v-else-if="product.oil_type" class="product__header--spec">
        <p>{{ $t('Oil Type') }}</p><span> {{ getAttributeLabelById('oil_type', product.oil_type) }}</span>
      </div>
      <div v-else-if="product.battery_capacity" class="product__header--spec">
        <p>{{ $t('Battery Capacity') }}</p><span> {{ getAttributeLabelById('battery_capacity', product.battery_capacity) }}</span>
      </div>
    </div>
    <div class="product__main">
      <MProductGallery
        :gallery="gallery"
        :configuration="productConfiguration"
        :product="product"
        :is-fit="isFit"
      />
      <div class="product__info">
        <SfSticky>
          <div class="product__info--card">
            <div class="product__brand" :style="{ background: `${oeBrands.color}` }">
              <img class="brand-logo"
                   :src="oeBrands.logo"
              >
            </div>
            <MProductShortInfo
              :product="product"
              :custom-options="productCustomOptions"
              :reviews="reviews"
              :stock="productStock"
            />
            <OmRadioCheckbox
              v-if="showFittingCheckbox"
              v-model="enableFitting"
              :items="fittingItems"
              @change="onFittingChange"
              :price="fittingPrice"
            />
            <!-- <MProductOptionsGroup
          v-if="product.type_id =='grouped'"
          :product-options="product.product_links"
        /> -->
            <div>
              <div>
                <MProductOptionsConfigurable
                  v-if="product.type_id =='configurable'"
                  :product="product"
                  :configuration="productConfiguration"
                />
                <!-- <MProductOptionsGroup
                v-if="product.type_id =='grouped'"
                :product-options="product.product_links"
              /> -->
                <MProductOptionsBundle
                  v-if="product.bundle_options && product.bundle_options.length > 0"
                  :product="product"
                />
                <MProductOptionsCustom
                  v-else-if="product.custom_options && product.custom_options.length > 0"
                  :product="product"
                />
                <MProductAddToCart
                  v-if="availability === 'InStock' && (product.price || product.final_price)"
                  class="product__add-to-cart"
                  :product="product"
                  :stock="productStock"
                />
                <div v-else style="padding: 20px;">
                  <SfButton
                    class="sf-button--full-width om-btn--primary"
                    @click="showEnquiryModal"
                  >
                    {{ $t('Enquire') }}
                  </SfButton>
                </div>
                <button
                  v-if="!isJpgRender && isFit"
                  class="open-modal-button"
                  @click="openSvgViewerModal"
                >
                  {{ $t('Open Interactive Parts') }}
                </button>
                <SfNotification
                  visible="true"
                  persistent="true"
                  title=""
                  message="This product is only available for Collection"
                  action=""
                  type="warning"
                  v-if="isCollectionOnly"
                />
              </div>
            </div>
          </div>
          <ProductUsp
            :product="product"
          />
        </SfSticky>
      </div>
      <div v-if="product.description" class="product-description">
        <div v-html="product.description" class="product-copy" />
      </div>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import MProductGallery from 'theme/components/molecules/m-product-gallery';
import MProductShortInfo from 'theme/components/molecules/m-product-short-info';
import MProductAddToCart from 'theme/components/molecules/m-product-add-to-cart';
import OmNoSetVehicle from 'theme/components/omni/om-no-set-vehicle';
import MProductOptionsCustom from 'theme/components/molecules/m-product-options-custom';
import MProductOptionsGroup from 'theme/components/molecules/m-product-options-group';
import OmAddCartStep1 from 'theme/components/omni/om-add-cart-step1';
import OmRadioCheckbox from 'theme/components/omni/om-radio-checkbox';
import MProductAdditionalInfo from 'theme/components/molecules/m-product-additional-info';
import MProductOptionsBundle from 'theme/components/molecules/m-product-options-bundle';
import MProductOptionsConfigurable from 'theme/components/molecules/m-product-options-configurable';
import { ModalList } from 'theme/store/ui/modals';
import { SfSticky, SfCheckbox, SfNotification, SfAccordion, SfButton } from '@storefront-ui/vue';
import rates from 'theme/resource/rates.json'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import * as VehicleStorage from 'theme/store/vehicles-storage.ts';
import axios from 'axios';
import config from 'config';
import OmAlertBox from 'theme/components/omni/om-alert-box';
import ProductUsp from 'theme/components/omni/products/product-usp'

export default {
  components: {
    MProductGallery,
    MProductShortInfo,
    MProductAddToCart,
    MProductOptionsCustom,
    OmAddCartStep1,
    SfSticky,
    SfCheckbox,
    SfAccordion,
    SfNotification,
    MProductOptionsGroup,
    MProductAdditionalInfo,
    MProductOptionsConfigurable,
    MProductOptionsBundle,
    OmRadioCheckbox,
    OmNoSetVehicle,
    SfButton,
    OmAlertBox,
    ProductUsp
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    productGallery: {
      type: Array,
      default: () => []
    },
    productConfiguration: {
      type: Object,
      default: () => ({})
    },
    productCustomOptions: {
      type: Object,
      default: () => ({})
    },
    productAttributes: {
      type: Array,
      default: () => []
    },
    productStock: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters({
      getAttributeIdByLabel: 'vehicles/getAttributeIdByLabel',
      activeVehicle: 'vehicles/activeVehicle',
      tooltips: 'vehicles/tooltips',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    gallery () {
      return this.productGallery.map(imageObject => ({
        id: imageObject.id,
        mobile: {
          url: imageObject.src,
          alt: this.product.name
        },
        desktop: {
          url: imageObject.src,
          alt: this.product.name
        }
      }));
    },
    oeBrands () {
      return config['oebrands'][this.getAttributeLabelById('oe_brand', this.product.oe_brand)];
    },
    reviews () {
      const baseReviews = get(this.$store.state.review, 'items.items', []);
      return baseReviews.map(review => ({
        author: review.nickname,
        date: review.created_at,
        message: `${review.title}: ${review.detail}`,
        rating: 1
      }));
    },
    availability () {
      return this.product.stock && this.product.stock.is_in_stock
        ? 'InStock'
        : 'OutOfStock';
    },
    sizeOption () {
      return get(this.productConfiguration, 'size', false);
    },
    isFit () {
      if (this?.activeVehicle) {
        const isFit = this.product?.national_code?.some(code => {
          return String(code) === String(this?.activeVehicle?.national_code);
        });

        return isFit;
      }

      return false;
    },
    isJpgRender () {
      const img = this.product.main_image
      if (img == null) {
        return true;
      } else {
        return false;
      }
    },
    vehicleInfo () {
      return this?.activeVehicle
        ? `${this?.activeVehicle.Model || ''} ${this?.activeVehicle.Year ||
        ''} ${this?.activeVehicle.level6 || ''} ${this?.activeVehicle
          .level7 || ''} ${this?.activeVehicle.level3 || ''}`
        : '';
    },
    vehicleRegistation () {
      if (this.activeVehicle && this.activeVehicle.VRN) {
        return this.activeVehicle.VRN
      }
    },
    isLifestyle () {
      const productLabel = this.getAttributeLabelById('product_group', this.getCurrentProduct.product_group)
      if (productLabel === 'lifestyle') {
        return true;
      } else {
        return false;
      }
    },
    isCollectionOnly () {
      const collect = this.product.collection_only
      if (collect === 1) {
        return true;
      } else {
        return false;
      }
    },
    fittingPrice () {
      if (this.product.fitment_time) {
        const productFitRate = rates['rates'].find(rate => +rate.store === +currentStoreView().storeId);
        const productFitPrice = +productFitRate.rate * +this.product.fitment_time
        return productFitPrice;
      } else {
        return this.product.fixed_fitment_price;
      }
    },
    showFittingCheckbox () {
      return this.product.fixed_fitment_price || this.product.fitment_time;
    },
    noActiveVehicle () {
      return (
        (!this.activeVehicle ||
          (this.activeVehicle && !this.activeVehicle?.national_code)) &&
        this.product.national_code &&
        this.product.national_code.length
      );
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal',
      toggleSidebar: 'ui/toggleSidebar'
    }),
    openSizeGuide () {
      this.openModal({ name: ModalList.SizeGuide });
    },
    async onFittingChange () {
      await VehicleStorage.removeFittingProduct(this.product.sku)
      if (this.enableFitting) {
        await VehicleStorage.setFittingProducts({
          sku: this.product.sku,
          price: this.fittingPrice,
          item_id: null,
          status: true
        })
      } else {
        await VehicleStorage.setFittingProducts({
          sku: this.product.sku,
          price: this.fittingPrice,
          item_id: null,
          status: false
        })
      }
    },
    async fetchTooltips () {
      if (this.product?.visual_group && this.product?.visual_group?.length) {
        const visiualCategory = this.getAttributeLabelById('visual_group', this.product?.visual_group[0]);
        const {
          data: {
            result: { tooltips }
          }
        } = await axios.post(`${config.api.url}/api/vehicle/tooltip`, {
          national_code: this.activeVehicle?.national_code,
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
      }
    },
    async openSvgViewerModal () {
      const {
        data: {
          result: { calloutNumber }
        }
      } = await axios.post(`${config.api.url}/api/vehicle/applicability-location`, {
        national_code: this.activeVehicle.national_code,
        SKU: this.product.sku
      });
      const tooltip = this.tooltips.find(tooltip => +tooltip.calloutNumber === +calloutNumber)
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
    },
    showEnquiryModal () {
      this.openModal({
        name: ModalList.OmEnquiryModal
      })
    }
  },
  data () {
    return {
      enableFitting: false,
      fittingItems: [
        {
          value: false,
          title: 'No Fitment',
          description: 'Collection from Dealership'
        },
        {
          value: true,
          title: 'Fitted by Us',
          description: 'We will fit this item'
        }
      ]
    }
  },
  async mounted () {
    await this.fetchTooltips();
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.o-product-details {
  position: relative;
  .product__main .product__info{
        @include for-desktop {
        position: relative;
        width: 35%;
        height: 100%;
      }
      @include for-mobile{
        padding: 0;
        margin-top: 20px;
      }
  }
  .product {
    @include for-desktop {
      position: relative;
    }
    &__main{
      @include for-desktop {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-left: 0;
      }
    }
    &__info {
      margin: 0;
      padding: 0;
      @include for-desktop {
        position: relative;
        width: 35%;
      }
    &--card{
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    padding: 0
    }
    }
    &__brand{
          height: 60px;
    width: 100%;
    margin-bottom: 15px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    .brand-logo{
      max-height: 30px;
    }
    }
    &__add-to-cart {
      margin: var(--spacer-base) 0 0;
      padding: 0 15px 15px 15px;
      @include for-desktop {
        margin-top: var(--spacer-base);
      }
    }

    &__guide,
    &__compare,
    &__save {
      display: block;
      margin: var(--spacer-xl) 0 var(--spacer-base) auto;
    }

     .add-cart-step-text {
      color: var(--add-cart-step-text-color);
      font-weight: 600;
    }
  }

  .sf-sticky {
    top: var(--sticky-top, 20px);
  }

  .section {
    border-bottom: 1px solid #f1f2f3;
    padding-bottom: 10px;
    @include for-desktop {
      border: 0;
      padding-bottom: 0;
    }
  }

  .sf-radio__container {
    align-items: center;
  }

  .open-modal-button {
    border: 0;
    background-color: #fff;
    color: var(--c-primary);;
    line-height: 9px;
    padding: 7px 83px 7px 83px;
    border-radius: 44px;
    background-image: url(/assets/icons/visualize-off.svg);
    background-repeat: no-repeat;
    background-position: left 10px center;
    box-shadow: 0 3px 6px #a3a3a3;
    height: 46px;
    cursor: pointer;
    margin: var(--spacer-sm) auto;
    display: inherit;
    font-weight: bold;
  }

  .enquire-button {
    margin: var(--spacer-base) 0;
  }
}
.product-description{
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  margin: 30px 0;
}
.product__header{
  @include for-mobile{
    padding: 15px 0;
  }
  h1{
    font-size: 28px;
    margin: 0;
    @include for-mobile{
    font-size: 22px;
    }
  }
  &--spec{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 15px;
  p{
    margin: 0;
    font-weight: 700;
  }
  span{
    background: grey;
    border-radius: 30px;
    padding: 5px 20px;
    color: #fff;
    font-weight: 700;;
  }
  }
}
</style>
