import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import i18n from '@vue-storefront/i18n';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const OmniInstall: StorefrontModule = function ({ store, router, appConfig }) {
  EventBus.$on('cart-after-itemchanged', () => {
    console.debug('cartItem')
  })
}
