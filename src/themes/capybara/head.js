export default {
  title: 'Al Fardan Commercial',
  titleTemplate: '%s - Al Fardan Commercial',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    {
      vmid: 'description',
      name: 'description',
      content:
        ''
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, minimal-ui'
    },
    { name: 'robots', content: 'index, follow' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#ffffff' },
    { name: 'apple-mobile-web-app-status-bar-style', content: '#ffffff' }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/assets/favicon.ico',
      sizes: '32x32'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/assets/favicon.ico',
      sizes: '16x16'
    },
    { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon.png' },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_2048.png',
      sizes: '2048x2732'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_1668.png',
      sizes: '1668x2224'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_1536.png',
      sizes: '1536x2048'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_1125.png',
      sizes: '1125x2436'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_1242.png',
      sizes: '1242x2208'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_750.png',
      sizes: '750x1334'
    },
    {
      rel: 'apple-touch-startup-image',
      href: '/assets/apple_splash_640.png',
      sizes: '640x1136'
    },
    { rel: 'manifest', href: '/assets/manifest.json' },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com/',
      crossorigin: 'anonymous'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com/',
      crossorigin: 'anonymous'
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.jsdelivr.net/',
      crossorigin: 'anonymous'
    }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/pwacompat@2.0.17/pwacompat.min.js',
      async: true,
      crossorigin: 'anonymous'
    },
    {
      src: 'https://code.tidio.co/ouxfybu7oftz1t7n3fwbhm5yk7yrupum.js',
      async: true
    }
  ]
};
