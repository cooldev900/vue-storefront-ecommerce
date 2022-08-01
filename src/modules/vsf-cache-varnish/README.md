# VSF Cache Varnish

By default VSF is able to cache SSR Output in the Redis Cache. This module will Cache Redis Output in the Varnish. So Node.js server is not being used even to load output from Redis. It makes our app's first load even faster!

Example Category's view response time: 1920ms   
Example Category's view response time with Varnish: 16ms   

Response times are *without HTML minifier* - in development mode. So in production it should be even faster.

## How to install
To config's main section add:
```json
"varnish": {
  "enabled": true,
  "host": "localhost",
  "port": 80
}
```

Obviously, set proper `host` and `port` if you are on production.
You should also enable those 2 values in `server` section:
```json
"useOutputCacheTagging": true,
"useOutputCache": true
```

If you are on production, you should set proper addresses in Varnish's config. You can find base config in `src/modules/vsf-cache-varnish/docker/varnish/config.vcl`.

ACL tells Varnish which IP could Purge cache.
Backend default tells Varnish which IP should it cache.

We need it as Varnish uses Redis' tags to invalidate.

## How to test it locally
1. Run app with `docker-compose up`
2. Run Varnish with `docker-compose -f src/modules/vsf-cache-varnish/docker-compose.varnish.yml up`
3. On port :80, you should have Cached with Varnish App. On port :3000 you should have Cached with Redis App.

## How to install Varnish on VPS?
I've just used:
```
sudo apt-get install varnish
```

## How to configure Varnish on production?
https://devdocs.magento.com/guides/v2.3/config-guide/varnish/config-varnish-configure.html

## How to purge cache?
When we purge Redis' cache. It will also purge Varnish's cache. So just open:
```
http://localhost:3000/invalidate?key=aeSu7aip&tag=*
```

## Do I need varnish-modules?
As we do not cache POST requests (like here: https://github.com/DivanteLtd/vue-storefront-api/tree/develop/docker/varnish). It is **not** needed.

## Caching does not work
Make sure you have this bugfix in your PWA: https://github.com/DivanteLtd/vue-storefront/pull/4143

## Invalidate * does not work for category/product
Make sure it is fixed: https://github.com/DivanteLtd/vue-storefront/issues/4173

## Does it work with Fastly?
I did not anything for that. So probably not. Feel free to prepare PR for that!

## Errors
Are you getting?:
```
app_1  | [ioredis] Unhandled error event: Error: connect ECONNREFUSED 127.0.0.1:6379
app_1  |     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1106:14)
```

It means you do not have running Redis' instance. The easiest solution that I've prepared for you will be run docker-compose with redis:
```sh
docker-compose -f src/modules/vsf-cache-varnish/docker-compose.redis.yml up
```