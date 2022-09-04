<template>
  <div class="sf-product-card">
    <div class="sf-product-card__brand" :style="{ background: `${oeBrands.color}` }">
      <img class="brand-logo"
           :src="oeBrands.logo"
      >
      <div class="corner-ribbon top-right sticky grey shadow" v-if="isNew">
        {{ $t('New') }}
      </div>
    </div>
    <SfLink class="sf-product-card__link" :link="link">
      <slot name="title" v-bind="{ title }">
        <h3 class="sf-product-card__title">
          {{ title }}
        </h3>
      </slot>
    </SfLink>
    <div class="sf-product-card__image-wrapper">
      <SfLink class="sf-product-card__link" :link="link">
        <slot name="image" v-bind="{ image, title }">
          <template v-if="Array.isArray(image)">
            <SfImage
              v-for="(picture, key) in image.slice(0, 2)"
              :key="key"
              class="sf-product-card__picture"
              :src="picture"
              :alt="title"
              :width="imageWidth"
              :height="imageHeight"
            />
          </template>
          <SfImage
            v-else
            class="sf-product-card__image"
            :src="image"
            :alt="title"
            :width="imageWidth"
            :height="imageHeight"
          />
        </slot>
      </SfLink>
      <slot name="badge" v-bind="{ badgeLabel, badgeColor }">
        <SfBadge
          v-if="badgeLabel"
          class="sf-product-card__badge"
          :class="badgeColorClass"
        >
          {{ badgeLabel }}
        </SfBadge>
      </slot>
      <template v-if="showAddToCartButton">
        <slot
          name="add-to-cart"
          v-bind="{
            isAddedToCart,
            showAddedToCartBadge,
            isAddingToCart,
            title,
          }"
        >
          <SfCircleIcon
            class="sf-product-card__add-button"
            :aria-label="`Add to Cart ${title}`"
            :has-badge="showAddedToCartBadge"
            :disabled="addToCartDisabled || !isAvailable"
            @click="onAddToCart"
          >
            <div class="sf-product-card__add-button--icons">
              <transition
                name="sf-product-card__add-button--icons"
                mode="out-in"
              >
                <slot v-if="!isAddingToCart" name="add-to-cart-icon">
                  <SfIcon
                    key="add_to_cart"
                    icon="add_to_cart"
                    size="20px"
                    color="white"
                  />
                </slot>
                <slot v-else name="adding-to-cart-icon">
                  <SfIcon
                    key="added_to_cart"
                    icon="added_to_cart"
                    size="20px"
                    color="white"
                  />
                </slot>
              </transition>
            </div>
          </SfCircleIcon>
        </slot>
      </template>
      <div class="stock-status">
        <span class="stock-pill" :class="{'stock-red': !isAvailable }">{{ isAvailable ? $t('In Stock') : $t('Out of stock') }}</span>
      </div>
      <h4 class="sub-title">
        {{ secondTitle || ' ' }}
      </h4>
      <div v-if="offerName !== ''" class="action-area__wrap--promobanner">
        {{ offerName }}
      </div>
    </div>
    <SfButton
      v-if="wishlistIcon !== false"
      :aria-label="`${ariaLabel} ${title}`"
      :class="wishlistIconClasses"
      @click="toggleIsOnWishlist"
    >
      <slot name="wishlist-icon" v-bind="{ currentWishlistIcon }">
        <SfIcon
          :icon="currentWishlistIcon"
          size="22px"
          data-test="sf-wishlist-icon"
        />
      </slot>
    </SfButton>
    <div class="action-area__wrap">
      <div class="action-area__wrap--message1">
        <p>{{ usp2 || ' ' }}</p>
      </div>
      <div class="action-area__wrap--message2">
        <p>{{ waranty || ' ' }}</p>
      </div>
      <div class="action-area__wrap--price">
        <slot name="price" v-bind="{ specialPrice, regularPrice }">
          <div class="tire">
            <SfPrice
              v-if="regularPrice"
              class="sf-product-card__price"
              :regular="regularPrice"
              :special="specialPrice"
            />
            <span class="tire__content" v-if="isTire">{{ $t('Per Tire') }}</span>
          </div>
        </slot>
      </div>
      <div class="action-area__wrap--addtocart">
        <OmQuantitySelector v-if="isAvailable" :qty="qty" @update:qty="updateQTY" />
        <div v-if="!isAvailable" class="product-card__action-area">
          <SfButton
            :disabled="loading"
            class="
                      a-add-to-cart
                      om-btn--primary
                      btn--narrow
                      sf-button--full-width
                    "
            @click="showEnquiryModal"
          >
            <SfLoader v-if="loading" :loading="loading" />
            <span>{{ $t("Enquire") }}</span>
          </SfButton>
        </div>
        <slot v-else name="reviews" v-bind="{ maxRating, scoreRating, product, loading }">
          <div class="product-card__action-area">
            <SfButton
              :disabled="loading"
              class="
              a-add-to-cart
              om-btn--primary
              btn--narrow
              sf-button--full-width
            "
              @click.native="addToCart(product)"
            >
              <SfLoader v-if="loading" :loading="loading" />
              <span v-else>{{ $t("Add to cart") }}</span>
            </SfButton>
          </div>
          <div
            v-if="typeof scoreRating === 'number'"
            class="sf-product-card__reviews"
          >
            <SfRating
              class="sf-product-card__rating"
              :max="maxRating"
              :score="scoreRating"
            />
            <SfButton
              v-if="reviewsCount"
              :aria-label="`Read ${reviewsCount} reviews about ${title}`"
              class="sf-button--pure sf-product-card__reviews-count"
              @click="$emit('click:reviews')"
            >
              ({{ reviewsCount }})
            </SfButton>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import config from 'config';
import { focus } from '@storefront-ui/vue/src/utilities/directives';
import { colorsValues as SF_COLORS } from '@storefront-ui/shared/variables/colors';
import { deprecationWarning } from '@storefront-ui/vue/src/utilities/helpers';
import SfIcon from '@storefront-ui/vue/src/components/atoms/SfIcon/SfIcon.vue';
import SfLink from '@storefront-ui/vue/src/components/atoms/SfLink/SfLink.vue';
import SfPrice from '@storefront-ui/vue/src/components/atoms/SfPrice/SfPrice.vue';
import SfRating from '@storefront-ui/vue/src/components/atoms/SfRating/SfRating.vue';
import SfImage from '@storefront-ui/vue/src/components/atoms/SfImage/SfImage.vue';
import SfCircleIcon from '@storefront-ui/vue/src/components/atoms/SfCircleIcon/SfCircleIcon.vue';
import SfBadge from '@storefront-ui/vue/src/components/atoms/SfBadge/SfBadge.vue';
import SfButton from '@storefront-ui/vue/src/components/atoms/SfButton/SfButton.vue';
import { ModalList } from 'theme/store/ui/modals';
import OmQuantitySelector from './om-quantity-selector.vue';
import { mapGetters, mapActions } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';
import buildQuery from '@vue-storefront/core/modules/catalog/helpers/associatedProducts/buildQuery.ts';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import {
  SfLoader
} from '@storefront-ui/vue';

export default {
  name: 'OmProductCard',
  components: {
    SfPrice,
    SfRating,
    SfIcon,
    SfImage,
    SfLink,
    SfCircleIcon,
    SfBadge,
    SfButton,
    OmQuantitySelector,
    SfLoader
  },
  directives: { focus },
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    stock: {
      type: Object,
      default: () => {}
    },
    waranty: {
      type: String,
      default: ''
    },
    promotion: {
      type: String,
      default: ''
    },
    offer: {
      type: [String, Array, Number],
      default: ''
    },
    usp2: {
      type: String,
      default: ''
    },
    secondTitle: {
      type: String,
      default: ''
    },
    brandColor: {
      type: [Array, Object, String],
      default: ''
    },
    brand: {
      type: [String, Array, Number],
      default: ''
    },
    brandImage: {
      type: [Array, Object, String],
      default: ''
    },
    /**
     * Product image
     * It should be an url of the product
     */
    image: {
      type: [Array, Object, String],
      default: ''
    },
    /**
     * Product image width, without unit
     */
    imageWidth: {
      type: [String, Number],
      default: 216
    },
    /**
     * Product image height, without unit
     */
    imageHeight: {
      type: [String, Number],
      default: 326
    },
    /**
     * Badge label
     */
    badgeLabel: {
      type: String,
      default: ''
    },
    /**
     * Badge color
     * It can be according to our standard colors, or legitimate CSS color such as `#fff`, `rgb(255,255,255)`), and `lightgray` or nothing.
     * Standard colors: `primary`, `secondary`, `white`, `black`, `accent`, `green-primary`, `green-secondary`, `gray-primary`, `gray-secondary`, `light-primary`, `light-secondary`, `pink-primary`, `pink-secondary`, `yellow-primary`, `yellow-secondary`, `blue-primary`, `blue-secondary`.
     */
    badgeColor: {
      type: String,
      default: ''
    },
    /**
     * Product title
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Link to product page
     */
    link: {
      type: [String, Object],
      default: ''
    },
    /**
     * Link element tag
     * By default it'll be 'router-link' if Vue Router
     * is available on instance, or 'a' otherwise.
     * @deprecated will be removed in 1.0.0 use SfLink instead
     */
    linkTag: {
      type: String,
      default: undefined
    },
    /**
     * Product rating
     */
    scoreRating: {
      type: [Number, Boolean],
      default: false
    },
    /**
     * Product reviews count
     */
    reviewsCount: {
      type: [Number, Boolean],
      default: false
    },
    /**
     * Maximum product rating
     */
    maxRating: {
      type: [Number, String],
      default: 5
    },
    /**
     * Product regular price
     */
    regularPrice: {
      type: [Number, String],
      default: null
    },
    /**
     * Product special price
     */
    specialPrice: {
      type: [Number, String],
      default: null
    },
    /**
     * Wish list icon
     * This is the default icon for product not yet added to wish list.
     * It can be a icon name from our icons list, or array or string as SVG path(s).
     */
    wishlistIcon: {
      type: [String, Array, Boolean],
      default: 'heart'
    },
    /**
     * Wish list icon for product which has been added to wish list
     * This is the icon for product added to wish list. Default visible on mobile. Visible only on hover on desktop.
     * It can be a icon name from our icons list, or array or string as SVG path(s).
     */
    isOnWishlistIcon: {
      type: [String, Array],
      default: 'heart_fill'
    },
    /**
     * Status of whether product is on wish list or not
     */
    isOnWishlist: {
      type: Boolean,
      default: false
    },
    /**
     * Status of showing add to cart button
     */
    showAddToCartButton: {
      type: Boolean,
      default: false
    },
    /**
     * isAddedToCart status of whether button is showed, product is added or not
     */
    isAddedToCart: {
      type: Boolean,
      deafult: false
    },
    /**
     * addToCartDisabled status of whether button is disabled when out of stock
     */
    addToCartDisabled: {
      type: Boolean,
      default: false
    },
    qty1: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      isAddingToCart: false,
      qty: 1,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      previewQty: 'vehicles/qty',
      attributeListByCode: 'attribute/attributeListByCode',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    isSFColors () {
      return SF_COLORS.includes(this.badgeColor.trim());
    },
    badgeColorClass () {
      return this.isSFColors ? `${this.badgeColor.trim()}` : '';
    },
    currentWishlistIcon () {
      return this.isOnWishlist ? this.isOnWishlistIcon : this.wishlistIcon;
    },
    showAddedToCartBadge () {
      return !this.isAddingToCart && this.isAddedToCart;
    },
    ariaLabel () {
      return this.isOnWishlist ? 'Remove from wishlist' : 'Add to wishlist';
    },
    wishlistIconClasses () {
      const defaultClass = 'sf-button--pure sf-product-card__wishlist-icon';
      return `${defaultClass} ${
        this.isOnWishlist ? 'sf-product-card--on-wishlist' : ''
      }`;
    },
    linkComponentTag () {
      deprecationWarning(
        this.$options.name,
        "Prop 'linkTag' has been deprecated and will be removed in v1.0.0. Use 'SfLink' instead."
      );
      if (this.linkTag) {
        return this.linkTag;
      }
      if (this.link) {
        return typeof this.link === 'object' || this.$router
          ? 'router-link'
          : 'a';
      }
      return 'div';
    },
    isTire () {
      let product_group = this.product.product_group;
      let options = this.attributeListByCode.product_group.options;
      return options?.some(option => option.value == product_group && option.label === 'Tires');
    },
    isNew () {
      const startTime = new Date(this.product.news_from_date).getTime();
      const endTime = new Date(this.product.news_to_date).getTime();
      const now = new Date();
      return now >= startTime && now <= endTime;
    },
    oeBrands () {
      return config['oebrands'][this.getAttributeLabelById('oe_brand', this.brand)];
    },
    offerName () {
      if (!this.offer) return '';
      const attribute = this.getAttributeLabelById('promotion', this.offer);
      if (attribute) {
        return attribute;
      } else {
        return ''
      }
    },
    isAvailable () {
      // if (this.qty1) this.qty = this.qty1;
      // const res = await this.$store.dispatch('stock/check', {
      //   product: this.product,
      //   qty: this.product.qty
      // });
      // let manageQuantity = res.isManageStock;
      // let max = res.qty || res.isManageStock ? res.qty : null;
      // this.isAvailable = !onlineHelper.isOnline || !!max || !manageQuantity || ['simple', 'configurable'].includes(
      //   this.product.type_id
      // );
      return this.stock?.is_in_stock;
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    async addToCart (product) {
      this.loading = true;
      this.$store.dispatch('product/setCurrent', product);
      const res = await this.$store.dispatch('stock/check', {
        product: product,
        qty: product.qty
      });
      let manageQuantity = res.isManageStock;
      let max = res.qty || res.isManageStock ? res.qty : null;
      let isAvailable = !onlineHelper.isOnline || !!max || !manageQuantity || ['simple', 'configurable'].includes(
        this.product?.type_id
      );
      if (!isAvailable) {
        this.loading = false;
        return;
      }

      this.isAddingToCart = true;
      const query = buildQuery([product.sku]);
      try {
        const { items = [] } = await ProductService.getProducts({
          query,
          size: 1,
          configuration: { sku: product.sku },
          options: {
            prefetchGroupProducts: true,
            assignProductConfiguration: true
          }
        });
        const productData = items[0] || null;
        productData.qty = this.qty;
        const { serverResponses } = await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, productData, { qty: this.qty })
        });
        let errorMessage = '';
        if (serverResponses?.length) {
          const response = serverResponses[0];
          if (response.status !== 200) {
            errorMessage = response?.result?.result;
          }
        }

        const cartItems = await StorageManager.get('cart').getItem('current-cart');
        cartItems.forEach(item => {
          if (item.groupedParents) {
            item.groupedParents.map(p => {
              if (p.name === productData?.name && this.activeVehicle?.National_Code) {
                if (item.fitVehicles) {
                  const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle?.National_Code);
                  if (!existFitVehicle) {
                    item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                  }
                } else {
                  item.fitVehicles = [ this.activeVehicle ];
                }

                // setting main_image
              }
              if (p.name === productData?.name && productData?.main_image) {
                item.main_image = productData?.main_image;
              }
            })
          } else {
            if (item.sku === productData?.sku && this.activeVehicle?.National_Code) {
              if (item.fitVehicles) {
                const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle?.National_Code);
                if (!existFitVehicle) {
                  item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                }
              } else {
                item.fitVehicles = [ this.activeVehicle ];
              }
            }
          }
        })

        await StorageManager.get('cart').setItem('current-cart', cartItems).catch((reason) => {
          Logger.error(reason)()
        })
        const storedItems = await StorageManager.get('cart').getItem('current-cart');
        this.$store.dispatch('cart/syncCartWhenLocalStorageChange', { items: storedItems })
        this.loading = false;
        console.log(storedItems, 'storeItems');
        this.$store.commit(
          'notification/clearNotification',
          { root: true }
        );

        this.openModal({
          name: ModalList.OmCartPopupModal,
          payload: {
            qty: this.qty,
            name: productData.name,
            errorMessage
          }
        });
      } catch (message) {
        this.loading = false;
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message }),
          { root: true }
        );
      }
      this.$store.dispatch('vehicles/saveQTY', 1);
      this.isAddingToCart = false;
    },
    showEnquiryModal () {
      this.$store.dispatch('product/setCurrent', this.product);
      this.openModal({
        name: ModalList.OmEnquiryModal
      })
    },
    toggleIsOnWishlist () {
      this.$emit('click:wishlist', !this.isOnWishlist);
    },
    onAddToCart (event) {
      event.preventDefault();
      if (this.isAvailable) {
        this.isAddingToCart = true;
        setTimeout(() => {
          this.isAddingToCart = false;
        }, 1000);
        this.$emit('click:add-to-cart');
      }
    },
    updateQTY (value) {
      this.qty = value;
    }
  },
  async beforeMount () {
    // if (this.qty1) this.qty = this.qty1;
    // const res = await this.$store.dispatch('stock/check', {
    //   product: this.product,
    //   qty: this.product.qty
    // });
    // let manageQuantity = res.isManageStock;
    // let max = res.qty || res.isManageStock ? res.qty : null;
    // this.isAvailable = !onlineHelper.isOnline || !!max || !manageQuantity || ['simple', 'configurable'].includes(
    //   this.product.type_id
    // );
  },
  watch: {
    qty (value) {
      if (this.previewQty !== value) { this.$store.dispatch('vehicles/saveQTY', value); }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/components/organisms/SfProductCard.scss";
.sub-title{
  margin: 20px 0 40px 0;
}

.stock-red {
  background: red !important;
}

.tire {
  display: flex;
  gap: 10px;
  justify-content: center;

  &__content {
    color: var(--c-primary);
    margin: 8px 0;
  }
}
.corner-ribbon {
  width: 64px;
  position: absolute;
  text-align: center;
  color: #fff;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  overflow: hidden;
}
.corner-ribbon.shadow {
  box-shadow: 0 0 3px rgba(0, 0, 0, .3);
}
/* Different positions */

.corner-ribbon.top-right {
  top: 10px;
  right: -21px;
  left: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(46deg);
  overflow: hidden;
}
.corner-ribbon.grey {
    background: gray;
    font-size: 13px;
    font-weight: 700;
    padding: 3px 10px;
}
</style>
