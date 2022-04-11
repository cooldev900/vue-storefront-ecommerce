<template>
  <div class="vehicle-fitment__product">
    <div class="fitment-status">
      {{ $t(title) }}
    </div>
    <div class="vehicle-details__with-reg" v-if="vehicleReg">
      <input disabled :value="vehicleReg">
      <div class="reg-label">
        <svg data-v-6f0354be="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="inline-icon inline-icon--medium"><g data-v-6f0354be=""><circle data-v-6f0354be="" fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="2.0027,2.0027" cx="24" cy="13.8" r="12.8" /></g> <g data-v-6f0354be=""><path data-v-6f0354be="" fill="#fff" d="M11,41.1c0-4.2,3.2-6.9,7.1-6.9c2.7,0,4.5,1.4,5.5,3l-2.3,1.3c-0.6-0.9-1.8-1.7-3.1-1.7   c-2.4,0-4.2,1.8-4.2,4.4s1.7,4.4,4.2,4.4c1.2,0,2.3-0.5,2.8-1v-1.6h-3.5v-2.5h6.3v5.1C22.4,47,20.5,48,18.1,48   C14.2,48,11,45.3,11,41.1z" /> <path data-v-6f0354be="" fill="#fff" d="M25.9,47.8V34.5h7c2.5,0,3.8,1.6,3.8,3.4c0,1.7-1,2.8-2.3,3c1.4,0.2,2.5,1.6,2.5,3.2c0,2-1.3,3.6-3.9,3.6   H25.9z M33.9,38.4c0-0.8-0.6-1.4-1.6-1.4h-3.5v2.8h3.5C33.3,39.8,33.9,39.2,33.9,38.4z M34.1,43.8c0-0.8-0.6-1.5-1.7-1.5h-3.7v3   h3.7C33.5,45.3,34.1,44.7,34.1,43.8z" /></g>
        </svg>
      </div>
    </div>
    <div class="vehicle-details" v-else>
      <input disabled :value="vehicleInfo">
    </div>
    <SfButton
      class="sf-button--pure change-vehicle__btn"
      @click="openVehicleCart({ type: 'vehiclecart' })"
    >
      Change Vehicle
    </SfButton>
    <template v-if="isFit">
      <div class="check__icon is-fit">
        <SfIcon
          class="icon fits-icon"
          icon="check"
          icon-size="20px"
          disabled
        />
      </div>
    </template>
    <template v-else>
      <div class="check__icon not-fit">
        <SfIcon
          class="icon no-fit-icon"
          icon="cross"
          icon-size="20px"
          disabled
        />
      </div>
    </template>
  </div>
</template>

<script>
import { SfButton, SfIcon, SfCircleIcon } from '@storefront-ui/vue';
import { mapActions } from 'vuex';

export default {
  name: 'OmAddCartStep1',
  components: {
    SfButton,
    SfIcon,
    SfCircleIcon
  },
  props: {
    isFit: {
      type: Boolean,
      default: true
    },
    vehicleInfo: {
      type: String,
      default: ''
    },
    vehicleReg: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.isFit ? `It fits your vehicle:` : `This product does not fit your vehicle`;
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    })
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.vehicle-fitment__product{
    background: #f6f6f6;
    display: flex;
    position: relative;
    padding: 10px 20px;
    flex-wrap: wrap;
    min-height: 50px;
    border-left: 3px solid var(--c-primary);
 .fitment-status{
   width: 100%;
   margin-bottom: 10px;
 }
.vehicle-details{
  width: 100%;
    input {
    font-size: 14px;
    color: #343434;
    background: #fff;
    padding-left: 32px;
    border: none;
    font-weight: normal;
    width: 75%;
    text-transform: uppercase;
    border-radius: 0;
    padding: 1rem;
  }
}
.change-vehicle__btn{
    width: auto;
    font-weight: 700;
    font-size: 14px;
}
.fits-icon{
  fill: var(--c-primary);
}
.no-fit-icon{
  fill:#e00751;
}
.vehicle-details__with-reg{
  position: relative;
  margin: 10px 0;
  width: 100%;
    input {
    text-align: center;
    width: 75%;
    font-size: 16px;
    color: #343434;
    background: #fff;
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
.check__icon{
    top: 0;
    right: 20px;
    position: absolute;
    bottom: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
}
.om-add-cart-step1 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #d8d8d8;
  padding: 20px;
  overflow: hidden;
  background: white;
  .sf-call-to-action {
    &.is-fit {
      background-position: right;
      background-size: contain;
      background-size: 50%;
      ::v-deep .sf-call-to-action__title {
        font-size: 34px;
        font-weight: bold;
        color: #000;
      }
      ::v-deep .sf-call-to-action__description {
        font-weight: bold;
        font-size: 20px;
        color: #2b2b2b;
      }
      ::v-deep .sf-button:disabled{
        --button-background: var(--c-badge);
      }
    }
  }

::v-deep .check__icon {
    top: 0;
    right: 20px;
    position: absolute;
    bottom: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.not-fit {
      ::v-deep .sf-button {
        --button-background: #808080;
      }
    }
  }
}

::v-deep {
  --call-to-action-padding: var(--spacer-xs) var(--spacer-sm);
  .sf-button:disabled {
    --button-background: var(--c-primary);
  }
  --button-size: 2.25rem;
}
</style>
