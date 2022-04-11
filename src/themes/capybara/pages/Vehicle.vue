<template>
  <div class="static-page">
    <h1>Your {{ brand }}</h1>
    <transition-group name="fade">
      <component
        v-for="content in storyblokData.body"
        :key="content._uid"
        :is="getComponentName(content.component)"
        :content="content"
      />
    </transition-group>
  </div>
</template>

<script>
import axios from 'axios';
import { SfLoader } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';
export const getStoryblokData = async () => {
  const res = await axios.get(
    `https://altayer-stage.omninext.co.uk/api/storyblok/storyblok-4/vehicle`
  );

  if (res.data.success) {
    return res.data.result.content;
  }
  return {};
}

export default {
  name: 'Vehicle',
  components: {
    SfLoader
  },
  data () {
    return {
      vehicle: {},
      storyblokData: {}
    };
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle'
    }),
    description () {
      return `${this.activeVehicle?.Model || ''} ${this.vehicle?.level2 ||
        ''} ${this.vehicle?.level5 || ''} ${this.vehicle?.level6 ||
        ''} ${this.vehicle?.level7 || ''} ${this.vehicle?.level3 ||
        ''}`;
    },
    brand () {
      return this.activeVehicle?.Model || '';
    },
    regCode () {
      if (this.activeVehicle?.vrn) {
        return this.activeVehicle?.vrn;
      } else {
        return null;
      }
    }
  },
  methods: {
    getComponentName (name) {
      return `sb-${name.replaceAll('_', '-')}`;
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler () {
        this.storyblokData = await getStoryblokData(this.$route)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.loading-container {
  height: 100vh;
}

</style>
