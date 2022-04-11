<template>
  <div class="om-cart-checkout">
    <SfModal :visible="isVisible" @close="closeModal" title="Added to Basket">
      <div class="om-cart-checkout__content">
        <div v-for="index in Object.keys(form)" :key="index" class="row">
          <div>{{ form[index].name }}</div>
          <SfInput
            v-model.trim="form[index].vin"
            class="form__element"
            name="vin"
            label="VIN"
          />
          <div>or</div>
          <SfInput
            v-model.trim="form[index].vrn"
            class="form__element"
            name="vrn"
            label="VRN"
          />
        </div>
        <div class="actions">
          <SfButton
            class="sf-button--full-width"
            @click="save"
            :disabled="saving"
          >
            Save
          </SfButton>
          <SfButton
            class="sf-button--full-width color-secondary"
            @click="goToCheckout"
            :disabled="saving"
          >
            Skip
          </SfButton>
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfIcon, SfButton, SfInput } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { Logger } from '@vue-storefront/core/lib/logger';

export default {
  name: 'OmCartCheckoutModal',
  components: { SfModal, SfIcon, SfButton, SfInput },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: 'OmCartCheckoutModal',
        payload: {
          vin: '',
          vrn: ''
        }
      }),
      required: true
    }
  },
  data () {
    return {
      saving: false,
      form: {}
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    goToCheckout () {
      this.closeModal();
      this.$router.push(localizedRoute('/checkout'));
    },
    async save () {
      this.saving = true;
      const cartItems = await StorageManager.get('cart').getItem('current-cart');
      cartItems.forEach(item => {
        if (item.fitVehicles) {
          item.fitVehicles.forEach(vehicle => {
            if (!vehicle.VIN) vehicle.VIN = this.form[vehicle.national_code]['vin'];
            if (!vehicle.VRN) vehicle.VRN = this.form[vehicle.national_code]['vrn'];
          })
        }
      })

      await StorageManager.get('cart').setItem('current-cart', cartItems).catch((reason) => {
        Logger.error(reason)()
      })
      const storedItems = await StorageManager.get('cart').getItem('current-cart');
      this.$store.dispatch('cart/syncCartWhenLocalStorageChange', { items: storedItems })
      this.saving = false;

      this.goToCheckout();
    },
    async setUp () {
      const cartItems = await StorageManager.get('cart').getItem('current-cart');
      let _form = {};
      cartItems.map(item => {
        if (item.fitVehicles) {
          item.fitVehicles.map(vehicle => {
            if (!vehicle.VIN && !vehicle.VRN) {
              _form = {
                ..._form,
                [vehicle.national_code]: {
                  name: vehicle.Model,
                  vrn: '',
                  vin: ''
                }
              };
            }
          });
        }
      });

      this.form = _form;
    }
  },
  watch: {
    async isVisible (value) {
      if (value) {
        await this.setUp();
      }
    }
  },
  async mounted () {
    await this.setUp();
  }
};
</script>

<style lang="scss">
.om-cart-checkout {
  .sf-modal {
    --modal-width: 51.375rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
    padding-top: 0;

    .title {
      font-weight: bold;
      font-size: 14px;
    }

    .product-count {
      display: flex;
      gap: var(--spacer-xs);
      color: var(--c-primary);
    }

    .actions {
      display: flex;
      gap: var(--spacer-base);
      margin-top: var(--spacer-lg);
    }

    .row {
      display: flex;
      gap: var(--spacer-sm);
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
