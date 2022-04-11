<template>
  <div class="o-order-summary">
    <SfHeading
      :title="$t('Totals')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <MPriceSummary :is-large="true" />
    <APromoCode :allow-promo-code-removal="false" />
  </div>
</template>
<script>
import { SfHeading, SfCharacteristic, SfButton } from '@storefront-ui/vue';
import APromoCode from 'theme/components/atoms/a-promo-code';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
import {
  localizedRoute
} from '@vue-storefront/core/lib/multistore';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'OOrderSummary',
  components: {
    SfHeading,
    SfCharacteristic,
    APromoCode,
    MPriceSummary,
    SfButton
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    }),
    routePath () {
      return this.$route.fullPath;
    },
    missingVin () {
      let flag = false;
      this.productsInCart.map(product => {
        if (product.fitVehicles) {
          product.fitVehicles.map(vehicle => {
            if (!vehicle.VIN && !vehicle.VRN) flag = true;
          })
        }
      })

      return flag;
    }
  },
  data () {
    return {
      characteristics: [
        {
          title: this.$t('Safety'),
          description: this.$t('It carefully packaged with a personal touch'),
          icon: 'safety'
        },
        {
          title: this.$t('Easy shipping'),
          description: this.$t('You’ll receive dispatch confirmation and an arrival date'),
          icon: 'shipping'
        },
        {
          title: this.$t('Changed your mind?'),
          description: this.$t('Rest assured, we offer free returns within 30 days'),
          icon: 'return'
        }
      ]
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    goToCheckout () {
      if (this.missingVin) {
        this.openModal({
          name: ModalList.OmCartCheckoutModal
        })
      } else {
        this.$router.push(localizedRoute('/checkout'));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.o-order-summary{
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
::v-deep .sf-heading__title{
  font-size: 20px;
  text-transform: none;
  margin-bottom: 40px;
}
::v-deep .sf-property__name{
  font-size: 16px;
}
::v-deep .sf-property__value{
  font-size: 16px;
  font-weight: 700;
}
.title {
  --heading-title-margin: 0 0 var(--spacer-2xl) 0;
  font-size: 20px;
}
.property {
  margin: var(--spacer-base) 0;
}
.characteristics {
  margin: var(--spacer-xl) 0 0 var(--spacer-xs);
  &__item {
    margin: var(--spacer-base) 0;
  }
}
.actions {
  &__button {
    margin: var(--spacer-sm) 0;
    &--secondary {
      text-align: left;
    }
  }
}
</style>
