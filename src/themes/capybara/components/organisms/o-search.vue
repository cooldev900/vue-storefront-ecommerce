<template>
  <div class="o-search">
    <!-- <SfSearchBar
      v-model="search"
      :placeholder="$t('Search for Accessories')"
      class="sf-header__search"
      @input="startSearch"
      @click.native="$store.commit('ui/setSearchpanel', true)"
    /> -->
    <component
      v-if="isSearchPanelVisible"
      :is="searchPanelAsyncComponent"
      :search="search"
      :page-size="size"
      :products="products"
      :read-more="readMore"
      @see-more="seeMore"
      @close="$store.commit('ui/setSearchpanel', false)"
      @reload="reloadComponent()"
    />
  </div>
</template>

<script>
// import { SfSearchBar } from '@storefront-ui/vue';
import { mapState, mapGetters } from 'vuex';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';

const SearchPanel = () =>
  import(
    /* webpackChunkName: "vsf-search-panel" */ 'theme/components/organisms/o-search-panel'
  );

export default {
  name: 'OSearch',
  components: {
    // SfSearchBar
  },
  data () {
    return {
      size: 16,
      searchPanelAsyncComponent: () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    };
  },
  mixins: [SearchPanelMixin],
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isSearchPanelVisible: (state) => state.ui.searchpanel
    })
  },
  methods: {
    // startSearch () {
    //   if (this.search.length >= 3) {
    //     this.makeSearch();
    //   }
    // },
    reloadComponent () {
      this.searchPanelAsyncComponent = () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.o-search {
  --search-bar-border-width: 0;
  background-color: var(--c-light);
  display: flex;
  align-items: center;
  /* padding: 0 10px; */
  width: 0;
}
::v-deep .sf-search-bar__input[type="search"] {
  &:focus {
    outline: none;
    border-width: 0 0 1px 0;
    border-color: #b1b1b1;
    transition: border-width 1s linear;
  }
}
</style>
