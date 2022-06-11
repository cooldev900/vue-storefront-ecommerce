import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore';
import App from './App';
import routes from './router';
import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import '@vue-storefront/core/lib/passive-listeners';
import { once } from '@vue-storefront/core/helpers';
import { module as cartModule } from './store/cart';

import { claimsStore } from 'theme/store/claims';
import { vehiclesStore } from 'theme/store/vehicles';
import { omLocatorStore } from 'theme/store/om-locator';
import { homepageStore } from 'theme/store/homepage';
import { uiStore } from 'theme/store/ui';
import { promotedStore } from 'theme/store/promoted-offers';
import { instagramStore } from 'theme/store/instagram-images';
import { FulfillmentStore } from 'theme/store/fulfillment';
import { defaultContentStore } from 'theme/store/default-content';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import OmPanZoom from 'theme/components/omni/om-panzoom.vue';
import * as sbComponents from 'theme/components/storyblok/index.js';
import VueGtm from '@gtm-support/vue2-gtm';
import config from 'config';

Object.keys(sbComponents).map(key => {
  Vue.component(sbComponents[key].name, sbComponents[key]);
})
console.log(config, 'config');
Vue.use(VueAwesomeSwiper /* { default options with global component } */);
// Vue.use(VueReCaptcha, { siteKey: config.recaptcha.siteKey });
Vue.use(VueReCaptcha, { siteKey: '6LeMJLkZAAAAADcLY2qurohjqjDcZszw98_u1MSE' });
Vue.component('OmPanZoom', OmPanZoom);

once('__VUE_EXTEND_DROPPOINT_VPB__', () => {
  const options = {
    color: '#4d4d4d'
  };
  Vue.use(VueProgressBar, options);
});

Vue.use(VueGtm, {
  id: 'GTM-KGSW2FF', // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: {
    // Add URL query string when loading gtm.js with GTM ID (required when using custom environments)
    gtm_auth: 'Y9y_2zsEToHvV1jyo9EKLQ',
    gtm_preview: 'env-4',
    gtm_cookies_win: ''
  },
  defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
  compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
  nonce: '', // Will add `nonce` to the script tag
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  ignoredViews: [], // Don't trigger events for specified router names (optional)
  trackOnNextTick: false // Whether or not call trackView in Vue.nextTick
});

const themeEntry = App;
function initTheme (app, router, store, config) {
  store.registerModule('themeCart', cartModule);
  setupMultistoreRoutes(config, router, routes, 10);

  StorageManager.init('claims');
  store.registerModule('claims', claimsStore);
  store.registerModule('homepage', homepageStore);
  store.registerModule('ui', uiStore);
  store.registerModule('promoted', promotedStore);
  store.registerModule('instagram', instagramStore);
  store.registerModule('defaultContent', defaultContentStore);
  store.registerModule('vehicles', vehiclesStore);
  store.registerModule('omLocator', omLocatorStore);
  store.registerModule('Fulfillment', FulfillmentStore);
}

export { themeEntry, initTheme };
