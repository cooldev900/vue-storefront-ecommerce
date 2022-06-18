<template>
  <div class="top-bar">
    <div class="top-bar__inner">
    <div class="top-bar__left">
      <ul class="top-bar__menu" v-for="item in confidenceBarItems"
          :key="item._uid"
      >
        <li><a>{{ item.Name }}</a></li>
      </ul>
      <div class="top-bar__left--locations">
        <a>Locations</a>
      </div>
      <!--@slot Custom left content-->
    </div>
    <div class="top-bar__right">
      <ul class="top-bar__menu" v-for="item in topbarRight"
          :key="item._uid"
      >
        <li><a :class="item.Style">{{ item.Name }}</a></li>
      </ul>
    </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'SFTopBar',
  components: {
    SfImage
  },
  computed: {
    ...mapGetters('vehicles', ['globalSbData']),
    confidenceBarItems () {
      if (this.globalSbData) {
        const confidenceBar = this.globalSbData['header_links'].find(
          item => item.component === 'top_bar'
        );
        return confidenceBar ? confidenceBar.Left : [];
      } else {
        return [];
      }
    },
    topbarRight () {
      if (this.globalSbData) {
        const Right = this.globalSbData['header_links'].find(
          item => item.component === 'top_bar'
        );
        return Right ? Right.Right : [];
      } else {
        return [];
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.top-bar{
    height: 30px;
    border-bottom: 1px solid #eee;
    background: #fff;
    font-size: 12px;
    z-index: 2;
    position: relative;
    @include for-mobile{
      display: none;
    }
  &__inner{
    max-width: 1400px;
    margin: auto;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__left{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &--locations{
      a{
        background: #333;
        color: #fff;
        display: flex;
        align-items: center;
        line-height: 1;
        height: 30px;
        padding: 0 20px;
      }
    }
  }
    &__right{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
.top-bar__menu{
    margin: 0;
    padding: 0;
    list-style: none;
 li{
   a{
     padding: 7px 15px;
     border-right: 1px solid #eee;
     color: #333;
     font-family: "bmwTypeNextWeb-Light", Arial, Helvetica, sans-serif;
     font-size: 12px;
   }
   a.highlight{
      background: var(--c-primary);
      color: #fff;
      font-family: "bmwTypeNextWeb-Light";
     font-size: 12px;
    }
 }
}
}
</style>
