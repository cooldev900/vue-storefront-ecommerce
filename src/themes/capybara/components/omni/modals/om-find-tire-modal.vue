<template>
  <div class="om-info-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <!-- <SfLoader :loading="loading">
      </SfLoader> -->
      <div id="findSizeOuter">
        <div id="findSizeInner">
          <div id="content01">
            <h3>{{ $t('How to find your tire size') }}</h3>
            <h4>
              {{ $t('Use the guide') }}
            </h4>
          </div>

          <div class="tire-finder__process">
            <div class="process-item">
              <div class="number-holder">
                <span class="number">1</span>
              </div>
              <div class="columnTitle"><h5>{{ $t('Width title') }}</h5></div>
              <div class="imageslot">
                <img
                  src="/assets/tire-width.png"
                />
              </div>
              <div class="textslot">
                <p>{{ $t('Width description') }}</p>
              </div>
            </div>

            <div class="process-item">
              <div class="number-holder">
                <span class="number">2</span>
              </div>
              <div class="columnTitle"><h5>{{ $t('Profile title') }}</h5></div>
              <div class="imageslot">
                <img
                  src="/assets/tire-profile.png"
                />
              </div>
              <div class="textslot">
                <p>{{ $t('Profile description') }}</p>
              </div>
            </div>

            <div class="process-item">
              <div class="number-holder">
                <span class="number">3</span>
              </div>
              <div class="columnTitle"><h5>{{ $t('Rim Title') }}</h5></div>
              <div class="imageslot">
                <img
                  src="/assets/tire-rim.png"
                />
              </div>
              <div class="textslot">
                <p>
                  {{ $t('Rim description') }}
                </p>
              </div>
            </div>
          </div>
          <div class="tire-finder__diagram">
            <img
              src="//images.blackcircles.com/find-tyre-size/find-tyre-size.png"
            />
          </div>
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfLoader } from "@storefront-ui/vue";

export default {
  name: "OmFindTireModal",
  components: { SfModal, SfLoader },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: null,
      loading: false,
    };
  },
  methods: {
    closeModal() {
      console.log("clost modal");
      this.$emit("update", false);
    },
  },
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-info-modal {
  .sf-modal__container {
    width: 900px;
    height: calc(100vh - 100px);
    border-radius: 10px;
    background: #f9f9f9;
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
  height: auto;
  position: relative;
  display: block;
  margin: 0 auto;
  padding: 0;
  background: #f9f9f9;
}

#findSizeInner {
  height: auto;
  position: relative;
  margin: 0 auto;
  text-align: center;
  padding: 0 01%;

  h3 {
    font-size: 30px;
    padding: 2% 2% 0%;
    margin-bottom: 10px;
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

#content01,
#content02,
#content03 {
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

    .circleslot {
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
.tire-finder {
  &__process {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @include for-mobile{
      grid-template-columns: 1fr;
    }
    .process-item {
      margin: 10px;
      background: #ffffff;
      display: inline-block;
      overflow: hidden;
      float: left;
      border: 1px solid #ccc;
      border-radius: 8px;
      .number-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f2f2f2;
        height: 70px;
        .number {
          background-color: var(--c-primary);
          border-radius: 50%;
          color: #ffffff;
          width: 3rem;
          height: 3rem;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          font-weight: 700;
          font-size: 20px;
        }
      }
      .circleslot,
      .columnTitle {
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
  }
  &__diagram{
    img{
      max-width: 100%;
    }
  }
}
</style>
