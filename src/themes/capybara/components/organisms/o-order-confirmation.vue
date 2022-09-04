<template>
  <div id="o-order-confirmation">
    <div class="banner">
      <div class="banner__info">
        <div class="confirmed">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               width="96" height="96"
               viewBox="0 0 24 24"
          ><path d="M12,22.5A10.5,10.5,0,1,0,1.5,12,10.5118,10.5118,0,0,0,12,22.5Zm0-20A9.5,9.5,0,1,1,2.5,12,9.51081,9.51081,0,0,1,12,2.5ZM8.64648,12.35352a.5.5,0,0,1,.707-.707L11,13.293l3.64648-3.64649a.5.5,0,0,1,.707.707l-4,4a.49984.49984,0,0,1-.707,0Z" /></svg>
        </div>
        <SfHeading
          :title="OnlineOnly ? $t('It\'s ordered!') : $t('You are offline')"
          :level="2"
          class="sf-heading--no-underline"
        />
        <p v-if="OnlineOnly && lastOrderConfirmation.orderNumber" class="banner__order-number">
          {{ $t('Order No.') }} <strong>{{ lastOrderConfirmation.orderNumber }}</strong>
        </p>
        <div class="appointment">Appointment: {{ getBookedTime }}</div>
      </div>
    </div>
    <div class="wrapper">
      <template v-if="OnlineOnly">
        <p class="paragraph">
          {{ $t('Thank you for placing your order. This is now being processed by our team and you will receive an email with your order confirmation details.') }}
        </p>
      </template>
      <!-- <SfButton
        v-if="!isPermissionGranted && isNotificationSupported"
        class="wrapper__notifications-button"
        @click.native="requestNotificationPermission()"
      >
        {{ $t('Allow order notifications') }}
      </SfButton> -->
       <div class="back-to-shop">
      <SfButton
        class="btn om-button"
        @click="handleClick"
      >
        {{ $t('Continue Shopping') }}
      </SfButton>
       </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash-es/get';
import { mapState, mapGetters } from 'vuex';
import config from 'config';
import VueOfflineMixin from 'vue-offline/mixin';
import { EmailForm } from '@vue-storefront/core/modules/mailer/components/EmailForm';
import { isServer } from '@vue-storefront/core/helpers';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { MailerModule } from '@vue-storefront/core/modules/mailer';
import { SfHeading, SfButton } from '@storefront-ui/vue';
import {
  localizedRoute
} from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OOrderConfirmation',
  components: { SfHeading, SfButton },
  mixins: [VueOfflineMixin, EmailForm],
  data () {
    return {
      feedback: '',
      notificationPermission: ''
    };
  },
  computed: {
    ...mapState({
      lastOrderConfirmation: state => get(state, 'order.last_order_confirmation.confirmation') || {},
      checkoutPersonalEmailAddress: state => state.checkout.personalDetails.emailAddress
    }),
    ...mapGetters({
      slotData: 'vehicles/getSlotData',
    }),
    getBookedTime() {
      if (this.slotData?.id) {
        let date = this.slotData.start_time.slice(0, 11);
        let start_time = this.slotData.start_time.slice(11, 13);
        let end_time = this.slotData.end_time.slice(11, 13);
        start_time = start_time === '12' ? '12:00 PM' : start_time > 12 ? (start_time - 12) +  ":00 PM" : start_time +  ":00 AM";
        end_time = end_time === '12' ? '12:00 PM' : end_time > 12 ? (end_time - 12) +  ":00 PM" : end_time +  ":00 AM";
        return `${date} ${start_time} ~ ${end_time}`;
      } else {
        return '';
      }
    },
    isNotificationSupported () {
      if (isServer || !('Notification' in window)) return false;
      return 'Notification' in window;
    },
    isPermissionGranted () {
      return this.isNotificationSupported && this.notificationPermission === 'granted';
    },
    mailerElements () {
      return config.mailer.contactAddress;
    }
  },
  beforeCreate () {
    registerModule(MailerModule);
  },
  destroyed () {
    this.$store.dispatch('checkout/setThankYouPage', false);
  },
  methods: {
    handleClick() {
      this.$router.push(localizedRoute('/'))
    },
    async clearAll() {
      await this.$store.dispatch('cart/clear', { sync: false }, { root: true })
      await this.$store.dispatch('checkout/savePersonalDetails', {});
      await this.$store.dispatch('checkout/saveShippingDetails', {});
      await this.$store.dispatch('checkout/savePaymentDetails', {});
      await this.$store.dispatch('checkout/dropPassword')
      await this.$store.dispatch('vehicles/clearCheckoutSteps');
      await this.$store.commit('vehicles/setSlotData', {});
    },
    requestNotificationPermission () {
      if (this.isNotificationSupported && !this.isPermissionGranted) {
        Notification.requestPermission()
          .then(permission => {
            this.notificationPermission = permission;
          });
      }
    },
    sendFeedback () {
      this.sendEmail(
        {
          sourceAddress: this.checkoutPersonalEmailAddress,
          targetAddress: this.mailerElements,
          subject: this.$t('What we can improve?'),
          emailText: this.feedback
        },
        this.onSuccess,
        this.onFailure
      );
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message,
        action1: { label: this.$t('OK') }
      });
      if (this.mailerElements.sendConfirmation) {
        this.sendEmail({
          sourceAddress: this.mailerElements,
          targetAddress: this.checkoutPersonalEmailAddress,
          subject: this.$t('Confirmation of receival'),
          emailText: this.$t(`Dear customer,\n\nWe have received your letter.\nThank you for your feedback!`),
          confirmation: true
        });
      }
    },
    onFailure (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message,
        action1: { label: this.$t('OK') }
      });
    }
  },
  mounted() {
    this.clearAll();
    this.$router.push(localizedRoute('/checkout'));
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#o-order-confirmation {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 100%;
    margin: auto;
  }
}
.confirmed{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 15px;
  svg{
    fill: var(--c-primary);
  }
}
.back-to-shop{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 15px 40px 15px;
}
.banner {
      background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
  &__info {
    padding: 2rem;
    text-align: left;
    @include for-desktop {
      text-align: center;
    }
  }
  &__order-number {
    font-size: 0.875rem;
  }
}
.wrapper {
  max-width: 586px;
  margin: var(--spacer-xl) auto 0;
  padding: 0 var(--spacer-lg) 0 var(--spacer-lg);
  &__notifications-button {
    margin: var(--spacer-2xl) 0 var(--spacer-2xl) 0;
  }
  &__buttons {
    width: 100%;
    display: flex;
    margin: var(--spacer-2xl) 0 var(--spacer-2xl) 0;
    justify-content: space-between;
    @include for-desktop {
      & > button:not(:last-child) {
        margin: 0 var(--spacer-lg) 0 0;
      }
    }
    @include for-mobile {
      flex-direction: column;
      & > button {
        margin: 0 0 var(--spacer) 0;
      }
    }
  }
  @include for-desktop {
    padding: 0;
  }
}
.paragraph {
  line-height: 1.875rem;
  font-size: var(--font-lg);
  text-align: center;
}
.feedback {
  box-sizing: border-box;
  border: 1px solid var(--c-light);
  width: 100%;
  height: 25vh;
  padding: 0.5em;
  font-family: var(--font-family-primary);
  resize: vertical;
}
</style>
