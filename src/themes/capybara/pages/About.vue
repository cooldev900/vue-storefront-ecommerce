<template>
  <div class="static-page">
    <transition-group name="fade">
      <component
        v-for="content in pageSbData.body"
        :key="content._uid"
        :is="getComponentName(content.component)"
        :content="content"
      />
    </transition-group>
  </div>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';

export default {
  name: 'StaticPage',
  components: {
    SfLoader
  },
  computed: {
    ...mapGetters({
      pageSbData: 'vehicles/pageSbData'
    })
  },
  data () {
    return {}
  },
  methods: {
    getComponentName (name) {
      return name ? `sb-${name.replace(/_/g, '-')}` : '';
    }
  },
  async asyncData ({ store, route, context }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await store.dispatch('vehicles/fetchSbData', route.params.pageId);
    if (context) context.output.cacheTags.add('sbpage');
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || `${this.$route.params.pageId} Page`,
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

.loading-container {
  height: 100vh;
}

</style>
