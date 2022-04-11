import ShippingDetails from '@vue-storefront/core/modules/checkout/types/ShippingDetails'
import ShippingMethod from './ShippingMethod'
import PaymentMethod from './PaymentMethod'
import PaymentDetails from '@vue-storefront/core/modules/checkout/types/PaymentDetails'
import PersonalDetails from './PersonalDetails'

export default interface CheckoutData {
  shippingDetails: ShippingDetails,
  shippingMethods: ShippingMethod[],
  paymentMethods: PaymentMethod[],
  paymentDetails: PaymentDetails,
  personalDetails: PersonalDetails,
  taxCountry?: string
}
