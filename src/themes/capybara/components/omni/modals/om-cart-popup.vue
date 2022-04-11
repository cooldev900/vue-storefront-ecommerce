<template>
  <div class="om-cart-popup">
    <SfModal :visible="isVisible" @close="closeModal" title="Added to Basket">
      <div class="om-cart-popup__content">
        <div class="title desktop-only">Added to Basket</div>
        <div class="product-count">
          <SfIcon
            class="icon fits-icon"
            icon="check"
            icon-size="20px"
            disabled
            color="var(--c-primary)"
          />
          <span>{{ modalData.payload.qty }}x Added</span>
        </div>
        <div class="product-name">{{ modalData.payload.name }}</div>
        <div class="actions">
          <SfButton
            class="sf-button--full-width"
            @click="continueShipping"
          >
            Continue Shopping
          </SfButton>
          <SfButton
            class="sf-button--full-width color-secondary"
            @click="goToCart"
          >
            Go to cart
          </SfButton>
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfIcon, SfButton } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OmCartPopupModal',
  components: { SfModal, SfIcon, SfButton },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: 'OmCartPopupModal',
        payload: {
          name: '',
          qty: 1
        }
      }),
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    continueShipping () {
      this.closeModal();
    },
    goToCart () {
      this.$router.push(localizedRoute('/cart'));
      this.closeModal();
    }
  }
};
</script>

<style lang="scss">
.om-cart-popup {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
    max-height: 600px;
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
    }
  }
}
</style>
