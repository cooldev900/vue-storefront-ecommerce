import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import i18n from '@vue-storefront/i18n';

export const PaymentCheckoutComModule: StorefrontModule = function ({ store, router, appConfig }) {
  const VSF_PAYMENT_CODE = 'checkoutcom_card_payment'

  // Update the methods
  let paymentMethodConfig = {
    'title': i18n.t('Pay by Card (CheckoutCom)'),
    'code': VSF_PAYMENT_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': false
  }
  store.dispatch('checkout/addPaymentMethod', paymentMethodConfig)
}
