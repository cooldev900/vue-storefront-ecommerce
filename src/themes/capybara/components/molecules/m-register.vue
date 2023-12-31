<template>
  <div class="m-register modal-content">
    <form @submit.prevent="register" class="form">
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
        tabindex="1"
        ref="first"
      />
      <SfInput
        v-model="firstName"
        name="first-name"
        :label="$t('First name')"
        :required="true"
        :valid="!$v.firstName.$error"
        :error-message="$t('Field is required.')"
        class="form__element"
        tabindex="2"
      />
      <SfInput
        v-model="lastName"
        name="last-name"
        :label="$t('Last name')"
        :required="true"
        :valid="!$v.lastName.$error"
        :error-message="$t('Field is required.')"
        class="form__element"
        tabindex="3"
      />
      <SfInput
        v-model="password"
        name="password"
        :label="$t('Password')"
        :required="true"
        :valid="!$v.password.$error"
        :error-message="$t('Field is required.')"
        type="password"
        class="form__element"
        tabindex="4"
      />
      <SfButton class="sf-button--full-width form__submit om-btn--primary" tabindex="5">
        {{ $t("Create a new account") }}
      </SfButton>
    </form>
    <SfButton class="sf-button--text action-button" @click.native="switchElem('login')" tabindex="6" ref="last">
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
  name: 'MRegister',
  components: { SfInput, SfButton },
  data () {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal',
      closeModal: 'closeModal'
    }),
    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded()

      // Execute reCAPTCHA with action "login".
      const token = await this.$recaptcha('login')

      // Do stuff with the received token.
      return token;
    },
    switchElem (to) {
      this.$v.$reset();
      this.openModal({ name: ModalList.Auth, payload: to })
    },
    async register () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      const token = await this.recaptcha();
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Registering the account ...')
      );
      this.$store
        .dispatch('user/register', {
          email: this.email,
          password: this.password,
          firstname: this.firstName,
          lastname: this.lastName
        })
        .then(result => {
          this.$bus.$emit('notification-progress-stop');
          if (result.code !== 200) {
            this.onFailure(result);
          } else {
            this.$store.dispatch('user/login', {
              username: this.email,
              password: this.password
            });
            this.onSuccess(i18n.t('You are logged in!'));
            this.closeModal({ name: ModalList.Auth });
          }
        })
        .catch(err => {
          this.onFailure({
            result:
              'Unexpected authorization error. Check your Network conection.'
          });
          this.$bus.$emit('notification-progress-stop');
          Logger.error(err, 'user')();
        });
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: i18n.t(result.result),
        action1: { label: i18n.t('OK') }
      });
    },
    restricTab(e) {
      let firstFocusableEl = this.$refs.first.$el.children[0].children[0];
      let lastFocusableEl = this.$refs.last.$el;
      let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

      if (!isTabPressed) { 
        return; 
      }

      if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
            e.preventDefault();
          }
        } else /* tab */ {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
            e.preventDefault();
          }
        }
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    },
    firstName: {
      required
    },
    lastName: {
      required
    }
  },
  beforeMount() {
    window.addEventListener('keydown', this.restricTab);
  },
  beforeDestroy () {
    window.addEventListener('keydown', this.restricTab);
  },
  mounted() {
    this.$refs.first.$el.children[0].children[0].focus();
    console.log(this.$refs.last.$el, 'last');
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
