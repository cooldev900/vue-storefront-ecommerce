<template>
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
        <li @click="backToTop" class="footer-bottom__menu-item">
          Back to Top
        </li>
      </ul>
    </div>
    <div class="footer-bottom__content">
      <ul>
        <li class="left">
          <p class="copywrite">
            © Glyn Hopkin. All Rights Reserved
          </p>
          <p>
            Glyn Hopkin Online Shop, 279-289 London Road, Romford, Essex, RM7 9NP, UK
            <br>
            Vat Reg: 597406403 Company no: 2756516
          </p>
        </li>
        <li class="right" />
      </ul>
    </div>
  </footer>
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
            { name: 'About Us', link: '/explore/about-us' },
            { name: 'Contact Us', clickHandler: () => this.openModal({ name: ModalList['OmContactModal']}) },
            { name: 'FAQs', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-faqs' } }) },
            { name: 'Request Part or Accessory', clickHandler: () => this.openModal({ name: ModalList['OmEnquiryModal']}) },
            { name: 'Offer T&Cs', clickHandler: () => this.openModal({ name: ModalList.OmInfoModal, payload: { contentKey: 'modal-offers' } }) },
            { name: 'Installation Service', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-installationservice' } }) }
          ]
        },
        help: {
          name: 'Legal',
          children: [
            { name: 'Terms & Conditions', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-terms' } }) },
            { name: 'Privacy Policy', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-privacy' } }) },
            { name: 'Cookie Policy', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-cookie' } }) },
            { name: 'UK Delivery', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-ukdelivery' } }) },
            { name: 'International Delivery', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-internationaldelivery' } }) },
            { name: 'UK Returns', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-ukreturns' } }) },
            { name: 'International Returns', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-internationalreturns' } }) },
            { name: 'Surcharges', clickHandler: () => this.openModal({ name: ModalList['OmInfoModal'], payload: { contentKey: 'modal-surcharges' } }) }
          ]
        },
        about: {
          name: 'More from Glyn Hopkin',
          children: [
            {
              name: 'New Cars',
              link: 'https://www.glynhopkin.com/new-cars/'
            },
            {
              name: 'Used Cars',
              link: 'https://www.glynhopkin.com/ussed-cars/'
            },
            { name: 'Servicing', link: 'https://www.glynhopkin.com/service-parts-repair/' },
            { name: 'Our Locations', link: 'https://www.glynhopkin.com/our-locations/' }
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
  background: #222;
  &__inner{
  max-width: 1600px;
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
.footer-bottom{
  &__header{
    border-bottom: 1px solid #eee;
    background: #fff;
    ul{
      list-style: none;
      max-width: 1600px;
      margin: auto;
      padding: 0;
    .footer-bottom__menu-item{
      padding: 20px 25px;
      font-size: 12px;
      display: inline-block;
    }
    }
  }
   &__content{
    border-bottom: 1px solid #eee;
    background: #fff;
    ul{
      list-style: none;
      max-width: 1600px;
      margin: auto;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    .left{
    display: inline-block;
    vertical-align: top;
    width: calc(33% - 50px);
    padding: 25px;
       @include for-mobile {
      width: 100%;
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
      }
    }
    .right{
    display: inline-block;
    vertical-align: top;
    width: calc(66% - 50px);
    padding: 25px;
    @include for-mobile {
      width: 100%;
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
</style>
