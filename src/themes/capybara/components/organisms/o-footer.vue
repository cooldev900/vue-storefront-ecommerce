<template>
  <div>
    <footer class="o-footer">
      <div class="o-footer__inner">
        <SfFooter :column="5" :multiple="true">
          <SfFooterColumn
            v-for="linkGroup in links"
            :key="linkGroup.name"
            :title="$t(linkGroup.name)"
          >
            <SfList>
              <SfListItem v-for="link in linkGroup.children" :key="link.name">
                <a v-if="link.link && isExternalLink(link.link)" :href="link.link" target="_blank">
                  <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
                </a>
                <router-link v-if="link.link && !isExternalLink(link.link)" :to="localizedRoute(link.link)" exact>
                  <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
                </router-link>
                <SfMenuItem
                  v-else-if="link.clickHandler"
                  class="sf-footer__menu-item"
                  :label="$t(link.name)"
                  @click="link.clickHandler"
                />
              </SfListItem>
            </SfList>
          </SfFooterColumn>
        </SfFooter>
      </div>
      <div class="footer-bottom__header">
        <ul>
          <li class="footer-bottom__menu-item">
            <span class="back-to-top" @click="backToTop">{{ $t('Back to Top') }}</span>
          </li>
          <ul class="social-icon__list">
            <li class="social-icon">
              <a target="_blank" href="https://en-gb.facebook.com/AlfardanCommercial/">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                     width="50" height="50"
                     viewBox="0 0 24 24"
                     style=" fill:#000;"
                >    <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h7.621v-6.961h-2.343v-2.725h2.343V9.309 c0-2.324,1.421-3.591,3.495-3.591c0.699-0.002,1.397,0.034,2.092,0.105v2.43h-1.428c-1.13,0-1.35,0.534-1.35,1.322v1.735h2.7 l-0.351,2.725h-2.365V21H19c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z" /></svg>
              </a>
            </li>
            <li class="social-icon">
              <a target="_blank" href="https://www.linkedin.com/company/alfardan-commercial">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                     width="24" height="24"
                     viewBox="0 0 24 24"
                     style=" fill:#000;"
                >    <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z" /></svg>
              </a>
            </li>
            <li class="social-icon">
              <a target="_blank" href="https://www.instagram.com/alfardancommercial/">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                     width="24" height="24"
                     viewBox="0 0 30 30"
                     style=" fill:#000000;"
                >    <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" /></svg>
              </a>
            </li>
          </ul>
        </ul>
        </li>
        </ul>
      </div>
      <div class="footer-bottom__content">
        <ul>
          <li class="left">
            <p class="copywrite">
              © Alfardan Commercial. All Rights Reserved
            </p>
            <p><a href="mailto:info-afc@alfardancommercial.com">info-afc@alfardancommercial.com </a>| <a href="tel:+97444065557">+974 4406 5557</a></p>
            <p>
              7GM4+HH, PO 3763 Suhaim Bin Hamad Street, Doha, Qatar
            </p>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import get from 'lodash-es/get';
import { createSmoothscroll } from 'theme/helpers';

export default {
  name: 'OFooter',
  components: {
    SfFooter,
    SfList,
    SfMenuItem
  },
  data () {
    return {
      social: ['facebook', 'pinterest', 'twitter', 'youtube']
    };
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    multistoreEnabled () {
      return get(config, 'storeViews.multistore', false);
    },
    currentLanguage () {
      const { i18n = config.i18n } = currentStoreView();
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    },
    links () {
      return {
        orders: {
          name: 'Customer Service',
          children: [
            {
              name: 'Login/Register',
              ...this.isLoggedIn
                ? { link: '/my-account' }
                : { clickHandler: () => this.openModal({ name: ModalList.Auth, payload: 'login' }) }
            },
            { name: 'Contact Us', clickHandler: () => this.openModal({ name: ModalList['OmContactModal'] }) },
            { name: 'FAQs', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-faqs' } }) }
          ]
        },
        help: {
          name: 'Legal',
          children: [
            { name: 'Terms & Conditions', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-terms' } }) },
            { name: 'Privacy Policy', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-privacy' } }) }
          ]
        },
        about: {
          name: 'Our Services',
          children: [
            { name: 'Tires', link: '/tires' },
            { name: 'Lubricants', link: '/lubricants' },
            { name: 'Batteries', link: '/batteries' }
          ]
        }
      };
    }
  },
  methods: {
    backToTop () {
      createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0)
      this.$emit('scrolled');
    },
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showLanguageSwitcher () {
      this.openModal({ name: ModalList.LanguageSwitcher })
    },
    isExternalLink (url) {
      return url.includes('https') || url.includes('http');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-footer {
  background: #000;
  &__inner{
    max-width: 1400px;
    padding: 15px 25px;
  @include for-desktop {
    margin: auto;
    min-height: 200px;
  }
  }
  .sf-footer {
    --footer-width: auto;
  }
}
::v-deep .sf-footer__container{
  padding: 20px 0;
}
::v-deep .sf-menu-item__label{
    font-size: 12px;
    padding: 0 15px;
    text-transform: uppercase;
    color: #fff;
  &:hover{
     color: var(--c-primary) !important;
  }
}
::v-deep .sf-footer-column__title{
  color: #fff;
  font-size: 12px;
  padding: 10px 15px;
  font-family: var(--font-family-bold);
  background: none !important;
}
.social-column {
  flex-basis: auto;
}
.social-icon {
  padding: var(--spacer-sm) var(--spacer-xl);
  @include for-desktop {
    padding: var(--spacer-xs) 0;
  }
  &__img {
    height: 1.75rem;
    &:not(:last-child) {
      margin-right: var(--spacer-base);
    }
  }
}
.social-icon__list{
    margin: 0;
    padding: 0 25px !important;
    list-style: none;
    .social-icon{
    padding: 0;
    display: inline-block;
  svg{
    fill: #000 !important;
    width: 30px;
    height: 30px;
    &:hover{
       fill: var(--c-primary) !important;
  }
  }
  &:last-child{
    padding-right: 0;
  }
  @include for-mobile{
  &:first-child{
    padding-left: 0;
  }
  }
}
}
.footer-bottom{
  &__header{
    border-bottom: 1px solid #eee;
    background: #fff;
    ul{
      list-style: none;
      max-width: 1400px;
      margin: auto;
      padding: 0;
      gap: 15px;
      display: flex;
      justify-content: space-between;
    .footer-bottom__menu-item{
      padding: 20px 25px;
      font-size: 12px;
      flex: 1;
      display: inline-block;
    }
    }
  }
   &__content{
    border-bottom: 1px solid #eee;
    background: #fff;
    a{
      &:hover{
        color: var(--c-primary)
      }
    }
    ul{
      list-style: none;
      max-width: 1400px;
      margin: auto;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      @include for-mobile{
        justify-content: center;
      }
    .left{
    display: inline-block;
    text-align: center;
    vertical-align: top;
    width: 100%;
    padding: 10px 25px;
       @include for-mobile {
      width: 100%;
      padding-bottom: 0px !important;
    }
    p{
      font-size: 12px;
      line-height: 25px;
      margin-top: 5px;
      margin-bottom: 15px;
      color: #262626;
       @include for-mobile {
      width: 100%;
    }
    }
      .copywrite {
        font-family: var(--font-family-bold);
        font-size: 12px;
        font-weight: 700;
      }
    }
    .right{
    display: inline-block;
    vertical-align: top;
    width: calc(66% - 50px);
    padding: 25px;
    @include for-mobile {
      width: 100%;
      padding-top: 0px !important;
    }
      p{
      font-size: 12px;
      line-height: 25px;
      margin-top: 5px;
      margin-bottom: 15px;
      color: #262626;
    }
    }
    }
  }
}
::v-deep .sf-chevron__bar:after{
  background: #fff;
}
.back-to-top{
  cursor: pointer;
  &:hover{
    color: var(--c-primary)
  }
}
</style>
