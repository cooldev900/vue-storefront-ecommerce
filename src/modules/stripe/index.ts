import { createModule } from '@vue-storefront/core/lib/module';
import { beforeRegistration } from './hooks/beforeRegistration';

export const KEY = 'stripe';
export const Stripe = createModule({
  key: KEY,
  beforeRegistration
});
