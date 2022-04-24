<template>
  <div class="m-product-gallery">
    <OmGallery
      ref="gallery"
      :image-width="900"
      :image-height="900"
      :images="gallery"
    />
    <svg-viewer
      v-if="!isJpgRender && !isFullImage"
      :is-full-image="false"
      :image-id="imageId"
      :image-code="imageCode"
    />
    <OmPanZoom
      v-if="isFullImage && !isJpgRender"
      :options="{ minScale: 1, maxScale: 5 }"
      :show-open-modal-button="true"
      :visual-group="product.visual_group"
      :image-code="imageCode"
      :sku="currentProduct.sku"
      dom-key="product"
    >
      <svg-viewer
        :is-full-image="isFullImage"
        :image-id="imageId"
        :image-code="svgCode"
        :part-svg-clickable="false"
        :has-color="false"
        dom-id="product"
        @clickPartSvg="saveClickedSvgID"
      />
    </OmPanZoom>
  <div @click="toggleFullImage" v-if="!isJpgRender && isFit" class="fitting-position">
    <span>See Fitting Position</span>
    <SfIcon
      v-if="!isJpgRender && isFit"
      :icon="buttonIcon"
      size="lg"
      color="black"
      role="button"
      class="button"
       />
    </div>
  </div>
</template>

<script>
import isEqual from 'lodash-es/isEqual';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { mapGetters } from 'vuex';
import { SfButton, SfIcon } from '@storefront-ui/vue';
import OmGallery from 'theme/components/omni/om-gallery.vue';
import axios from 'axios';
import config from 'config';

export default {
  name: 'MProductGallery',
  components: {
    // SfGallery
    SvgViewer,
    SfButton,
    SfIcon,
    OmGallery
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    },
    product: {
      type: Object,
      default: () => {}
    },
    isFit: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    variantImage () {
      let variantImage = this.gallery.find((image) => {
        let selectThis = true;
        for (const [key, value] of Object.entries(this.configuration)) {
          if (
            typeof image.id !== 'undefined' &&
            typeof image.id[key] !== 'undefined' &&
            image.id[key] !== value.id
          ) {
            selectThis = false;
          }
        }
        return (
          selectThis ||
          (image.id &&
            image.id.color &&
            String(image.id.color) === String(this.configuration.color.id))
        );
      });

      if (!variantImage) {
        variantImage = this.gallery.find((image) => {
          return (
            typeof image.id.color !== 'undefined' &&
            typeof this.configuration.color !== 'undefined' &&
            String(image.id.color) === String(this.configuration.color.id)
          );
        });
      }

      if (!variantImage) {
        variantImage = this.gallery[0];
      }

      return variantImage;
    },
    currentIndex () {
      const index = this.gallery.findIndex((imageObject) =>
        isEqual(imageObject.id, this.variantImage.id)
      );

      return index === -1 ? 0 : index;
    },
    ...mapGetters({
      currentProduct: 'product/getCurrentProduct',
      activeVehicle: 'vehicles/activeVehicle',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    imageId () {
      if (this.currentProduct && this.currentProduct.main_image) {
        const imageIdAry = this.currentProduct.main_image.split('_');
        return imageIdAry[0];
      } else {
        if (this.isFullImage) return this.svgId; // is default imageID
        else return null;
      }
    },
    imageCode () {
      if (this.isFullImage) return this.svgCode;
      if (this.currentProduct.main_image) {
        return this.currentProduct.main_image;
      } else {
        return 1;
      }
    },
    buttonIcon () {
      return this.isFullImage ? 'arrow_left' : 'arrow_right'
    },
   isJpgRender () {
      const img = this.product.main_image
      if (img == null) {
        return true;
      } else {
        return false;
      }
    },
  },
  data () {
    return {
      isFullImage: false,
      svgId: null,
      svgCode: null
    }
  },
  watch: {
    currentIndex () {
      this.$refs.gallery.go(this.currentIndex);
    }
  },
  methods: {
    async toggleFullImage () {
      await this.fetchTooltips();
      const {
        data: {
          result: { imageId, calloutNumber }
        }
      } = await axios.post(`${config.api.url}/api/vehicle/applicability-location`, {
        national_code: this.activeVehicle.national_code,
        SKU: this.currentProduct.sku
      });

      this.isFullImage = !this.isFullImage;
      if (!imageId) {
        const main_image = this.currentProduct.main_image.split('_');
        this.svgId = main_image[0];
      } else {
        this.svgId = imageId;
      }
      this.svgCode = calloutNumber;
      // this.$store.commit('vehicles/setTooltips', tooltips);
    },
    async fetchTooltips () {
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
    },
    saveClickedSvgID ({ tooltip: { calloutNumber } }) {
      this.svgCode = calloutNumber;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.m-product-gallery {
  flex: 1;
  width: 65%;
  position: relative;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
@include for-mobile{
  width: 100%;
}
}
.product-menu{
  display: flex;
  justify-content: center;
  height: 60px;
      border-bottom: 1px solid #f2f2f2;
    border-top: 1px solid #f2f2f2;
  background: #fff;
&__list {
  list-style: none;
  display: flex;
  justify-content: center;
}
}
.sf-gallery{
width: 100%;
@include for-mobile{
  width: 100%;
}
}
::v-deep .sf-image--has-size img:not(.noscript){
  position: absolute !important;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}
::v-deep .sf-image--has-size::after {
  display: block;
  content: "";
  padding-bottom: calc(var(--_image-height) / var(--_image-width) * 100%);
}
::v-deep .sf-gallery__item{
flex: 0 0 var(--gallery-thumb-width, 100px);
}
::v-deep .sf-image--has-size::before{
  position: absolute;
  width: 100%;
  left: 0;
  height: 100%;
  z-index: 1;
  mix-blend-mode: multiply;
  pointer-events: none;
  content: ""
}
::v-deep .sf-gallery__thumbs{
  flex: none;
}
</style>
