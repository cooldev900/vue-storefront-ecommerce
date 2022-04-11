<template>
  <div class="mb-vehicle-prompt">
    <div class="mb-vehicle-prompt__card" @click="openBenzFinder">
      <div class="card-inner">
        <div class="copy-area">
          <h2>Your Vehicle</h2>
          <div v-if="isModelSet" class="model-details">
                     <p class="model-details__name">{{ getModelName }} {{ getModelYear }}</p>
             <div class="vehicle-details__with-reg" v-if="getModelReg">
      <input disabled :value="getModelReg">
      <div class="reg-label">
        <svg data-v-6f0354be="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="inline-icon inline-icon--medium"><g data-v-6f0354be=""><circle data-v-6f0354be="" fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="2.0027,2.0027" cx="24" cy="13.8" r="12.8" /></g> <g data-v-6f0354be=""><path data-v-6f0354be="" fill="#fff" d="M11,41.1c0-4.2,3.2-6.9,7.1-6.9c2.7,0,4.5,1.4,5.5,3l-2.3,1.3c-0.6-0.9-1.8-1.7-3.1-1.7   c-2.4,0-4.2,1.8-4.2,4.4s1.7,4.4,4.2,4.4c1.2,0,2.3-0.5,2.8-1v-1.6h-3.5v-2.5h6.3v5.1C22.4,47,20.5,48,18.1,48   C14.2,48,11,45.3,11,41.1z" /> <path data-v-6f0354be="" fill="#fff" d="M25.9,47.8V34.5h7c2.5,0,3.8,1.6,3.8,3.4c0,1.7-1,2.8-2.3,3c1.4,0.2,2.5,1.6,2.5,3.2c0,2-1.3,3.6-3.9,3.6   H25.9z M33.9,38.4c0-0.8-0.6-1.4-1.6-1.4h-3.5v2.8h3.5C33.3,39.8,33.9,39.2,33.9,38.4z M34.1,43.8c0-0.8-0.6-1.5-1.7-1.5h-3.7v3   h3.7C33.5,45.3,34.1,44.7,34.1,43.8z" /></g>
        </svg>
      </div>
           </div>
          </div>
          <p class="copy" v-else>
            Select your vehicle to find recommended tyres
          </p>
        </div>
        <div class="action-area">
          <SfButton @click="openBenzFinder" class="om-btn--secondary" style="width: 100%;">
            {{ isModelSet ? 'Change Vehicle' :  'Select a Vehicle' }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { checkWebpSupport } from 'theme/helpers';
import { ModalList } from 'theme/store/ui/modals';

export default {
  name: 'SbVehiclePrompt',
  components: {
    SfCallToAction,
    SfButton
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle'
    }),
    getModelName () {
      return `${this.activeVehicle.tire_size }`;
    },
    getModelReg () {
      return `${this.activeVehicle.VRN || ''}`;
    },
     getModelYear () {
      return `${this.activeVehicle.Year || ''}`;
    },
    isModelSet () {
      return this.activeVehicle && Object.keys(this.activeVehicle).length
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    onClick (key) {
      console.log(key)
    },
    openBenzFinder () {
      if (this.isModelSet) {
        this.openVehicleCart({ type: 'vehiclecart' });
      } else {
        this.openModal({
          name: ModalList.OmSelectorModal,
          payload: { dropdownKeys: [], enableAction: true }
        });
      }
    }
  },
  mounted () {
    const { query } = this.$route;
    if (query?.brand) {
      this.openModal({
        name: ModalList.OmSelectorModal,
        payload: { dropdownKeys: [], enableAction: true }
      });
    }
  }
}
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.mb-vehicle-prompt{
  border: 1px solid #ccc;
  border-radius: 4px;
@include for-mobile{
  padding: 25px;
}
&__card{
    cursor: pointer;
     background: #fff;
      @include for-mobile{
        width: 100%;
      }
}
.card-inner{
    display: flex;
    padding: 30px;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
    @include for-mobile{
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    text-align: center;
    }
    .copy-area{
        display: flex;
        flex-direction: column;
        flex: 1;
        flex-wrap: wrap;
        justify-content: center;
              @include for-mobile{
              margin-left: 0;
            }
        h2{
            margin: 0;
            line-height: normal;
            font-size: 18px;
            text-transform: none;
            margin-bottom: 16px;
        }
        .copy{
            margin: 0;
            font-family: var(--font-family-primary);
            color: #262626;
        }
    }
    .model-details{
    &__name{
      color: #333;
      margin: 0;
      line-height: 28px;
      font-size: 14px;
    }
    &__type{
      color: #262626;
      margin: 0;
    }
    }
    .action-area{
      display: flex;
      align-items: flex-end;
    }
    .car-icon{
    width: 110px;
    height: 110px;
    display: flex;
    color: #999;
    border: 1px dashed #999;
    border-radius: 50%;
    justify-self: center;
    justify-content: center;
    align-items: center;
    svg {
        width: 24px;
        height: 24px;
        fill: #999;
    }
    }
}
}
.vehicle-details__with-reg{
  position: relative;
  margin: 10px 0;
  width: 100%;
  overflow: hidden;
}
  input {
    text-align: center;
    width: 100%;
    font-size: 16px;
    color: #343434;
    background: #f6f6f6;
    padding-left: 32px;
    border: none;
    font-weight: normal;
    text-transform: uppercase;
    border-radius: 0;
    padding: 1rem;
  }
  input::-webkit-input-placeholder {
    font-size: 18px;
  }
  .reg-label {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    background-color: var(--c-primary);
    padding: 8px 0;
    svg {
      width: 32px;
      height: 32px;
    }
  }
.sb-car-locator {

    max-width: 1680px;
    margin: auto;
    width: 86%;

    @include for-desktop {

    }

    padding: 5px;

    .sf-call-to-action {
      border-radius: 6px;
        height: 500px;
        align-items: flex-end;
        margin: 30px 5px;

        .sub-title {
            color: white;
            margin: 10px 0;
            font-size: 40px;
        }

        .sf-button {
            border-color: white;
            border-radius: 4px;
            color: white;
        }
    }
}
</style>
