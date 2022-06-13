<template>
  <div class="om-info-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <!-- <SfLoader :loading="loading">
      </SfLoader> -->
      <div id="findSizeOuter">
        <div id="findSizeInner">
          <div id="content01">
            <h2>How to find your tyre size</h2>
            <h4>Use our guide below to easily and quickly find your tyre size from the side of your existing tyres. Alternatively you can perform a search using your vehicle registration.</h4>
          </div>
          
          <div id="content02">
            <div class="boxContent">
                      <div class="circleslot"><img src="//images.blackcircles.com/find-tyre-size/one-circle.png"></div>
                      <div class="columnTitle"><h3>Width</h3></div>
                      <div class="imageslot"><img src="//images.blackcircles.com/find-tyre-size/circle-width.png"></div>
                      <div class="textslot"><p>You’re looking for a three digit number – i.e. <b>205</b></p></div>
            </div>
            
            <div class="boxContent">
                      <div class="circleslot"><img src="//images.blackcircles.com/find-tyre-size/two-circle.png"></div>
                      <div class="columnTitle"><h3>Profile</h3></div>
                      <div class="imageslot"><img src="//images.blackcircles.com/find-tyre-size/circle-profile.png"></div>
                      <div class="textslot"><p>Followed by a two digit number – i.e. <b>55</b> </p></div>
            </div>
            
            <div class="boxContent">
                      <div class="circleslot"><img src="//images.blackcircles.com/find-tyre-size/three-circle.png"></div>
                      <div class="columnTitle"><h3>Rim Size</h3></div>
                      <div class="imageslot"><img src="//images.blackcircles.com/find-tyre-size/circle-rim.png"></div>
                      <div class="textslot"><p>The rim size is represented next to an ‘R’ – i.e. <b>16</b></p></div>
            </div>
            
            <div class="boxContent">
                      <div class="circleslot"><img src="//images.blackcircles.com/find-tyre-size/four-circle.png"></div>
                      <div class="columnTitle"><h3>Speed Ratings</h3></div>	
                      <div class="imageslot"><img src="//images.blackcircles.com/find-tyre-size/circle-speed.png"></div>
                      <div class="textslot"><p>Finally, the speed rating will be a single letter – i.e. <b>V</b></p></div>
            </div>
            <div style="clear:both;"></div>
          </div>
          <div id="content03">
            <img src="//images.blackcircles.com/find-tyre-size/find-tyre-size.png">
          </div>
          
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'OmFindTireModal',
  components: { SfModal, SfLoader },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: null,
      loading: false
    }
  },
  methods: {
    closeModal () {
      console.log('clost modal');
      this.$emit('update', false);
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-info-modal {
  .sf-modal__container {
    width: 900px;
    height: calc(100vh - 100px);
    border-radius: 10px;
    @include for-mobile {
      width: 100vw;
      height: 100vh;
    }

    .sf-modal__content {
      height: 100%;
    }
  }
}

#findSizeOuter {
    width: 100%;
    max-width: 780px;
    height: auto;
    position: relative;
    display: block;
    margin: 0 auto;
    padding: 0;
    background: #f9f9f9;
}

#findSizeInner {
    width: 98%;
    height: auto;
    position: relative;
    margin: 0 auto;
    text-align: center;
    padding: 0 01%;

   h2 {
      font-weight: 200;
      font-size: 2.4em;
      padding: 2% 2% 0%;
      -webkit-font-smoothing: antialiased;
  }

  h4 {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5em;
    color: dimgrey;
    max-width: 650px;
    margin: 0 auto;
    padding: 1% 4% 3%;
}
}

#content01, #content02, #content03 {
    width: 100%;
    position: relative;
    display: block;
    margin: 0;
    clear: both;
    overflow: hidden;

   .boxContent {
      width: 24%;
      margin: 0.5%;
      background: #ffffff;
      display: inline-block;
      float: left;
      border: 1px solid gainsboro;
      box-sizing: border-box;
      border-radius: 0 0 20px 20px;

      .circleslot, .columnTitle {
          width: 100%;
          box-sizing: border-box;
          background: #f2f2f2;
      }

      .imageslot {
          background: #ffffff;
          display: block;
      }

      .textslot {
          padding: 0 3%;
          min-height: 3.5em;
      }
  }

  #content03 img {
      border: 0px none;
      width: 100%;
      display: block;
      padding: 2% 0 0;
  }
}
</style>
