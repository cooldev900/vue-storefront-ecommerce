<template>
  <div id="checkout">
    <div v-if="!isThankYouPage" class="checkout grid">
      <div class="checkout__main">
        <SfAccordion :open="opens" class="accordion">
          <SfAccordionItem header="order" ref="personalDetails" id="order">
            <template v-slot:header>
              <OmCheckoutAccordionHeader
                :allStep="3"
                :step="1"
                step="1"
                title="Your Details"
                id="order1"
                :is-complete="isComplete.order"
              />
            </template>
            <div class="form" v-show="!isComplete.order">
              <OPersonalDetails
                :is-active="true"
                :next-accordion="nextAccordion"
              />
            </div>
            <div v-show="isComplete.order">
              <div class="edit" v-show="editable">
                <div
                  role="button"
                  tabindex="0"
                  class="edit__inner"
                  @click="editAccordion(0)"
                >
                  Edit <span>delivery order</span>
                </div>
              </div>
              <div class="confirm">
                <div>Your Email: {{getPersonalDetails.emailAddress}}</div>
                <div>Your Name: {{getPersonalDetails.firstName + ' ' + getPersonalDetails.lastName}}</div>
                <div>Phone Number: {{getPersonalDetails.telephone}}</div>
                <div>Appointment: {{ getBookedTime }}</div>
              </div>
            </div>
          </SfAccordionItem>
          <SfAccordionItem header="address" ref="shipping" id="address">
            <template v-slot:header>
              <OmCheckoutAccordionHeader
                :allStep="3"
                :step="2"
                id="address1"
                title="Delivery Address"
                :is-complete="isComplete.address"
              />
            </template>
            <div v-show="!isComplete.address">
              <OShipping :next-accordion="nextAccordion" />
            </div>
            <div v-show="isComplete.address">
              <div class="edit" v-show="editable">
                <div
                  role="button"
                  tabindex="0"
                  class="edit__inner"
                  @click="editAccordion(1)"
                >
                  Edit <span>delivery address</span>
                </div>
              </div>
              <div class="confirm">                
                <div v-show="locationKind !== 'click_collect_free'">Shipping Address : {{ shippingAddressText }}</div>
               <div v-show="locationKind === 'click_collect_free'">Collection from: {{activeLocation.location_name}}</div>
              </div>
            </div>
          </SfAccordionItem>
          <SfAccordionItem header="payment" ref="payment" id="payment">
            <template v-slot:header>
              <OmCheckoutAccordionHeader
                :allStep="3"
                :step="3"
                title="Payment"
                id="payment1"
                :is-complete="isComplete.payment"
              />
            </template>
            <div v-show="!isComplete.payment">
              <OPayment :next-accordion="nextAccordion" :validateOrderBeforeSending="validateOrderBeforeSending"/>
            </div>
            <div v-show="isComplete.payment">
              <div class="edit" v-show="editable">
                <div
                  role="button"
                  tabindex="0"
                  class="edit__inner"
                  @click="editAccordion(3)"
                >
                  Edit <span>delivery payment</span>
                </div>
              </div>
            </div>
          </SfAccordionItem>
        </SfAccordion>
      </div>
      <div class="checkout__aside desktop-only">
        <OOrderSummary />
      </div>
    </div>
    <OOrderConfirmation v-if="isThankYouPage" />
    <div />
  </div>
</template>
<script>
import Checkout from '@vue-storefront/core/pages/Checkout';
import { SfSteps, SfButton, SfAccordion, SfInput, SfImage } from '@storefront-ui/vue';
import OPayment from 'theme/components/organisms/o-payment';
import OShipping from 'theme/components/organisms/o-shipping';
import OShippingMethod from 'theme/components/organisms/o-shipping-method';
import OConfirmOrder from 'theme/components/organisms/o-confirm-order';
import OOrderReview from 'theme/components/organisms/o-order-review';
import OOrderSummary from 'theme/components/organisms/o-order-summary';
import OOrderConfirmation from 'theme/components/organisms/o-order-confirmation';
import OPersonalDetails from 'theme/components/organisms/o-personal-details';
import { mapActions, mapGetters } from 'vuex';
import OmCheckoutAccordionHeader from 'theme/components/om-checkout/om-checkout-accordion-header.vue';
import OmLocator from 'theme/components/omni/om-locator.vue';
import APromoCode from 'theme/components/atoms/a-promo-code';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'Checkout',
  components: {
    SfSteps,
    OPayment,
    OShipping,
    OOrderReview,
    OOrderSummary,
    OConfirmOrder,
    OPersonalDetails,
    OOrderConfirmation,
    SfButton,
    SfAccordion,
    OmCheckoutAccordionHeader,
    OmLocator,
    SfInput,
    SfImage,
    APromoCode,
    OShippingMethod
  },
  mixins: [Checkout],
  data () {
    return {
      steps: [
        {
          key: 'personalDetails',
          name: this.$t('Details'),
          component: OPersonalDetails
        },
        {
          key: 'shipping',
          name: this.$t('Shipping'),
          component: OShipping
        },
        {
          key: 'payment',
          name: this.$t('Payment'),
          component: OPayment
        }
      ],
      models: {
        order: {
          email: ''
        },
        address: {},
        payment: {}
      },
      isComplete: {
        order: false,
        address: false,
        payment: false
      },
      step: -1,
      opens: ['order'],
      editable: true
    };
  },
  computed: {
    ...mapGetters({
      isCompleteData: 'vehicles/isCompleteData',
      opensData: 'vehicles/opensData',
      stepData: 'vehicles/stepData',
      getShippingDetails: 'checkout/getShippingDetails',
      getPersonalDetails: 'checkout/getPersonalDetails',
      getPaymentDetails: 'checkout/getPaymentDetails',
      productsInCart: 'cart/getCartItems',      
      activeLocation: 'omLocator/activeLocation',
      locationKind: 'omLocator/locationKind',
      isVirtualCart: 'cart/isVirtualCart',
      currentDay: 'vehicles/getCurrentDay',
      slotData: 'vehicles/getSlotData',
    }),
    currentStep () {
      return this.steps.findIndex((step) => this.activeSection[step.key]);
    },
    storeview () {
      return currentStoreView();
    },
    shippingAddressText () {
      let excludeFields = ['firstName', 'lastName', 'emailAddress', 'shippingCarrier', 'shippingMethod', 'region_id', 'telephone', 'phoneNumber', 'country'];
      return Object.keys(this.getShippingDetails).filter(payment => !excludeFields.includes(payment) && this.getShippingDetails[payment]).map(key => this.getShippingDetails[key]).join(', ');
    },    
    getBookedTime() {
      if (this.slotData?.id) {
        let date = this.slotData.start_time.slice(0, 11);
        let start_time = this.slotData.start_time.slice(11, 13);
        let end_time = this.slotData.end_time.slice(11, 13);
        start_time = start_time >= 12 ? (start_time - 12) +  ":00 PM" : start_time +  ":00 PM";
        end_time = end_time >= 12 ? (end_time - 12) +  ":00 PM" : end_time +  ":00 PM";
        return `${date} ${start_time} ~ ${end_time}`;
      } else {
        return '';
      }
    },
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleSidebar',
      saveCompete: 'vehicles/saveCompete',
      saveOpens: 'vehicles/saveOpens',
      saveStep: 'vehicles/saveStep',
    }),
    nextAccordion (index) {
      // if (index === 0 && this.locationKind === 'click_collect_free') {
      //    this.isComplete[Object.keys(this.models)[index]] = true;
      //    this.isComplete = {
      //      order: true,
      //      address: false,
      //      payment: false
      //    }
      //   //  this.isComplete[Object.keys(this.models)[index + 1]] = true;
      //    this.opens = ['order','payment'];
      //    this.step = 2;
      //    this.saveCompete(this.isComplete);
      //    this.saveOpens(this.opens);
      //    this.goto();
      //    this.saveStep(this.step);
      //    this.editable = true;
      //    return;
      // }
      this.isComplete[Object.keys(this.models)[index]] = true;
      // if (this.isComplete[Object.keys(this.models)[index + 1]] === true) index++;

      if (index < 2) { 
          this.step = index + 1;
        this.opens = [...this.opens, Object.keys(this.models)[this.step]];
      }
      if (index < 3) {
        this.isComplete[Object.keys(this.models)[index]] = true;
        this.saveCompete(this.isComplete);
        this.saveOpens(this.opens);
      }
      this.goto();
      this.saveStep(this.step);
      this.editable = true;
    },
    editAccordion (index) {
      // if (this.locationKind === 'click_collect_free' && index === 1) return;
      // this.opens = [...this.opens, Object.keys(this.models)[index]];
      this.editable = false;
      let opens = [];
      for (let i = 0; i < index; i++) {
        this.isComplete[Object.keys(this.models)[i]] = true;
        opens.push(Object.keys(this.models)[i]);
      }

      for (let i = index ; i < 4; i++) {
        this.isComplete[Object.keys(this.models)[i]] = false;
      }

      // this.isComplete[Object.keys(this.models)[this.step]] = false;
      // let opens = this.opens.filter(
      //   (open) => open !== Object.keys(this.models)[this.step]
      // );
      this.opens = [...opens, Object.keys(this.models)[index]];
      // this.isComplete[Object.keys(this.models)[index]] = false;
      this.saveOpens(this.opens);
      this.saveCompete(this.isComplete);
      this.step = index;
      this.goto();
      this.saveStep(this.step);
    },
    changeStep (nextStep) {
      if (nextStep < this.currentStep) {
        this.$bus.$emit('checkout-before-edit', this.steps[nextStep].key);
      }
    },
    showNotification ({ type, message }) {
      this.$store.dispatch('notification/spawnNotification', {
        type,
        message,
        action1: { label: this.$t('OK') }
      });
    },
    notifyEmptyCart () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Shopping cart is empty. Please add some products before entering Checkout'
        )
      });
    },
    notifyOutStock (p) {
      this.showNotification({
        type: 'danger',
        message: p.name + this.$t(' is out of stock!')
      });
    },
    notifyNotAvailable () {
      this.showNotification({
        type: 'danger',
        message: this.$t('Some of the ordered products are not available!')
      });
    },
    notifyStockCheck () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Stock check in progress, please wait while available stock quantities are checked'
        )
      });
    },
    notifyNoConnection () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'
        )
      });
    },
    showOrderReview () {
      this.openMicrocart({ type: 'microcart' });
    },
    goto () {
      if (this.step !== -1) setTimeout(() => { document.getElementById(Object.keys(this.models)[this.step]).scrollIntoView({ behavior: 'smooth' }); }, 0);
      if (this.isThankYouPage) setTimeout(() => { document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' }); }, 0);
    }
  },
  async mounted () { 
    await this.$store.commit('omLocator/setLocationKind', 'delivery_estimate_free');
    if (Object.keys(this.isCompleteData).length > 2) {
      this.isComplete = { ...this.isCompleteData };
    }

    if (this.opensData?.length) this.opens = this.opensData;
    if (this.step === -1) {
      this.step = this.stepData;
      this.goto();
    }
  },
  watch: {
    isThankYouPage() {
      this.goto();
    },
    isCompleteData (value) {
      if (JSON.stringify(value) !== JSON.stringify(this.isComplete)) {
        this.isComplete = { ...value };
      }
    },

    opensData (value) {
      if (JSON.stringify(value) !== JSON.stringify(this.opens)) {
        this.opens = [...value];
      }
    },

    stepData (value) {
      if (value === 0) {
        this.$store.dispatch('vehicles/fetchAppointmentTaken', this.currentDay);
      }
      if (this.step !== this.stepData) { this.step = this.stepData; this.goto();}
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.mercedes__cart-header{
  background: #000;
  padding: var(--spacer-lg) 0;
.cart-header{
    display: flex;
  &__title{
    width: 50%;
    h1{
      color: #fff;
    }
  @include for-mobile{
    width: 100%;
    text-align: center;
  }
  }
  &__illustration-img{
    width: 50%;
    object-fit: contain;
    align-self: center;
  }
}
}
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    padding: 0;
    background: #f4f4f4;
    margin: 0 auto;
  }
}

.grid {
  margin: 0;
  padding: 0;
  @include for-desktop{
  padding: 0 15px;
  }
  @include for-desktop {
    margin-left: auto;
    margin-right: auto;
    padding-right: 12px;
    padding-left: 12px;
    max-width: 1280px;
  }
}

.checkout {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  width: 100%;

  @include for-desktop {
    --steps-content-padding: 0;
    flex-direction: row;
    padding: 0 12px;
  }

  &__main {
    background-color: #f4f4f4;
    width: 100%;
    order: 2;

    @include for-desktop {
      flex: 1;
      width: 66%;
      order: 1;
    }
  }

  &__aside {
    padding: 0px;
    order: 1;

    @include for-desktop {
      padding: 16px;
      width: 33%;
      order: 2;
    }
  }
}
.sf-accordion{
  @include for-mobile{
    padding: 0 10px
  }
}
::v-deep .sf-steps__content {
  display: flex;
  @include for-mobile {
    display: block;
    margin-top: 20px;
  }
}
::v-deep .sf-steps__header {
  @include for-desktop {
    max-width: 600px;
    margin: 20px auto;
  }
}
.order-review {
  margin: var(--spacer-sm) 0;
}
.container {
  display: flex;
}

.sf-accordion-item {
  position: relative;
  background: #fff;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 0 2px 0 rgba(0,0,0,0.1), 0 2px 4px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
  .edit {
    position: absolute;
    top: 40px;
    font-size: 12px;
    right: 20px;
    cursor: pointer;
    color: #333;
  }
}

.confirm {
  width: 100%;
  padding: 0;
  line-break: anywhere;
}
::v-deep .sf-accordion-item__content{
  padding: 10px 0 !important;
  border: none !important
}
</style>
