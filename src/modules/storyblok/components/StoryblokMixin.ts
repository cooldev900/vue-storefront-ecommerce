import { mapGetters } from 'vuex'
import * as types from '../store/mutation-types'

export default {
  name: 'Storyblok',
  computed: {
    ...mapGetters({
      story: 'storyblok/storyCurrent'
    }),
    storyContent () {
      let contents = {};
      if (this.story && this.story['current']) {
        this.story['current'].content.body.forEach((content) => {
          contents[content.component] = content;
        });
      }

      return contents;
    }
  },
  mounted () {
    this.$storybridge.on(['input', 'published', 'change'], (event) => {
      if (event.action === 'input') {
        if (event.story.id === this.story.id) {
          // this.story.content = event.story.content
          this.$store.commit('storyblok/STORYBLOK_UPD_CURRENT', event.story)
        }
      } else if (!event.slugChanged) {
        window.location.reload()
      }
    })
  },
  // asyncData ({ store, route, context }) {
  //   return new Promise((resolve, reject) => {
  //     store.dispatch('storyblok/fetchAsync', {
  //       value: route.fullPath,
  //       setCurrent: true
  //     }).then(data => {
  //       if (context) context.output.cacheTags.add(`storyblok`)
  //       resolve(data)
  //     }).catch(err => {
  //       console.error(err)
  //       reject(err)
  //     })
  //   })
  // },
  methods: {
  }
}
