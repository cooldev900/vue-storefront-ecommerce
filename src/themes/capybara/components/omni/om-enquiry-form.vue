<template>
  <div id="form-template">
    <div class="form">
      <SfInput
        v-model="firstName"
        label="First name"
        name="firstName"
        class="form__element form__element--half"
        required
        :valid="firstNameBlur || validFirstName(firstName)"
        error-message="Please type your name"
        @blur="firstNameBlur = false"
      />
      <SfInput
        v-model="lastName"
        label="Last name"
        name="lastName"
        class="form__element form__element--half form__element--half-even"
        required
        :valid="lastNameBlur || validLastName(lastName)"
        error-message="Please type your last name. Your name should have at least one character."
        @blur="lastNameBlur = false"
      />
      <SfInput
        v-model="phoneNumber"
        label="Phone number"
        name="phone"
        type="number"
        class="form__element form__element--half"
        :valid="validPhoneNumber(phoneNumber)"
        error-message="Please enter 9 digital numbers."
      />
      <SfInput
        v-model="email"
        label="Email"
        name="email"
        class="form__element form__element--half form__element--half-even"
        required
        :valid="emailBlur || validEmail(email)"
        error-message="Please enter a valid email address."
        @blur="emailBlur = false"
      />
      <SfInput
        v-model="vin"
        label="Registration / VIN"
        name="vin"
        class="form__element form__element--half"
      />
      <SfInput
        v-model="item_required"
        label="Item Required"
        name="item_required"
        class="form__element form__element--half form__element--half-even"
      />
      <SfInput
        v-model="message"
        type="textarea"
        class="form__element"
        label="Message"
        name="message"
        cols="80"
        rows="15"
        maxlength="400"
        minlength="10"
        wrap="soft"
      />
      <div class="form__action">
        <SfButton class="form__action-submit" @click.prevent="submit">
          <SfLoader v-if="loading" :loading="loading" />
          <span v-else>Submit</span>
        </SfButton>
        <SfButton
          class="
            sf-button--text
            form__action-button form__action-button--secondary
          "
          @click="reset"
        >
          Reset
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfInput,
  SfComponentSelect,
  SfButton,
  SfHeading,
  SfRange,
  SfLoader
} from '@storefront-ui/vue';
import axios from 'axios';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';
import { mapActions } from 'vuex';

export default {
  name: 'OmEnquiryForm',
  components: {
    SfButton,
    SfInput,
    SfComponentSelect,
    SfHeading,
    SfRange,
    SfLoader
  },
  data () {
    return {
      valid: false,
      submitted: false,
      firstName: '',
      firstNameBlur: true,
      lastName: '',
      lastNameBlur: true,
      phoneNumber: '',
      email: '',
      emailBlur: true,
      message: '',
      vin: '',
      item_required: '',
      loading: false
    };
  },
  methods: {
    ...mapActions('ui', {
      closeModal: 'closeModal'
    }),
    validate () {
      this.firstNameBlur = false;
      this.lastNameBlur = false;
      this.emailBlur = false;
      if (
        this.validEmail(this.email) &&
        this.validPhoneNumber(this.phoneNumber) &&
        this.validFirstName(this.firstName) &&
        this.validLastName(this.lastName)
      ) {
        this.valid = true;
      }
    },
    validFirstName (firstName) {
      return firstName.length > 2;
    },
    validLastName (lastName) {
      return lastName.length > 2;
    },
    validPhoneNumber (phone) {
      if (!phone) return true;
      const regex = /^[0-9]{9}$/;
      return regex.test(phone);
    },
    validEmail (email) {
      const regex = /(.+)@(.+){2,}\.(.+){2,}/;
      return regex.test(email.toLowerCase());
    },
    async submit () {
      this.validate();
      if (this.valid) {
        const baseUrl = 'http://34.247.218.222/api';
        const payload = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          message: this.message,
          phone: this.phoneNumber,
          vin: this.vin,
          item_required: this.item_required,
          client_id: config.clientIds[currentStoreView().storeId],
          store_id: currentStoreView().storeId
        }
        this.loading = true;
        this.submitted = true;
        try {
          const { data: { data, status } } = await axios.post(baseUrl + '/enquiries', payload);
          if (status === 'success') {
            this.$store.dispatch(
              'notification/spawnNotification',
              notifications.createNotification({
                type: 'success',
                message: 'Your enquiry was created successfully!'
              }),
              { root: true }
            );
            this.reset();
          } else {
            this.$store.dispatch(
              'notification/spawnNotification',
              notifications.createNotification({
                type: 'danger',
                message: 'Failed registration of a new enquiry!'
              }),
              { root: true }
            );
          }
        } catch (e) {
          this.$store.dispatch(
            'notification/spawnNotification',
            notifications.createNotification({
              type: 'danger',
              message: 'Failed registration of a new enquiry!'
            }),
            { root: true }
          );
        }
        this.closeModal();
        this.loading = false;
      }
    },
    reset () {
      this.email = '';
      this.phoneNumber = '';
      this.lastName = '';
      this.firstName = '';
      this.message = '';
      this.vin = '';
      this.item_required = '';
      this.firstNameBlur = true;
      this.emailBlur = true;
      this.lastNameBlur = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
#form-template {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    padding: 0 var(--spacer-sm);
    max-width: 870px;
    margin: 0 auto;
  }
}
.form {
  padding: var(--spacer-sm) 0;
  &__group {
    display: flex;
    align-items: flex-start;
  }
  &__action-button {
    &:first-child {
      margin: var(--spacer-sm) 0 0 0;
    }
    &--secondary {
      margin: var(--spacer-sm) 0 var(--spacer-sm) var(--spacer-base);
    }
  }
  &__button {
    --button-width: 100%;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 0 var(--spacer-2xl) 0 0;
    &:last-of-type {
      margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
      &--range {
        margin: var(--spacer-xl) var(--spacer-base) var(--spacer-2xl);
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
    &__button {
      --button-width: auto;
    }
  }

  .form__action-submit {
    min-width: 117.75px !important;
  }
  ::v-deep .sf-loader__spinner {
    stroke: white !important;
  }
}
</style>
