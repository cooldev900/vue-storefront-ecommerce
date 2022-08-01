import { serverHooks } from '@vue-storefront/core/server/hooks'
import fetch from 'isomorphic-fetch'
import config from 'config'

serverHooks.beforeCacheInvalidated(({ tags, req }) => {
  if (!config.get('varnish.enabled') || !config.get('server.useOutputCache') || !config.get('server.useOutputCacheTagging')) {
    return
  }
  console.log('Invalidating PWA\'s Varnish Tags')
  const promises = []
  for (let tag of tags) {
    if (config.server.availableCacheTags.indexOf(tag) >= 0 || config.server.availableCacheTags.find(t => {
      return tag.indexOf(t) === 0
    })) {
      promises.push(
        fetch(`http://${config.get('varnish.host')}:${config.get('varnish.port')}`, {
          method: 'BAN',
          headers: {
            'X-VS-Cache-Tag': tag
          } 
        }).then(response => response.text())
        .then(text => {
          if (text && text.includes('200 Ban added')) {
            console.log(
              `Tags invalidated successfully for [${tag}] in the Varnish`
            );
          } else {
            console.log(text)
            console.error(`Couldn't ban tag: ${tag} in the Varnish`);
          }
        })
      )
    } else {
      console.error(`Invalid tag name ${tag}`)
    }
  }
})