<template>
  <transition name="fade" mode="out-in">
    <div class="om-category-header" :class="{'tyre-background': getCategoryTitle === 'Fuel Tank Parts'}"  v-if="title">
      <div class="om-category-header__inner">
        <SfHeading :title="title" class="title" :level="1"/>
        <div v-if="description != null" class="description desktop-only" v-html="description"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { SfHeading, SfButton } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';

export default {
  name: 'OmniCategoryHeader',
  components: {
    SfHeading,
    SfButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    products: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: ''
    },
    parentId: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      getCategoriesMap: 'category-next/getCategoriesMap'
    }),
    links () {
      if (this.products?.length) {
        return this.products
      } else {
        const parentKey = Object.keys(this.getCategoriesMap)?.find(key => +key === +this.parentId)

        if (this.getCategoriesMap[parentKey]?.children_data) {
          return this.getCategoriesMap[parentKey].children_data.map(p => {
            if (p.name !== this.title) {
              return p
            } else {
              return { ...p, active: true }
            }
          })
        } else return []
        // return this.getCategoriesMap[parentKey].children_data
      }
    },
      getCategoryTitle () {
      return this.breadcrumbs?.length && this.breadcrumbs[this.breadcrumbs.length - 1].text
    }
  },
  methods: {
    goToLink (url) {
      this.$router.push(this.localizedRoute('/' + url));
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-category-header {
  display: flex;
  margin: auto;
  background-position: center;
  background-size: cover;
  min-height: 200px;
 @include for-mobile{
    padding: 20px 15px 0 15px;
    min-height: auto;
  }
 &__inner{
   max-width: 1400px;
   margin: auto;
 }
 .title{
   h1{
  //  font-weight: 700;
   text-align: center;
   margin: 0;
   }
 }
  .description {
    display: flex;
    justify-content: center;
    margin-bottom: 0;
    font-size: 14px;
    p{
      margin: 0;
      text-align: center;
      max-width: 800px;
    }
  }

  .links {
    margin-top: 5px;
    display: flex;
    padding: 0 0 0 0;
    height: 45px;
    gap: 20px;
    justify-content: flex-start;
    white-space: pre-wrap;
    max-width: 90vw;
    height: 100%;
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  @include for-desktop{
    max-width: 800px;
  }
  }
.links::-webkit-scrollbar {
  display: none;
}
  .sf-heading {
    margin: 10px 0 40px 0;
    text-align: left;
    @include for-mobile{
      margin: 10px 0 20px 0;
    }
  }
  &__btn{
    border: none;
    font-size: 14px;
    padding: 0 15px 0 0;
    background: #fff;
    border-radius: 8px;
    &:hover{
      box-shadow: none;
    }
  }

  &__item {
    border-bottom: 2px solid transparent;
    padding-bottom: 20px;

    &-active {
      border-bottom: 2px solid var(--c-primary);
      transition: border-bottom 0.5;
    }
  }
}
.tyre-background{
  min-height: 350px;
  background-image: url(https://omni-epc.s3.eu-west-1.amazonaws.com/8764_MBUSA_Dealer_Banners_1_V2.jpg), -webkit-gradient(linear, left bottom, left top, from(#000), color-stop(50%, transparent)), -webkit-gradient(linear, left top, right top, from(#000), color-stop(50%, transparent));
  background-position: center;
  background-size: cover;
    @include for-mobile{
      background-image: none;
       min-height: auto;
    }
}
</style>
