<template>
  <div class="m-login modal-content">
    <form @submit.prevent="login" class="form">
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
        v-focus
        ref="first"
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
        tabindex="2"
      />
      <SfCheckbox
        v-model="rememberMe"
        name="remember-me"
        :label="$t('Remember me')"
        class="form__element form__checkbox"
        tabindex="3"
      />
      <SfButton class="sf-button--full-width form__submit om-btn--primary" tabindex="4">
        {{ $t("login") }}
      </SfButton>
    </form>
    <SfButton class="sf-button--text action-button" @click.native="switchElem('forgot-pass')" tabindex="5">
      {{ $t("Forgot the password?") }}
    </SfButton>
    <div class="aside">
      <SfHeading
        :title="$t('I want to create an account')"
        :level="3"
        class="aside__heading"
      />
      <SfButton class="sf-button--full-width om-btn--secondary" @click.native="switchElem('register')" tabindex="6" ref="last">
        {{ $t("Register") }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton, SfCheckbox, SfHeading } from '@storefront-ui/vue';
import { mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import { focus } from 'theme/helpers/directives';

export default {
  name: 'MLogin',
  directives: {
    focus
  },
  components: { SfInput, SfButton, SfCheckbox, SfHeading },
  data () {
    return {
      email: '',
      password: '',
      rememberMe: false
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
    async login () {
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
      console.log(token, 'recaptcha token');
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Authorization in progress ...')
      );
      this.$store
        .dispatch('user/login', {
          username: this.email,
          password: this.password,
          token
        })
        .then(result => {
          this.$bus.$emit('notification-progress-stop', {});

          if (result.code !== 200) {
            this.onFailure(result);
          } else {
            this.onSuccess(i18n.t('You are logged in!'));
            this.closeModal({ name: ModalList.Auth });
          }
        })
        .catch(err => {
          Logger.error(err, 'user')();
          this.onFailure({
            result:
              'Unexpected authorization error. Check your Network conection.'
          });
          this.$bus.$emit('notification-progress-stop');
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
.modal-content,
.aside {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  width: 100%;
  &__element {
    margin: var(--spacer-base) 0;
  }
  &__checkbox {
    margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  }
  &__submit {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.action-button {
  margin: var(--spacer-xl) 0;
}
.aside {
  margin: 0 0 var(--spacer-xl) 0;
  width: 100%;
  &__heading {
    --heading-title-color: var(--c-primary);
    margin: 0 0 var(--spacer-sm) 0;
  }
}
</style>
