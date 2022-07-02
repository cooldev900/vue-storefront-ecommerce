<template>
  <div class="a-logo__container">
    <router-link
      :to="localizedRoute('/')"
      :title="$t('Home Page')"
      class="a-logo"
    >
      <SfImage
        :src="storeName"
        :alt="$t(defaultTitle)"
        class="sf-header__logo-franchise"
      />
    </router-link>
  </div>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { SfImage } from '@storefront-ui/vue';
import get from 'lodash-es/get';

const storeView = currentStoreView();

export default {
  components: { SfImage },
  computed: {
    defaultTitle () {
      return get(storeView, 'seo.defaultTitle', config.seo.defaultTitle);
    },
    storeId () {
      return currentStoreView().storeId;
    },
    storeName () {
      return ('/assets/logo.svg');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.a-logo__container{
  display: flex;
  align-items: center;
  @include for-mobile{
    height: 55px;
  }
}
.a-logo {
    display: flex;
    align-items: center;
}
::v-deep .sf-image img {
  width: 187px;
  height: auto;
  margin-left: 40px;
  padding-right: 10px;
  margin-right: 10px;
}
::v-deep .sf-header__logo-franchise img {
    width: 240px;
    margin: var(--logo-margin);
    padding: 0 5px;
    @media (min-width: 1px) and (max-width: 1350px) {
    width: 200px;
    }
    @include for-mobile{
    width: 160px;
    margin: var(--logo-margin-mobile);
    padding: 0 5px;
    }
}
::v-deep .sf-header__logo-franchise {
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
