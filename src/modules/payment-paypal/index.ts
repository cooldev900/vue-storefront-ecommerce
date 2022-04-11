import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { paypalStore } from './store'
import { beforeRegistration } from './hooks/beforeRegistration'
import { afterRegistration } from './hooks/afterRegistration'
import i18n from '@vue-storefront/i18n';

export const KEY = 'payment-paypal-magento2'

export const PaymentPaypalModule: StorefrontModule = function ({ store, router, appConfig }) {
  beforeRegistration(appConfig, store)
  store.registerModule(KEY, paypalStore)

  const VSF_PAYPAL_CODE = 'paypal_express'

  let paymentMethodConfig = {
    'title': i18n.t('Pay by Card (Paypal)'),
    'code': VSF_PAYPAL_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': false
  }
  store.dispatch('checkout/addPaymentMethod', paymentMethodConfig)
  afterRegistration(appConfig, store)
}