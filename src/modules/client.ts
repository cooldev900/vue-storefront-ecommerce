import { VueStorefrontModule } from '@vue-storefront/core/lib/module';
import { CatalogModule } from '@vue-storefront/core/modules/catalog';
import { CatalogNextModule } from '@vue-storefront/core/modules/catalog-next';
import { CartModule } from '@vue-storefront/core/modules/cart';
import { CheckoutModule } from '@vue-storefront/core/modules/checkout';
import { CompareModule } from '@vue-storefront/core/modules/compare';
import { WishlistModule } from '@vue-storefront/core/modules/wishlist';
import { NotificationModule } from '@vue-storefront/core/modules/notification';
import { UrlModule } from '@vue-storefront/core/modules/url';
import { BreadcrumbsModule } from '@vue-storefront/core/modules/breadcrumbs';
import { UserModule } from '@vue-storefront/core/modules/user';
import { CmsModule } from '@vue-storefront/core/modules/cms';
// import { GoogleTagManagerModule } from './google-tag-manager';
// import { AmpRendererModule } from './amp-renderer';
import { PaymentBackendMethodsModule } from './payment-backend-methods';
// import { PaymentCashOnDeliveryModule } from './payment-cash-on-delivery';
// import { Stripe } from './stripe';
// import { PaymentPaypalModule } from './payment-paypal';
import { NewsletterModule } from '@vue-storefront/core/modules/newsletter';
import { InitialResourcesModule } from '@vue-storefront/core/modules/initial-resources';
import { LexascmsModule } from './vsf-lexascms/src';
import { PaymentCheckoutComModule } from './payment-checkout_com';
import { OmniInstall } from './omni-fitment';

// import { DeviceModule } from './device/index';
import { registerModule } from '@vue-storefront/core/lib/modules';

// TODO:distributed across proper pages BEFORE 1.11
export function registerClientModules () {
  registerModule(UrlModule);
  registerModule(CatalogModule);
  registerModule(CheckoutModule); // To Checkout
  registerModule(CartModule);
  registerModule(PaymentBackendMethodsModule);
  // registerModule(PaymentCashOnDeliveryModule);
  // registerModule(PaymentPaypalModule);
  registerModule(WishlistModule); // Trigger on wishlist icon click
  registerModule(NotificationModule);
  registerModule(UserModule); // Trigger on user icon click
  registerModule(CatalogNextModule);
  registerModule(CompareModule);
  registerModule(BreadcrumbsModule);
  // registerModule(GoogleTagManagerModule)
  // registerModule(AmpRendererModule)
  registerModule(CmsModule);
  registerModule(NewsletterModule);
  registerModule(InitialResourcesModule);
  registerModule(LexascmsModule);
  registerModule(PaymentCheckoutComModule);
  registerModule(OmniInstall);
  // registerModule(DeviceModule)
}

export const registerModules: VueStorefrontModule[] = [
  // other extensions
  // Stripe
  // InstantCheckout,
];
