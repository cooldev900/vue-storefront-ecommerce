<template>
  <SfButton
    class="sf-button--pure a-account-ico navigation-icon" :class="{'dir-rtl': storeId === 3}"
  >
    <div class="sf-header__custom-icon search-icon" @click="showSearchPanel" :class="[{
      'sf-header__icon--is-active': isLoggedIn
    }, menuStyle]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
           width="20" height="20"
           viewBox="0 0 50 50"
      ><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" /></svg>
    </div>
    <span class="sf-header__split">|</span>
    <div @click="goToAccount" class="sf-header__custom-icon">
      {{ $t('Account') }}
    </div>
    <span class="sf-header__split">|</span>
    <span class="sf-header__custom-icon--help sf-header__custom-icon" @click="showContactModal">{{ $t('Help') }}</span>
    <span class="sf-header__split">|</span>
    <a href="https://wa.me/message/WY4AEO7EDPQAA1" target="_blank" title="Whatsapp" class="sf-header__custom-icon search-icon">
      <img src="/assets/whatsapp.png" width="22">
    </a>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  components: { SfIcon, SfButton },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    currentStoreViewStoreId () {
      return currentStoreView().storeId;
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showSearchPanel() {
      console.log(this.$route.path, 'route');
      this.$store.commit('ui/setSearchpanel', true);
    },
    direction () {
      const storeId = currentStoreView().storeId;
      if (storeId === 2) {
        return 'ar'
      } else {
        return 'en'
      }
    },
    goToAccount () {
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.openModal({ name: ModalList.Auth, payload: 'login' })
      }
    },
    showContactModal() {
      this.openModal({ name: ModalList['OmContactModal']})
    }
  },
  data () {
    return {
      storeId: 0
    }
  },
  beforeMount () {
    this.storeId = currentStoreView().storeId;
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.navigation-icon{
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  background: #fff;
  border-radius: 20px 0 0 20px;
  padding: 0 30px 0 10px;
  font-size: 13px;
  &.dir-rtl{
    border-radius: 0px 20px 20px 0px !important;
    padding: 0 10px 0 30px !important;
}
}
.sf-header__custom-icon{
font-size: 13px;
font-family: var(--font-family-primary);
color: #000000;
text-transform: uppercase;
display: flex;
flex-direction: column;
line-height: 30px;
justify-content: center;
align-items: center;
position: relative;
margin: 0;
@media (min-width: 1px) and (max-width: 1350px) {
font-size: 11px;
margin: 0 5px;
 }
 &--help{
font-size: 13px;
text-transform: uppercase;
@media (min-width: 1px) and (max-width: 1350px) {
display: none;
 }
 &:hover{
  color: var(--c-primary)
}
 }
&:hover{
  color: var(--c-primary)
}
}
.sf-header__split{
  padding: 0 10px;
@media (min-width: 1px) and (max-width: 1350px) {
display: none;
 }
}
.search-icon{
  svg{
    fill: #000;
  }
&:hover{
  svg{
    fill: var(--c-primary);
  }
}
}

.two {
  transition: all 2s ease-in-out 0.5s;
  -webkit-transition: all 2s ease-in-out 0.5s;
}
#scale {
  height: 150px;
  width: 100px;
  text-align: center;
  margin: 0 auto;
}
#scale {
  fill: yellow;
  stroke: blue;
  stroke-width: 2px;
}
.grow:hover {
  transform: scale(2.0);
  -ms-transform: scale(2.0);
  -webkit-transform: scale(2.0);
}
</style>
