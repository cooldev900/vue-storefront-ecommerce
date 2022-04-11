import { mutations } from '../store/mutations';
import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from '../store/mutation-types'
import StoryblokVue from 'storyblok-vue'
import StoryblokClient from 'storyblok-js-client'

const loadScript = function (src, cb) {
  if (document.getElementById('storyblok-javascript-bridge')) {
    return cb()
  }

  var script = document.createElement('script')
  script.async = true
  script.src = src
  script.id = 'storyblok-javascript-bridge'

  script.onerror = function () {
    cb(new Error('Failed to load' + src))
  }

  script.onload = function () {
    cb()
  }

  document.getElementsByTagName('head')[0].appendChild(script)
}

export function beforeRegistration (Vue, config, store, isServer) {
  Logger.info('Adding Storyblok module', 'storyblok', this)()

  // register image resize filter
  Vue.filter('resize', (image, size) => {
    if (typeof image !== 'undefined') {
      return '//img2.storyblok.com/' + size + image.replace('//a.storyblok.com', '')
    }
    return null
  })

  // register dashify filter
  Vue.filter('dashify', (value) => {
    if (typeof value === 'undefined') {
      return 'undefined'
    }
    let dashified = value.toString()
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/[ _]/g, '-')
    return 'blok-' + dashified
  })

  // // register v-editable directive
  // Vue.directive('editable', {
  //   bind: function (el, binding) {
  //     if (typeof binding.value._editable === 'undefined') {
  //       return
  //     }
  //     var options = JSON.parse(binding.value._editable.replace('<!--#storyblok#', '').replace('-->', ''))
  //     el.setAttribute('data-blok-c', JSON.stringify(options))
  //     el.setAttribute('data-blok-uid', options.id + '-' + options.uid)
  //     el.classList.add('storyblok__outline')
  //   }
  // })
  Vue.use(StoryblokVue)
  // add api client
  Vue.prototype.$storyapi = new StoryblokClient({
    accessToken: config.storyblok.accessToken
  })

  // load js bridge on draft mode
  if (!isServer) {
    Vue.prototype.$storybridge = {
      doLoadScript: true,
      proxy: null,
      on: function (events, cb, options) {
        options = options || {}
        options.accessToken = config.storyblok.accessToken

        this.load(() => {
          window.storyblok.init(options)
          window.storyblok.on(events, (event) => {
            if (event.action === 'input') {
              event.story.content = this.proxy.addComments(event.story.content, event.story.id)
            }
            cb(event)
          })
        })
      },
      load: function (cb, errorCb) {
        if (typeof errorCb !== 'function') {
          errorCb = function () {}
        }

        if (window.location === window.parent.location) {
          return
        }

        if (!this.doLoadScript) {
          if (!window.storyblok) {
            return
          }
          cb()
          return
        }

        this.doLoadScript = false
        loadScript('https://app.storyblok.com/f/storyblok-latest.js', () => {
          Vue.prototype.$storybridge.proxy = window.storyblok
          cb()
        })
      }
    }
  }
}
