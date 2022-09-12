import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const AccountButton = {
  name: 'AccountButton',
  computed: {
    isLoggedIn () {
      return this.$store.getters['user/isLoggedIn']
    },
    user () {
      return this.$store.state.user.current
    }
  },
  methods: {
    goToAccount () {
      if (this.currentUser) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.$store.commit('ui/setAuthElem', 'login')
        EventBus.$emit('modal-show', 'modal-signup')
      }
    },
    async logout () {
      await this.store.dispatch('cart/clear', { sync: false }, { root: true })
      await this.store.dispatch('checkout/savePersonalDetails', {});
      await this.store.dispatch('checkout/saveShippingDetails', {});
      await this.store.dispatch('checkout/savePaymentDetails', {});
      await this.store.dispatch('checkout/dropPassword')
      await this.store.dispatch('vehicles/clearCheckoutSteps');
      await this.store.commit('vehicles/setSlotData', {});
      await EventBus.$emit('user-before-logout')
      this.$router.push(this.localizedRoute('/'))
    }
  }
}
