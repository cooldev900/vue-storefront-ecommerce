import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { LexascmsStore } from './store';

export const LexascmsModule: StorefrontModule = function ({ store }) {
  // Register new LexasCMS Vuex module
  store.registerModule('vsf-lexascms', LexascmsStore);
}
