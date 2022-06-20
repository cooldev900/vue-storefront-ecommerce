export default interface PaymentDetails {
  email: string,
  firstName: string,
  lastName: string,
  company: string,
  country: string,
  streetAddress: string,
  apartmentNumber: string,
  city: string,
  region_id: number | string,
  state: string,
  zipCode: string,
  phoneNumber: string,
  taxId: string,
  paymentMethod: string,
  paymentMethodAdditional: any
}
