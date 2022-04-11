<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <SfImage
      src="/assets/logo.png"
      :alt="$t(defaultTitle)"
      class="sf-header__logo"
    />
  </router-link>
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
    storeName () {
      return ('/assets/' + currentStoreView().storeId + '-franchise-badge.png');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.a-logo {
  display: inline-flex;
  @include for-mobile {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
::v-deep .sf-image img {
  width: 175px;
  height: auto;
  margin-left: 40px;
}
::v-deep .sf-header__logo-franchise img {
  width: 70px;
  height: auto;
  margin-left: 0;
}
::v-deep .sf-header__logo-franchise {
  overflow: visible;
  display: flex;
  justify-content: center;
  padding: 4px 5px;
  align-items: center;
}

</style>
