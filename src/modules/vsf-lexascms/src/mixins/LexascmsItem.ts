export default {
  name: 'LexascmsItemMixin',

  props: {
    contentType: {
      type: String,
      required: true
    },
    context: {
      type: Object
    },
    id: {
      type: String,
      required: true
    },
    fields: {
      type: Object
    },
    include: {
      type: String
    },
    localeCode: {
      type: String
    }
  },

  computed: {
    item () {
      return this.$store.getters['vsf-lexascms/data'](
        JSON.stringify(this.buildRequestArgs())
      );
    }
  },

  serverPrefetch () {
    return this.fetchItem();
  },

  mounted () {
    if (typeof this.item === 'undefined') {
      this.fetchItem();
    }
  },

  methods: {
    fetchItem () {
      return this.$store.dispatch('vsf-lexascms/getData', this.buildRequestArgs());
    },

    buildRequestArgs () {
      return {
        path: `/${this.contentType}/${this.id}`,
        params: {
          fields: this.fields !== undefined ? this.fields : undefined,
          include: this.include !== undefined ? this.include : undefined,
          localeCode: this.localeCode !== undefined ? this.localeCode : undefined
        },
        requestContext: this.context !== undefined ? this.context : this.$store.getters['vsf-lexascms/requestContext']
      };
    }
  }
}
