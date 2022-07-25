import { mapGetters, mapState } from 'vuex'
import i18n from '@vue-storefront/i18n'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import { prepareQuickSearchQuery } from '@vue-storefront/core/modules/catalog/queries/searchPanel'
import RootState from '@vue-storefront/core/types/RootState'
import { Logger } from '@vue-storefront/core/lib/logger'
import config from 'config';
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers';

export const Search = {
  name: 'SearchPanel',
  data () {
    return {
      products: [],
      search: '',
      size: 18,
      start: 0,
      placeholder: i18n.t('Type what you are looking for...'),
      emptyResults: false,
      readMore: true,
      componentLoaded: false,
      searchResult: [],
    }
  },
  mounted () {
    this.search = localStorage.getItem(`shop/user/searchQuery`) || ''

    if (this.search) {
      this.makeSearch();
    }
  },
  beforeDestroy () {
    localStorage.setItem(`shop/user/searchQuery`, this.search ? this.search : '');
  },
  methods: {
    onEscapePress () {
      this.closeSearchpanel()
    },
    closeSearchpanel () {
      this.$store.commit('ui/setSidebar', false)
      this.$store.commit('ui/setMicrocart', false)
      this.$store.commit('ui/setSearchpanel', false)
    },
    buildSearchQuery (queryText) {
      let searchQuery = prepareQuickSearchQuery(queryText)
      return searchQuery
    },
    async makeSearch () {
      if (this.search !== '' && this.search !== undefined) {
        let query = this.buildSearchQuery(this.search)
        for (let attrToFilter of config.products.defaultFilters) {
          query = query.addAvailableFilter({ field: attrToFilter, scope: 'catalog' })
        }

        // const categoryMappedFilters = this.getFiltersMap['search'];
        // console.log(categoryMappedFilters, 'categoryMappedFilters');
        // const searchQuery = this.getCurrentFiltersFrom(
        //   this.$router.query,
        //   categoryMappedFilters
        // );
        
        // let appliedFilters = searchQuery.filters;
        // for (let code of Object.keys(appliedFilters)) {
        //   const filter = appliedFilters[code]
        //   const attributeCode = Array.isArray(filter) ? filter[0].attribute_code : filter.attribute_code
      
        //   if (Array.isArray(filter) && attributeCode !== 'price') {
        //     const values = filter.map(filter => filter.id)
        //     query = query.applyFilter({ key: attributeCode, value: { 'in': values }, scope: 'catalog' })
        //   } else if (attributeCode !== 'price') {
        //     query = query.applyFilter({ key: attributeCode, value: { 'eq': filter.id }, scope: 'catalog' })
        //   } else { // multi should be possible filter here?
        //     const rangeqr = {}
        //     const filterValues = Array.isArray(filter) ? filter : [filter]
        //     filterValues.forEach(singleFilter => {
        //       if (singleFilter.from) rangeqr['gte'] = singleFilter.from
        //       if (singleFilter.to) rangeqr['lte'] = singleFilter.to
        //     })
        //     query = query.applyFilter({ key: attributeCode, value: rangeqr, scope: 'catalog' })
        //   }
        // }
        
        let startValue = 0;
        this.start = startValue
        this.readMore = true
        try {
          const { 
            items,
            perPage,
            start,
            total,
            aggregations,
            attributeMetadata 
          } = await this.$store.dispatch('product/findProducts', {
            query,
            start: this.start,
            size: this.size,
            options: {
              populateRequestCacheTags: false,
              prefetchGroupProducts: false
            }
          })
          this.products = items
          this.start = startValue + this.size
          this.emptyResults = items.length < 1
          await this.$store.dispatch('category-next/loadAvailableFiltersFrom', {
            aggregations,
            attributeMetadata,
            category: {id: 'search'}
          });
        } catch (err) {
          Logger.error(err, 'components-search')()
        }
      } else {
        this.products = []
        this.emptyResults = 0
      }
    },
    async seeMore () {
      if (this.search !== '' && this.search !== undefined) {
        let query = this.buildSearchQuery(this.search)
        let startValue = this.start;
        try {
          const { items, total, start } = await this.$store.dispatch('product/findProducts', {
            query,
            start: startValue,
            size: this.size,
            options: {
              populateRequestCacheTags: false,
              prefetchGroupProducts: false
            }
          })
          let page = Math.floor(total / this.size)
          let exceeed = total - this.size * page
          if (start === total - exceeed) {
            this.readMore = false
          }
          this.products = this.products.concat(items)
          this.start = startValue + this.size
          this.emptyResults = this.products.length < 1
        } catch (err) {
          Logger.error(err, 'components-search')()
        }
      } else {
        this.products = []
        this.emptyResults = 0
      }
    }
  },
  computed: {
    ...mapGetters({
      getFiltersMap: 'category-next/getFiltersMap',
      getCurrentFiltersFrom: 'category-next/getCurrentFiltersFrom',
    }),
    items () {
      return this.$store.state.search
    },
    ...mapState({
      isOpen: (state: RootState) => state.ui.searchpanel
    })
  },
  mixins: [onEscapePress]
}
