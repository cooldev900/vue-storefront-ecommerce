<template>
  <div id="form-template">
    <OmAlertBox :type="type" v-if="successMessage">
      <template #message>
        <div class="om-alert-box-message">
          <div>
            <p>
              {{ $t(successMessage) }}
            </p>
          </div>
        </div>
      </template>
    </OmAlertBox>
    <div class="form" v-else>
      <SfInput
        v-model="firstName"
        :label="$t('First name')"
        name="firstName"
        class="form__element form__element--half"
        required
        :valid="firstNameBlur || validFirstName(firstName)"
        :error-message="$t('Field is required')"
        @blur="firstNameBlur = false"
      />
      <SfInput
        v-model="lastName"
        :label="$t('Last name')"
        name="lastName"
        class="form__element form__element--half form__element--half-even"
        required
        :valid="lastNameBlur || validLastName(lastName)"
        :error-message="$t('Field is required')"
        @blur="lastNameBlur = false"
      />
      <SfInput
        v-model="phoneNumber"
        :label="$t('Phone Number')"
        name="phone"
        required
        type="number"
        class="form__element form__element--half"
        :valid="validPhoneNumber(phoneNumber)"
        :error-message="$t('Field is required')"
      />
      <SfInput
        v-model="email"
        :label="$t('Email address')"
        name="email"
        class="form__element form__element--half form__element--half-even"
        required
        :valid="emailBlur || validEmail(email)"
        :error-message="$t('Field is required')"
        @blur="emailBlur = false"
      />
      <SfInput
        v-model="vin"
        :label="$t('VIN')"
        name="vin"
        class="form__element form__element--half"
      />
      <SfInput
        v-model="item_required"
        :label="$t('Items required')"
        name="item_required"
        class="form__element form__element--half form__element--half-even"
      />
      <SfInput
        v-model="message"
        type="textarea"
        class="form__element"
        :label="$t('Message')"
        name="message"
        cols="80"
        rows="15"
        maxlength="400"
        minlength="10"
        wrap="soft"
      />
      <div class="form__action">
        <SfButton class="om-btn--primary" @click.prevent="submit">
          <SfLoader v-if="loading" :loading="loading" />
          <span v-else>{{ $t('Submit') }}</span>
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
import { mapActions, mapGetters } from 'vuex';
import OmAlertBox from 'theme/components/omni/om-alert-box';

export default {
  name: 'OmEnquiryForm',
  components: {
    SfButton,
    SfInput,
    SfComponentSelect,
    SfHeading,
    SfRange,
    SfLoader,
    OmAlertBox
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
      loading: false,
      successMessage: '',
      type: 'info'
    };
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
    }),
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
      const regex = /^[0-9]{8,12}$/;
      return regex.test(phone);
    },
    validEmail (email) {
      const regex = /(.+)@(.+){2,}\.(.+){2,}/;
      return regex.test(email.toLowerCase());
    },
    async submit () {
      this.validate();
      if (this.valid) {
        const baseUrl = 'https://portal-api.omninext.app/api';
        const payload = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          message: this.message,
          phone: this.phoneNumber,
          vin: this.vin,
          status: 'open',
          item_required: this.item_required,
          client_id: config.clientIds[currentStoreView().storeId],
          store_id: currentStoreView().storeId
        }
        this.loading = true;
        this.submitted = true;
        try {
          const { data: { data, status } } = await axios.post(baseUrl + '/enquiries', payload);
          if (status === 'success') {
            // this.$store.dispatch(
            //   'notification/spawnNotification',
            //   notifications.createNotification({
            //     type: 'success',
            //     message: 'Your enquiry was created successfully!'
            //   }),
            //   { root: true }
            // );
            this.type = 'info';
            this.successMessage = 'Your enquiry was created successfully!';
            this.loading = false;
            // this.reset();
          } else {
            // this.$store.dispatch(
            //   'notification/spawnNotification',
            //   notifications.createNotification({
            //     type: 'danger',
            //     message: 'Failed registration of a new enquiry!'
            //   }),
            //   { root: true }
            // );
            this.type = 'warning';
            this.successMessage = 'Failed registration of a new enquiry!';
            this.loading = false;
          }
        } catch (e) {
          // this.$store.dispatch(
          //   'notification/spawnNotification',
          //   notifications.createNotification({
          //     type: 'danger',
          //     message: 'Failed registration of a new enquiry!'
          //   }),
          //   { root: true }
          // );
          this.type = 'warning';
          this.successMessage = 'Failed registration of a new enquiry!';
          this.loading = false;
        }
        // this.loading = false;
        // this.closeModal();
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
      this.setProductInfo();
    },
    setProductInfo() {
      this.type = 'info';
      this.successMessage = '';
      if (this.product.sku) {
        if (this.product.name)  
          this.item_required = this.product.name + ' - ' + this.product.sku;  
        else 
          this.item_required = this.product.title + ' - ' + this.product.sku;  
      }  
    },
  },
  mounted () {
    this.reset();
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
