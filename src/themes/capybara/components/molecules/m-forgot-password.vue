<template>
  <div class="m-reset-password modal-content">
    <template v-if="!passwordSent">
      <p>
        {{ $t('Enter your email to receive instructions on how to reset your password.') }}
      </p>
      <form @submit.prevent="resetPassword" class="form">
        <SfInput
          v-model="email"
          name="email"
          :label="$t('Email address')"
          :required="true"
          :valid="!$v.email.$error"
          :error-message="
            !$v.email.required
              ? $t('Field is required.')
              : $t('Please provide valid e-mail address.')
          "
          class="form__element"
        />
        <SfInput
          v-model="password"
          name="password"
          :label="$t('New password')"
          :required="true"
          :valid="!$v.password.$error"
          :error-message="
            !$v.password.required
              ? $t('Field is required.')
              : $t('Please provide valid password.')
          "
          type="password"
          class="form__element"
        />
        <SfButton class="sf-button--full-width form__submit om-btn--primary">
          {{ $t("Reset password") }}
        </SfButton>
      </form>
    </template>
    <div v-else>
      <p>
        {{ $t('Reset password is successful!') }}
      </p>
    </div>
    <SfButton class="sf-button--text action-button" @click.native="switchElem('login')">
      {{ `${$t("or")} ${$t("Login in to your account")}` }}
    </SfButton>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { mapActions } from 'vuex';

export default {
  name: 'MResetPassword',
  components: { SfInput, SfButton },
  data () {
    return {
      email: '',
      password: '',
      passwordSent: false
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    switchElem (to) {
      this.$v.$reset();
      this.openModal({ name: ModalList.Auth, payload: to })
    },
    resetPassword () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Resetting the password ... ')
      );
      this.$store
        .dispatch('user/createPassword', { email: this.email, newPassword: this.password, resetToken: this.$route.query.token })
        .then(response => {
          this.$bus.$emit('notification-progress-stop');
          if (response.code === 200) {
            this.passwordSent = true;
          } else {
            this.onFailure(response);
          }
        })
        .catch(() => {
          this.$bus.$emit('notification-progress-stop');
        });
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: i18n.t(result.result.errorMessage),
        action1: { label: i18n.t('OK') }
      });
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  width: 100%;
  &__element {
    margin: var(--spacer-base) 0;
  }
  &__submit {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.action-button {
  margin: var(--spacer-xl) 0;
}
</style>
