import OrderShippingDetails from '@vue-storefront/core/modules/cart/types/OrderShippingDetails'
import PaymentMethod from '@vue-storefront/core/modules/cart/types/PaymentMethod'
import ShippingMethod from '@vue-storefront/core/modules/cart/types/ShippingMethod'
import CheckoutData from '@vue-storefront/core/modules/cart/types/CheckoutData'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const getDefaultShippingMethod = (shippingMethods: ShippingMethod[] = []): ShippingMethod => {
  const onlineShippingMethods = shippingMethods.filter(shippingMethod => !shippingMethod.offline)
  if (!onlineShippingMethods.length) return

  return onlineShippingMethods.find(shippingMethod => !!shippingMethod.default) || onlineShippingMethods[0]
}

const getDefaultPaymentMethod = (paymentMethods: PaymentMethod[] = []): PaymentMethod => {
  if (!paymentMethods || !paymentMethods.length) return

  return paymentMethods.find(item => item.default) || paymentMethods[0]
}

const createOrderData = ({
  shippingDetails,
  shippingMethods,
  paymentMethods,
  paymentDetails,
  personalDetails,
  taxCountry = currentStoreView().tax.defaultCountry
}: CheckoutData): OrderShippingDetails => {
  const country = shippingDetails.country ? shippingDetails.country : taxCountry
  const shipping = getDefaultShippingMethod(shippingMethods)
  const payment = getDefaultPaymentMethod(paymentMethods)

  return {
    country,
    shippingAddress: {
      email: personalDetails.emailAddress,
      firstname: personalDetails.firstName,
      lastname: personalDetails.lastName,
      city: shippingDetails.city,
      postcode: shippingDetails.zipCode,
      street: [shippingDetails.streetAddress],
      telephone: personalDetails.telephone,
    },
    billingAddress: {
      email: personalDetails.emailAddress,
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      city: paymentDetails.city,
      postcode: paymentDetails.zipCode,
      street: [paymentDetails.streetAddress],
      countryId: paymentDetails.country,
      telephone: personalDetails.telephone,
    },
    method_code: shippingDetails && shippingDetails.shippingMethod ? shippingDetails.shippingMethod : shipping.method_code,
    carrier_code:
    shippingDetails && shippingDetails.shippingMethod ? shippingDetails.shippingMethod : shipping.carrier_code,
    payment_method: payment && payment.code ? payment.code : null
  };
}

export default createOrderData
