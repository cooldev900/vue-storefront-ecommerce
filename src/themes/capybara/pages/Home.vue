<template>
  <div id="home">
    <transition-group name="fade">
      <component
        v-for="content in pageSbData.body"
        :key="content._uid"
        :is="getComponentName(content.component)"
        :content="content"
        :variant="content.variant"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Logger } from '@vue-storefront/core/lib/logger';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'Home',
  data () {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      dummyInstagramImages: 'instagram/getInstagramImages'
    }),
    ...mapGetters('vehicles', [
      'pageSbData'
    ]),
    isOnline () {
      return onlineHelper.isOnline;
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    getComponentName (name) {
      return name ? `sb-${name.replace(/_/g, '-')}` : '';
    }
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  },
  async asyncData ({ store, context }) {
    Logger.info('Calling asyncData in Home (theme)')();
    await store.dispatch('vehicles/fetchSbData', 'home');
    if (context) context.output.cacheTags.add(`home`);
  },
  async mounted () {
    this.$store.commit('vehicles/toggleSetPrompt', true);
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
    this.$gtm.trackView('MyScreenName', 'currentPath');
    
    const {resetpassword, token} = this.$route.query;
    if (resetpassword) {
      this.openModal({ name: ModalList.Auth, payload: 'forgot-reset' })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      next((vm) => {
        vm.$store.dispatch('homepage/fetchNewCollection').then(() => {
          vm.loading = false;
        });
      });
    } else {
      next();
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
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

#home {
  box-sizing: border-box;
  padding: 0;
  background: #f4f4f4;
  @include for-desktop {
    max-width: 100%;
    margin: 0 auto;
  }
}
.sf-hero-item {
  --hero-item-height: 14rem;
  height: initial;
}
.banner-grid {
  margin: var(--spacer-base) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
.brand-logos {
  margin-bottom: var(--spacer-xl);
}
::v-deep .section {
  padding: 0 var(--spacer-xl);
  --section-margin: var(--spacer-xl) 0;
  --section-content-margin: var(--spacer-xl) 0 0 0;
  .sf-heading__title.sf-heading__title--h2 {
    font-weight: 700;
    font-size: 26px;
    color: #444444;
  }
}
</style>
