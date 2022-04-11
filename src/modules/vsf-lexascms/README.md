<h1 align="center">
  <img src="header@2x.png" width="700" alt="LexasCMS Module for Vue Storefront" />
</h1>

<h4 align="center">This is the official Vue Storefront module for retrieving content from <a href="https://www.lexascms.com" target="_blank">LexasCMS</a>.</h4>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#example">Example</a> •
  <a href="#license">License</a>
</p>

<br /><br />


Table of Contents
----------------------------------------------------------------

- [Installation](#installation)
- [How to Use](#how-to-use)
  - [LexascmsCollection](#lexascmscollection)
  - [LexascmsItem](#lexascmsitem)
  - [Request Context](#request-context)
  - [Supporting Content Previews](#supporting-content-previews)
- [Example](#example)
- [License](#license)


Installation
----------------------------------------------------------------

### 1. Install the module

Run the following commands from the root directory of your Vue Storefront project.

```bash
git clone https://github.com/LexasCMS/vsf-lexascms ./src/modules/vsf-lexascms
yarn install
```

These commands will install the module into the correct location in your project and install the modules dependencies.

### 2. Configure the module

Configure your LexasCMS space ID by adding the following to your `config/local.json` file.

```js
"lexascms": {
  "spaceId": "YOUR_LEXASCMS_SPACE_ID",
  "apiKey": "YOUR_LEXASCMS_API_KEY" // Optional, unless using content previews
}
```

### 3. Register the module

Register the `vsf-lexascms` module by adding the following to your `./src/modules/client.ts` file.

```ts
import { LexascmsModule } from './vsf-lexascms/src';

// ...

export function registerClientModules () {
  // ...
  registerModule(LexascmsModule);
}
```


How To Use
----------------------------------------------------------------

Under the hood, this module makes use of LexasCMS' JSON:API (REST) content delivery API. For further information, please [see the documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/).

The `vsf-lexascms` module provides two mixins which can be used to retrieve content from LexasCMS. 

- [LexascmsCollection](#lexascmscollection)
- [LexascmsItem](#lexascmsitem)

### LexascmsCollection

The `LexascmsCollection` mixin is used for retrieving multiple items of a particular content type.

Add the mixin to the component in which you would like to retrieve content from LexasCMS.

```ts
import LexascmsCollectionMixin from 'src/modules/vsf-lexascms/src/mixins/LexascmsCollection';

export default {
  mixins: [ LexascmsCollectionMixin ]
}
```

Your component will now accept the following props to configure which content should be retrieved. The retrieved content is made accessible via the `collection` computed property.

| Name        | Type   | Required | Example                               | Comments                                                                                                                                                              |
|-------------|--------|----------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| contentType | String | Y        | `blogPost`                            | The type of content to be retrieved.                                                                                                                                  |
| context     | Object | N        | `{ audienceAttributes: { age: 25 } }` | See [request context documentation](https://www.lexascms.com/docs/api-reference/content-delivery/request-context/) for more info.                                     |
| fields      | Object | N        | `{ blogPost: 'title,publishedAt' }`   | See [sparse fieldsets documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/sparse-fieldsets/) for more info.                           |
| filter      | Object | N        | `{ title: { _startsWith: 'Hello' } }` | See [filtering documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/filtering/) for more info.                                         |
| include     | String | N        | `author,coverImage`                   | See [fetching records documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/fetching-records/#including-related-records) for more info. |
| localeCode  | String | N        | `en-GB`                               | See [localisation documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/localisation/) for more info.                                   |
| page        | Object | N        | `{ limit: 2, skip: 4 }`               | See [pagination documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/pagination/) for more info.                                       |
| sort        | String | N        | `title,-publishedAt`                  | See [ordering documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/ordering/) for more info.                                           |


### LexascmsItem

The `LexascmsItem` mixin is used for retrieving a specific individual content item.

Add the mixin to the component in which you would like to retrieve content from LexasCMS.

```ts
import LexascmsItemMixin from 'src/modules/vsf-lexascms/src/mixins/LexascmsItem';

export default {
  mixins: [ LexascmsItemMixin ]
}
```

Your component will now accept the following props to configure which content item should be retrieved. The retrieved content item is made accessible via the `item` computed property.

| Name        | Type   | Required | Example                               | Comments                                                                                                                                                              |
|-------------|--------|----------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| contentType | String | Y        | `blogPost`                            | The type of content to be retrieved.                                                                                                                                  |
| context     | Object | N        | `{ audienceAttributes: { age: 25 } }` | See [request context documentation](https://www.lexascms.com/docs/api-reference/content-delivery/request-context/) for more info.                                     |
| id          | String | Y        | `1234`                                | The ID of the content item to be retrieved.                                                                                                                           |
| fields      | Object | N        | `{ blogPost: 'title,publishedAt' }`   | See [sparse fieldsets documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/sparse-fieldsets/) for more info.                           |
| include     | String | N        | `author,coverImage`                   | See [fetching records documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/fetching-records/#including-related-records) for more info. |
| localeCode  | String | N        | `en-GB`                               | See [localisation documentation](https://www.lexascms.com/docs/api-reference/content-delivery/jsonapi/localisation/) for more info.                                   |


### Request Context

In the event that you would like to provide a request context with your requests to LexasCMS (i.e. for content personalisation), you can dispatch the `vsf-lexascms/setRequestContext` store action.

You can dispatch this action from anywhere that you have access to the store, and it will automatically attach the provided context to all subsequent requests that are made to LexasCMS.

**Note:** You can also retrieve the current request context from the store by accessing the `vsf-lexascms/requestContext` getter.

The following example shows how you could attach a request context from the `serverPrefetch` hook of your themes top level `App` component.

```vue
<template>
  <!-- ... -->
</template>

<script>
// ...

export default {
  
  // ...

  serverPrefetch () {
    this.$store.dispatch('vsf-lexascms/setRequestContext', {
      audienceAttributes: {
        age: 25,
        location: 'GB'
      }
    });
  },
  
  // ...

}
</script>
```

### Supporting Content Previews

When making use of LexasCMS's [visual content previews](https://www.lexascms.com/features/content-previews/) feature, LexasCMS will load your website with the `lexascmsRequestContent` query parameter.

The value of this parameter will be a pre-encoded request context, which should be provided directly to all requests to the Content Delivery API.

Taking the previous example, the below snippet has been updated to instead pull the pre-encoded value from the `lexascmsRequestContent` query parameter:

```vue
<template>
  <!-- ... -->
</template>

<script>
// ...

export default {
  
  // ...

  serverPrefetch () {
    // Get pre-encoded LexasCMS request context
    const preEncodedRequestContext = this.$route.query.lexascmsRequestContext;
    // Set request context is value has been provided
    if (preEncodedRequestContext !== undefined) {
      this.$store.dispatch('vsf-lexascms/setRequestContext', preEncodedRequestContext);
    }
  },
  
  // ...

}
</script>
```


Example
----------------------------------------------------------------

This section provides an example of using this module to create a new `BlogPost` component which retrieves and displays a given blog post from LexasCMS.

The below code defines our new `BlogPost` component:

```vue
<template>
  <div>
    <div v-if="item">
      <h2>{{item.title}}</h2>
      <div>{{item.body}}</div>
    </div>
  </div>
</template>

<script>
import LexascmsItemMixin from 'src/modules/vsf-lexascms/src/mixins/LexascmsItem';

export default {
  mixins: [ LexascmsItemMixin ]
}
</script>
```

This component can then be used as follows:

```vue
<BlogPost content-type="blogPost" id="cea618d6-16a0-4b9a-87fa-7a1f750f29b6" />
```

Since we'll always be retrieving a blog post, we can simplify the usage of our component by defaulting the value of the `contentType` prop to `blogPost`.

```vue
// ...

<script>
import LexascmsItemMixin from 'src/modules/vsf-lexascms/src/mixins/LexascmsItem';

export default {
  mixins: [ LexascmsItemMixin ],

  props: {
    contentType: {
      type: String,
      default: 'blogPost'
    }
  }
}
</script>
```

Our component usage would then look something like this:

```vue
<BlogPost id="cea618d6-16a0-4b9a-87fa-7a1f750f29b6" />
```

License
----------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE).
