<template>
  <div id="thank_you_external">
    <header class="thank-you-title bg-cl-secondary py35 pl20">
      <div class="container">
        <breadcrumbs
          :routes="[{name: 'Homepage', route_link: '/'}]"
          :active-route="this.$t('Order confirmation')"
        />
        <h2 class="category-title">
          {{ $t('Order confirmation') }}
        </h2>
      </div>
    </header>
  </div>
</template>
<script>
import Vue from 'vue'
import Composite from '@vue-storefront/core/mixins/composite'
import VueOfflineMixin from 'vue-offline/mixin'
import { EmailForm } from '@vue-storefront/core/modules/mailer/components/EmailForm'
import rootStore from '@vue-storefront/core/store'
export default {
  name: 'ExternalThankYouPage',
  mixins: [Composite, VueOfflineMixin, EmailForm],
  data () {
    return {
      feedback: ''
    }
  },
  computed: {
    isNotificationSupported () {
      if (Vue.prototype.$isServer || !('Notification' in window)) return false
      return 'Notification' in window
    },
    isPermissionGranted () {
      if (Vue.prototype.$isServer || !('Notification' in window)) return false
      return Notification.permission === 'granted'
    },
    mailerElements () {
      return this.$store.state.config.mailer.contactAddress
    }
  },
  beforeMount () {
    this.$bus.$on('application-after-loaded', (payload) => {
      if (document.getElementById('thank_you_external') != null) {
        this.clearTheCart()
      }
    })
    this.$bus.$on('cart-after-itemchanged', (payload) => {
      if (document.getElementById('thank_you_external') != null) {
        this.clearTheCart()
      }
    })
  },
  methods: {
    clearTheCart () {
      if (this.getNumberOfItemsInCart() > 0) {
        rootStore.dispatch('cart/clear', {}, { root: true })
        rootStore.dispatch('cart/serverCreate', { guestCart: false }, { root: true })
      }
    },
    getNumberOfItemsInCart () {
      return this.$store.state.cart.cartItems.length
    },
    requestNotificationPermission () {
      if (Vue.prototype.$isServer) return false
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission()
      }
    },
    sendFeedback () {
      this.sendEmail(
        {
          sourceAddress: this.checkoutPersonalEmailAddress,
          targetAddress: this.mailerElements.contactAddress,
          subject: this.$t('What we can improve?'),
          emailText: this.feedback
        },
        this.onSuccess,
        this.onFailure
      )
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message,
        action1: { label: this.$t('OK') }
      })
      if (this.mailerElements.sendConfirmation) {
        this.sendEmail(
          {
            sourceAddress: this.mailerElements.contactAddress,
            targetAddress: this.checkoutPersonalEmailAddress,
            subject: this.$t('Confirmation of receival'),
            emailText: this.$t(`Dear customer,\n\nWe have received your letter.\nThank you for your feedback!`),
            confirmation: true
          }
        )
      }
    },
    onFailure (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message,
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#thank_you_external ~ .notifications {
  display: none;
}
</style>
