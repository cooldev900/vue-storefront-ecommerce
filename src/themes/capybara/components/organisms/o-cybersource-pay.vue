<template>
  <div>
    <OmAlertBox type="info">
      <template #message>
        <div class="om-alert-box-message">
          <div>
            <p>
              You will be redirected to CyberSource to make a secure payment
            </p>
          </div>
        </div>
      </template>
    </OmAlertBox>
    <img style="max-width: 350px" src="/assets/supported-cards.png">
    <form
      class="sf-button--full-width"
      method="post"
      action="https://secureacceptance.cybersource.com/pay"
      id="form1"
      name="form1"
      ref="form"
    >
      <!-- general parameters: see Form parameters -->
      <input type="hidden" name="access_key" :value="edpqForm.access_key">
      <input type="hidden" name="amount" :value="edpqForm.amount">
      <input type="hidden" name="currency" :value="edpqForm.currency">
      <input type="hidden" name="locale" :value="edpqForm.locale">
      <input type="hidden" name="profile_id" :value="edpqForm.profile_id">
      <input type="hidden" name="reference_number" :value="edpqForm.reference_number">
      <input type="hidden" name="signed_date_time" :value="edpqForm.signed_date_time">
      <input type="hidden" name="signed_field_names" :value="edpqForm.signed_field_names">
      <input type="hidden" name="transaction_type" :value="edpqForm.transaction_type">
      <input type="hidden" name="transaction_uuid" :value="edpqForm.transaction_uuid">
      <input type="hidden" name="bill_to_forename" :value="edpqForm.bill_to_forename">
      <input type="hidden" name="bill_to_surname" :value="edpqForm.bill_to_surname">
      <input type="hidden" name="bill_to_email" :value="edpqForm.bill_to_email">
      <input type="hidden" name="bill_to_address_line1" :value="edpqForm.bill_to_address_line1">
      <input type="hidden" name="bill_to_address_country" :value="edpqForm.bill_to_address_country">
      <input type="hidden" name="bill_to_address_city" :value="edpqForm.bill_to_address_city">

      <!-- check before the payment: see Security: Check before the payment -->
      <input type="hidden" name="signature" :value="edpqForm.signature">
      <!-- layout information: see Look and feel of the payment page -->

      <SfButton
        class="sf-button--full-width om-btn--primary"
        @click.prevent="process"
      >
        {{ $t("Continue to Payment") }}
      </SfButton>
    </form>
  </div>
</template>
<script>

import {
  SfButton
} from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import axios from 'axios';
import config from 'config';
import { ModalList } from 'theme/store/ui/modals';
import OmAlertBox from 'theme/components/omni/om-alert-box';

export default {
  name: 'OCybersourcepay',
  components: {
    SfButton,
    // PaymentStripe,
    OmAlertBox
  },
  props: {
    editAccordion: {
      type: Function,
      default: (Number) => {}
    }
  },
  async mounted () {
    this.makeform();
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    async process () {
      // this.openModal({ name: ModalList.OmAppointmentModal, payload: {} })
      let client_id = this.getSlotData.client_id;
      let slot_id = this.getSlotID;
      try {
        let { data } = await axios.get(`${config.api.url}/api/ext/appointments/available-slot?client_id=${client_id}&slot_id=${slot_id}`);
        console.log(data, 'available slot');
        if (data?.success) {
          let bookingId = this.getSlotData.id;
          let token = this.token ? this.token : '';
          let cartId = this.cartToken;
          let body = {
            giftMessage: {
              sender: "customer",
              recipient: "vehicle_data",
              message: `cartId: ${cartId}, appointmentId: ${bookingId}`,
            }
          };
          await axios({method: 'POST', url: `${config.api.url}/api/cart/additional-order-data?cartId=${cartId}&token=${token}`, headers: {}, data: body});
          this.$store.commit('vehicles/setAppointmentError', '');
          this.$refs.form.submit();
        } else {
          this.$store.commit('vehicles/setAppointmentError', 'This slot is not available');
          this.editAccordion(0);
        }
      } catch (e) {
        this.$store.commit('vehicles/setAppointmentError', 'Appointment Error');
        this.editAccordion(0);
      }
    },
    // async process() {
    //   try {
    //     let params = {
    //       client_id: this.getSlotData.client_id,
    //       id: this.getSlotData.id,
    //       end_time: this.getSlotData.end_time,
    //       order_id: this.getSlotData.order_id,
    //       start_time: this.getSlotData.start_time,
    //       booked_online: true,
    //       internal_booking: false,
    //       duration: 2
    //     }
    //     let { data } = await axios.post(`${config.api.url}/api/ext/appointments`, params, {
    //       params
    //     } );
    //     if (data?.success) {
    //       let bookingId = data.result.data[0].id;
    //       let token = this.token ? this.token : '';
    //       let cartId = this.cartToken;
    //       let body = {
    //         giftMessage: {
    //           sender: "customer",
    //           recipient: "vehicle_data",
    //           message: `cartId: ${cartId}, appointmentId: ${bookingId}`,
    //         }
    //       };
    //       await axios({method: 'POST', url: `${config.api.url}/api/cart/additional-order-data?cartId=${cartId}&token=${token}`, headers: {}, data: body});
    //       this.$store.commit('vehicles/setAppointmentError', '');
    //       this.$refs.form.submit();
    //     } else {
    //       this.$store.commit('vehicles/setAppointmentError', data.result.message);
    //       this.editAccordion(0);
    //     }
    //   } catch (e) {
    //     this.$store.commit('vehicles/setAppointmentError', 'Appointment Error');
    //     this.editAccordion(0);
    //   }

    // },
    makeform () {
      const storeId = currentStoreView().storeId

      this.edpqForm.access_key = '98f0ea46fe1a3a66bc929cf8992016f3';
      this.edpqForm.currency = 'QAR';
      this.edpqForm.locale = storeId === 3 ? 'ar-xn' : 'en-US';
      this.edpqForm.profile_id = '2F345408-FFA6-4791-BC81-762D0E8320E0';
      this.edpqForm.signed_field_names = 'access_key,amount,currency,locale,profile_id,reference_number,signed_date_time,signed_field_names,transaction_type,transaction_uuid,bill_to_forename,bill_to_surname,bill_to_email,bill_to_address_line1,bill_to_address_country,bill_to_address_city';
      this.edpqForm.transaction_type = 'sale';
      this.edpqForm.reference_number = this.cartToken;
      this.edpqForm.amount = this.prices.grand_total;
      this.edpqForm.signed_date_time = new Date().toISOString().substring(0, 19) + 'Z';
      this.edpqForm.transaction_uuid = Math.floor(Math.random() * 100000000);
      this.edpqForm.bill_to_forename = this.getPersonalDetails.firstName;
      this.edpqForm.bill_to_surname = this.getPersonalDetails.lastName;
      this.edpqForm.bill_to_email = this.getPersonalDetails.emailAddress;
      this.edpqForm.bill_to_address_line1 = this.getPaymentDetails.streetAddress;
      this.edpqForm.bill_to_address_country = this.getPaymentDetails.country;
      this.edpqForm.bill_to_address_city = this.getPaymentDetails.city;
      let signedFieldNames = this.edpqForm.signed_field_names.split(',');
      let data = [];
      let edpqForm = this.edpqForm;
      signedFieldNames.forEach((item) => {
        console.log(item, 'key');
        data.push(item + '=' + edpqForm[item]);
      });
      data = data?.length ? data.join(',') : '';
      const secretKey = 'a967392922ae4f8abef4d94decba064a53a812b0b3c4431592ef2fd5daf8ef8329d0f68b17b049f0ba7479d1ebb03e258606ae60ba4441d4bdeac3a811d66318eae8cd76048b41cbb9f2d2a78ccc55c99ccd5f2c0e5c4fed9891158a69285a7b9239dbb9886c4b39850b0a48f096b52f40485cd8627a4495afffe0ce32b31775';
      this.edpqForm.signature = this.$CryptoJS.HmacSHA256(data, secretKey).toString(this.$CryptoJS.enc.Base64);
    }
  },
  watch: {
    getPaymentDetails () {
      this.makeform();
    },
    getPersonalDetails () {
      this.makeform();
    }
  },
  computed: {
    ...mapGetters({
      getPaymentDetails: 'checkout/getPaymentDetails',
      getPersonalDetails: 'checkout/getPersonalDetails',
      cartToken: 'cart/getCartToken',
      totals: 'cart/getTotals',
      getSlotData: 'vehicles/getSlotData',
      cartToken: 'cart/getCartToken',
      token: 'user/getToken',
      getSlotID: 'vehicles/getSlotID'
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    }
  },
  data () {
    return {
      shaSign: '',
      edpqForm: {
        access_key: '98f0ea46fe1a3a66bc929cf8992016f3',
        amount: 0,
        currency: 'QAR',
        locale: 'en-US',
        profile_id: '2F345408-FFA6-4791-BC81-762D0E8320E0',
        reference_number: '',
        signed_date_time: '',
        signed_field_names: 'access_key,amount,currency,locale,profile_id,reference_number,signed_date_time,signed_field_names,transaction_type,transaction_uuid,bill_to_forename,bill_to_surname,bill_to_email,bill_to_address_line1,bill_to_address_country,bill_to_address_city',
        transaction_type: 'sale',
        transaction_uuid: '',
        signature: '',
        bill_to_forename: '',
        bill_to_surname: '',
        bill_to_email: '',
        bill_to_address_line1: '',
        bill_to_address_country: '',
        bill_to_address_city: ''
      }
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.form {
  &__checkbox {
    --checkbox-label-color: var(--c-dark-variant);
    margin: 0 0 var(--spacer-sm) 0;
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    margin: var(--spacer-base) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }

  &_button {
    color: #654855;
    cursor: pointer;
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 var(--spacer-xs);
    &__element {
      padding: 0 0 var(--spacer-xs) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
  }
}
.payment-method {
  --radio-container-align-items: center;
  --radio-container-padding: var(--spacer-sm) 0;
  --ratio-content-margin: 0 0 0 var(--spacer-lg);
  --radio-background: transparent;
  @include for-desktop {
    --radio-container-padding: var(--spacer-sm);
  }
}
</style>
