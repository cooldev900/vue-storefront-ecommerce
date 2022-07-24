<template>
  <div class="om-cart-popup">
    <SfModal :visible="isVisible" @close="closeModal" :title="serverError ? $t('Error') : $t('Added to cart')">
      <div class="om-cart-popup__content">
        <div class="title desktop-only">
          {{ serverError ? $t('Error') : $t('Added to cart') }}
        </div>
        <div class="product-count" v-if="!serverError">
          <SfIcon
            class="icon fits-icon"
            icon="check"
            icon-size="20px"
            disabled
            color="var(--c-primary)"
          />
          <span>{{ modalData.payload.qty }} {{ $t('Added') }}</span>
        </div>
        <div class="product-name">
          {{ serverError ? $t(modalData.payload.errorMessage) : $t(modalData.payload.name) }}
        </div>
        <div class="actions">
          <SfButton
            class="sf-button--full-width om-btn--primary"
            @click="continueShipping"
          >
            {{ $t('Continue shopping') }}
          </SfButton>
          <SfButton
            class="sf-button--full-width om-btn--secondary"
            @click="goToCart"
            v-if="!serverError"
          >
            {{ $t('Go to checkout') }}
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
          qty: 1,
          errorMessage: ''
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
  },
  computed: {
    serverError() {
      return !!this.modalData?.payload?.errorMessage;
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
      flex-wrap: wrap;
      gap: var(--spacer-base);
    }
  }
}
</style>
