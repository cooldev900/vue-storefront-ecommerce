<template>
  <SfButton
    class="a-add-to-cart sf-button--full-width"
    :disabled="isProductDisabled || loading"
    @click.native="addToCart"
  >
    <SfLoader v-if="loading" :loading="loading" />
    <span v-else>{{ $t("Add to cart") }}</span>
  </SfButton>
</template>

<script>
import { SfButton, SfLoader } from '@storefront-ui/vue';
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages.ts';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapGetters, mapActions } from 'vuex';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { Logger } from '@vue-storefront/core/lib/logger';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'AAddToCart',
  components: {
    SfButton,
    SfLoader
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    qty: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding',
      activeVehicle: 'vehicles/activeVehicle'
    }),
    isProductDisabled () {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== '' ||
        this.isAddingToCart
      );
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    async addToCart () {
      try {
        this.loading = true;
        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, { qty: this.qty })
        });

        const cartItems = await StorageManager.get('cart').getItem('current-cart');
        cartItems.forEach(item => {
          if (item.groupedParents) {
            item.groupedParents.map(p => {
              if (p.name === this.product.name && this.activeVehicle?.national_code) {
                if (item.fitVehicles) {
                  const existFitVehicle = item.fitVehicles.find(item => item.national_code === this.activeVehicle?.national_code);
                  if (!existFitVehicle) {
                    item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                  }
                } else {
                  item.fitVehicles = [ this.activeVehicle ];
                }

                // setting main_image
              }
              if (p.name === this.product.name && this.product.main_image) {
                item.main_image = this.product.main_image;
              }
            })
          } else {
            if (item.sku === this.product.sku && this.activeVehicle?.national_code) {
              if (item.fitVehicles) {
                const existFitVehicle = item.fitVehicles.find(item => item.national_code === this.activeVehicle?.national_code);
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

        this.$store.commit(
          'notification/clearNotification',
          { root: true }
        );

        this.openModal({
          name: ModalList.OmCartPopupModal,
          payload: {
            qty: this.qty,
            name: this.product.name
          }
        })
      } catch (message) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message }),
          { root: true }
        );
      }
    }
  }
};
</script>
