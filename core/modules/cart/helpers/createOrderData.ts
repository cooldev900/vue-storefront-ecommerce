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
      postcode: '0000',
      street: [shippingDetails.streetAddress],
      telephone: shippingDetails.phoneNumber,
    },
    billingAddress: {
      email: personalDetails.emailAddress,
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      city: paymentDetails.city,
      postcode: '0000',
      street: [paymentDetails.streetAddress],
      countryId: paymentDetails.country,
      telephone: paymentDetails.phoneNumber,
    },
    method_code: 'freeshipping',
    carrier_code: 'freeshipping',
    payment_method: payment && payment.code ? payment.code : null
  };
}

export default createOrderData
