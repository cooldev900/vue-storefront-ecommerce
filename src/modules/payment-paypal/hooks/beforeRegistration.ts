import { isServer } from '@vue-storefront/core/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

declare global {
  interface Window { paypalScriptLoaded: Boolean; }
}

export function beforeRegistration(config, store) {
  if (!isServer && config.hasOwnProperty('paypal') && config.paypal.addJsToGlobalHead && !window.paypalScriptLoaded) {
    const storeView = currentStoreView()
    // const { currencyCode } = storeView.i18n
    const clientId = config.paypal.hasOwnProperty('clientId') ? config.paypal.clientId : ''
    // const disabledPaymentOptions = config.paypal.disabledMethods ? config.paypal.disabledMethods.join(',') : 'card,credit,mybank,sofort'
    const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}`
    var script = document.createElement('script')
    script.setAttribute('src', sdkUrl)
    document.head.appendChild(script)
    window.paypalScriptLoaded = true
  }
}
