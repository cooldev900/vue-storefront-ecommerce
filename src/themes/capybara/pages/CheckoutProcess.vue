<template>
 <NoSSR>
    <div id="checkout-process">
        <SfLoader :loading="loading" v-if="loading" class="payment-loader"/>
    </div>
  </NoSSR>
</template>

<script>
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import NoSSR from 'vue-no-ssr';
import { SfLoader } from '@storefront-ui/vue';
import Checkout from '@vue-storefront/core/pages/Checkout';
import axios from 'axios';
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'checkout-process',
  components: {
    SfLoader,
    NoSSR
  },
  mixins: [Checkout],
  data: () => ({
    isEditing: true,
    loading: true,
  }),
  beforeCreate () {
    registerModule(OrderModule)
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav)
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.isEditing) {
      if (!window.confirm("Leave without saving?")) {
        return;
      }
    }
    next();
  },
  methods: {
    preventNav(event) {
      if (!this.isEditing) return
      event.preventDefault()
      event.returnValue = ""
    },
  },
  async mounted () {
    const query = this.$route.query;
    if (query && query['cko-session-id']) {
      try {
        const { data } = await axios
              .post('https://altayer.stage.omninext.co.uk/api/ext/checkout-com/check', {
                id: query['cko-session-id']
              });
        if (data?.approved) {
            //   this.errorPayment = 'cnpayment';
            this.isEditing = false;
            await this.placeOrder();
            this.$bus.$emit('order-after-placed');
            this.$router.push(localizedRoute('/checkout'))         
            return;
        } else {
          this.$bus.$emit('notification-progress-stop')
          console.log(data?.approved, 'approved');
          //this.errorPayment = 'cnpayment';
        }
      } catch (e) {
        console.log(e, 'error');
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      next((vm) => {
        // vm.$store.dispatch('homepage/fetchNewCollection').then(() => {
        //   vm.loading = false;
        // });
      });
    } else {
      next();
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Checkout Process'),
      meta: this.$route.meta.description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: this.$route.meta.description
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.payment-loader {
  height: 100vh;
}
</style>
