<template>
  <div class="o-personal-details">
    <div class="form">
      <SfInput
        v-model.trim="personalDetails.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        :required="true"
        :valid="!$v.personalDetails.firstName.$error"
        :error-message="
          !$v.personalDetails.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
        @blur="$v.personalDetails.firstName.$touch()"
      />
      <SfInput
        v-model.trim="personalDetails.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        :required="true"
        :valid="!$v.personalDetails.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.personalDetails.lastName.$touch()"
      />
      <SfInput
        v-model.trim="personalDetails.emailAddress"
        class="form__element"
        name="email-address"
        :label="$t('Email address')"
        :required="true"
        :valid="!$v.personalDetails.emailAddress.$error"
        :error-message="
          !$v.personalDetails.emailAddress.required
            ? $t('Field is required')
            : $t('Please provide valid e-mail address.')
        "
        @blur="$v.personalDetails.emailAddress.$touch()"
      />
      <SfInput
        v-model.trim="personalDetails.telephone"
        class="form__element"
        name="telephone"
        :label="$t('Phone Number')"
        :required="true"
        :valid="!$v.personalDetails.telephone.$error"
        :error-message="
          !$v.personalDetails.telephone.required
            ? $t('Field is required')
            : $t('Please provide valid e-mail address.')
        "
        @blur="$v.personalDetails.emailAddress.$touch()"
      />
      <OmAlertBox type="warning" style="{margin-bottom: 20px, border: 1px solid #ccc;}" v-show="message">
        <template #message>
          <div class="om-alert-box-message">
            <div>
              <p>
                Your choson appointment is no longer available. Please select another time below.
              </p>
            </div>
          </div>
        </template>
      </OmAlertBox>
      <h3>{{ $t('Your appointment') }}</h3>
     <OmAlertBox type="info" style="{margin-bottom: 20px, border: 1px solid #ccc;}">
        <template #message>
          <div class="om-alert-box-message">
            <div>
              <p>
        {{ $t('Booking message') }}
              </p>
            </div>
          </div>
        </template>
      </OmAlertBox>
      <OmAppointmentSelector
        v-model="schedule"
        :appointment-duration="120"
        :appointments-taken="appointmentsTaken"
        :intervals="intervals"
        :non-working-days="[0, 5]"
        :period="5"
      />
      <div class="form__action">
        <SfButton
          class="sf-button--full-width om-btn--primary"
          :disabled=" locationKind === '' || (locationKind === 'click_collect_free' && !activeLocation.id) ? true : createAccount ? $v.$invalid : $v.personalDetails.$invalid"
          @click="goToShipping"
        >
          {{
            $t(isVirtualCart || locationKind === 'click_collect_free' ? "Continue to payment" : "Continue to shipping")
          }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails.ts';
import { SfInput, SfButton, SfHeading, SfCheckbox, SfCharacteristic } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { mapActions, mapGetters } from 'vuex';
import OmLocator from 'theme/components/omni/om-locator';
import OmAppointmentSelector from 'theme/components/omni/om-appointment-selector.vue';
import dayjs from 'dayjs';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import OmAlertBox from 'theme/components/omni/om-alert-box';

export default {
  name: 'OPersonalDetails',
  components: {
    SfInput,
    SfButton,
    SfHeading,
    SfCheckbox,
    SfCharacteristic,
    OmAppointmentSelector,
    OmAlertBox
  },
  mixins: [PersonalDetails],
  computed: {
    ...mapGetters({
      location: 'omLocator/location',
      activeLocation: 'omLocator/activeLocation',
      locationKind: 'omLocator/locationKind',
      isVirtualCart: 'cart/isVirtualCart',
      message: 'vehicles/getAppointmentError'
    })
  },
  props: {
    nextAccordion: {
      type: Function,
      default: (Number) => {}
    }
  },
  data () {
    return {
      characteristics: [
        {
          description: this.$t('Faster checkout'),
          icon: 'clock'
        },
        {
          description: this.$t('Full rewards program benefits'),
          icon: 'rewards'
        },
        {
          description: this.$t('Earn credits with every purchase'),
          icon: 'credits'
        },
        {
          description: this.$t('Manage your wishlist'),
          icon: 'heart'
        }
      ],
      schedule: {
        start: dayjs()
          .add(1, 'day')
          .hour(14)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss'),
        end: dayjs()
          .add(1, 'day')
          .hour(16)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss')
      },
      minWeeks: 2,
      intervals: [
        {
          from: {
            hour: 8,
            minute: 0
          },
          to: {
            hour: 20,
            minute: 0
          }
        }
      ],
      appointmentsTaken: []
    };
  },
  validations: {
    personalDetails: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      },
      telephone: {
        required
      }
    },
    password: {
      required,
      minLength: minLength(8),
      complex: value => {
        // Check if minimum 3 different classes of characters are used in password.
        // Classes of characters: lower case, upper case, digits and special characters.
        return (
          [
            /(?=[a-z])/.test(value),
            /(?=[A-Z])/.test(value),
            /(?=[0-9])/.test(value),
            /(?=\W)/.test(value)
          ].filter(result => result).length >= 3
        );
      }
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      required
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    login () {
      this.openModal({ name: ModalList.Auth, payload: 'login' })
    },
    openTermsAndConditionsModal () {
      this.openModal({ name: ModalList.TermsAndConditions })
    },
    async goToShipping () {
      this.nextAccordion(0);
      this.sendDataToCheckout();
      await this.$store.dispatch('cart/pullMethods', { forceServerSync: true });
    },
    setAppointment () {
      if (this.slot_id) {
        let payload = {};
        payload.booked_online = true;
        payload.internal_booking = false;
        payload.client_id = config.clientIds[currentStoreView().storeId];
        payload.order_id = this.cartToken;
        payload.id = this.slot_id;
        this.$store.dispatch('vehicles/setAppointment', payload);
        this.$store.commit('vehicles/setSlotID', 0);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-padding: var(--spacer-2xl) 0 var(--spacer-base) 0;
  }
}
.log-in {
  &__info {
    margin: var(--spacer-lg) 0;
    color: var(--c-dark-variant);
    font: var(--font-light) var(--font-base) / 1.6 var(--font-family-primary);
    @include for-desktop {
      font-weight: var(--font-normal);
      font-size: var(--font-sm);
    }
  }
  &__button {
    margin: var(--spacer-2xl) 0 var(--spacer-xl) 0;
  }
}
.info {
  margin: 0 0 var(--spacer-xl) 0;
  flex: 1;
  &__heading {
    font-family: var(--font-family-primary);
    font-weight: var(--font-light);
  }
  &__characteristic {
    --characteristic-description-font-size: var(--font-xs);
    margin: 0 0 var(--spacer-sm) var(--spacer-2xs);
  }
  @include for-desktop {
    margin: 0;
    &__heading {
      margin: 0 0 var(--spacer-sm) 0;
      font-size: var(--font-xs);
    }
    &__characteristic {
      margin: var(--spacer-base) 0;
    }
  }
}
.form {
  margin: 0 !important;
  &__checkbox {
    margin: var(--spacer-base) 0;
  }
  &__action {
    margin: var(--spacer-sm) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }
  @include for-mobile {
    &__checkbox {
      --checkbox-font-family: var(--font-family-primary);
      --checkbox-font-weight: var(--font-light);
      --checkbox-font-size: var(--font-sm);
    }
  }
  @include for-desktop {
    margin: 0 var(--spacer-2xl) 0 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &__element {
      margin: 0 0 var(--spacer-base) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-lg);
        }
      }
    }
  }
  .terms {
    margin: 0 0 0 0.4em;
  }
}
.no-flex {
  flex: unset;
}

.om-locator {
  margin-bottom: var(--spacer-xl);
}

</style>
