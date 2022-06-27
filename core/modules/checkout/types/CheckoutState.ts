import ShippingDetails from './ShippingDetails'
import PaymentDetails from './PaymentDetails'

export default interface CheckoutState {
  order: any,
  paymentMethods: any[],
  shippingMethods: any[],
  personalDetails: {
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
    createAccount: boolean,
    telephone: string,
  },
  shippingDetails: ShippingDetails,
  paymentDetails: PaymentDetails,
  isThankYouPage: boolean,
  modifiedAt: number
}
