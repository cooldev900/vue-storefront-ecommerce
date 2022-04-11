<template>
  <div class="om-card-collection">
    <OmCard
      v-for="(card, index) in cards"
      :key="index"
      :info="card"
    />
    <i class="icon-geolocation" />
  </div>
</template>

<script>
import OmCard from './om-card';
import { mapGetters } from 'vuex';

export default {
  name: 'OmCardCollection',
  components: {
    OmCard
  },
  props: {
    storyblokKey: {
      type: String,
      default: 'home'
    }
  },
  computed: {
    ...mapGetters('vehicles', ['storyblok', 'storyblokContent']),
    cards () {
      const contentKey = 'best_match_grid';

      if (this.storyblokContent(contentKey, this.storyblokKey)) {
        return this.storyblokContent(contentKey, this.storyblokKey).logos.map(logo =>
          ({
            imgUrl: logo.logo.filename,
            title: logo.title,
            text: logo.description
          }))
      } else {
        return []
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-card-collection {
  margin: var(--spacer-2xl) 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--spacer-xl);
}
</style>
