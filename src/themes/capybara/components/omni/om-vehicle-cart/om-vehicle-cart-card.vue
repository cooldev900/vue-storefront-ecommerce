<template>
  <div class="om-vehicle-cart-card">
    <div v-if="!readOnly" class="close-button">
      <div v-if="active" class="active-content">
        <i class="icon-checkmark" /> Active
      </div>
      <SfButton
        v-else
        class="action-button"
        @click="setAsMain"
      >
        <i class="icon-arrow-right" />
        {{ actionButtonTitle }}
      </SfButton>
      <SfButton class="sf-button--pure" @click="onRemove">
        <SfIcon
          icon="cross"
          size="xxs"
        />
      </SfButton>
    </div>

    <!-- <div class="om-vehicle-cart-card__body" @click="onClick"> -->
    <div class="om-vehicle-cart-card__body">
        <i class="icon-configurator" />
      <!-- <SfImage :src="vehicle.imgUrl" /> -->
      <div class="vehicle-details">
        <h3 class="title">
          {{ vehicle.Model }} {{ vehicle.Bodystyle }}
        </h3><span>{{ vehicle.Engine }}</span>
        <!-- <div v-if="!vehicle.VIN || editableVin" class="input-wrapper">
          <div class="input-wrapper">
          <SfInput label="VIN" placeholder="VIN" v-model="vin" />
          <transition name="fade" mode="out-in">
            <SfButton class="sf-button--pure" @click="onSave('VIN', vin)">
              <SfIcon
                v-if="vin.length"
                icon="check"
                size="xxs"
                color="green"
              />
            </SfButton>
          </transition>
        </div> -->
        <div v-if="vehicle.VIN" class="editable-input">
          {{ showVin(vehicle.VIN) }}
          <transition name="fade" mode="out-in">
            <SfButton v-if="isManualSelected" class="sf-button--pure" @click="makeEditableVin()">
              <SfIcon
                icon="check"
                size="xxs"
                color="green"
              />
            </SfButton>
          </transition>
        </div>
        <!-- <div v-if="!vehicle.VRN || editableVrn" class="input-wrapper">
          <SfInput label="VRN" placeholder="VRN" v-model="vrn" />
          <transition name="fade" mode="out-in">
            <SfButton class="sf-button--pure" @click="onSave('VRN', vrn)">
              <SfIcon
                v-if="vrn.length"
                icon="check"
                size="xxs"
                color="green"
              />
            </SfButton>
          </transition>
        </div> -->
        <div v-if="vehicle.VRN" class="editable-input">
          {{ vehicle.VRN }}
          <transition name="fade" mode="out-in">
            <SfButton v-if="isManualSelected" class="sf-button--pure" @click="makeEditableVrn()">
              <SfIcon
                icon="check"
                size="xxs"
                color="green"
              />
            </SfButton>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SfImage, SfCallToAction, SfIcon, SfButton, SfInput } from '@storefront-ui/vue';
import { mapActions } from 'vuex';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { Logger } from '@vue-storefront/core/lib/logger';

export default {
  name: 'OmVehicleCartCard',
  components: {
    SfImage,
    SfCallToAction,
    SfIcon,
    SfButton,
    SfInput
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    vehicle: {
      type: Object,
      default: () => {}
    },
    actionButtonTitle: {
      type: String,
      default: 'Set as Main'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      vin: '',
      vrn: '',
      editableVin: false,
      editableVrn: false
    }
  },
  computed: {
    isManualSelected () {
      return !this.vehicle.Registration_Date;
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar'
    }),
    async onRemove () {
      await this.$store.dispatch('vehicles/removeVehicle', this.vehicle);
    },
    async setAsMain () {
      await this.$store.dispatch('vehicles/saveActiveVehicle', this.vehicle);
    },
    onClick () {
      this.$router.push({
        name: 'vehicle-svg',
        params: {
          nationalCode: this.vehicle.national_code,
          visualGroup: '02'
        }
      })

      this.closeSidebar();
    },
    async onSave (key, value) {
      await this.$store.dispatch('vehicles/saveActiveVehicle', { ...this.vehicle, [key]: value });
      await this.$store.dispatch('vehicles/saveVehicles', { ...this.vehicle, [key]: value });
      const cartItems = await StorageManager.get('cart').getItem('current-cart');
      cartItems.forEach(item => {
        if (item.fitVehicles) {
          item.fitVehicles.forEach((fitItem, index) => {
            if (fitItem.national_code === this.vehicle.national_code) {
              item.fitVehicles[index] = { ...fitItem, [key]: value }
            }
          });
        }
      })

      await StorageManager.get('cart').setItem('current-cart', cartItems).catch((reason) => {
        Logger.error(reason)()
      })
      const storedItems = await StorageManager.get('cart').getItem('current-cart');
      this.$store.dispatch('cart/syncCartWhenLocalStorageChange', { items: storedItems })
      if (key === 'VIN') {
        this.editableVin = false;
      } else {
        this.editableVrn = false;
      }
    },
    makeEditableVrn () {
      this.editableVrn = true;
      this.vrn = this.vehicle.VRN;
    },
    makeEditableVin () {
      this.editableVin = true;
      this.vin = this.vehicle.VIN;
    },
    showVin (vin) {
      const replaceAt = (source, index, replacement) => {
        return source.substr(0, index) + replacement + source.substr(index + replacement.length);
      }

      return replaceAt(vin, 10, '**');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-cart-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background: white;
  margin: 0;
  border-bottom: 1px solid #ccc;

  @include for-desktop {
    ::v-deep .sf-call-to-action {
      --call-to-action-padding: 0 0;
      --call-to-action-text-container-width: 45%;
      min-height: 100%;
      padding: var(--spacer-base) 0px;
    }
  }
  &__body {
    /* cursor: pointer; */
    display: flex;
    padding: 20px;
    i{
    font-size: 100px;
    color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 30px;
    }
  }
  .close-button {
    display: flex;
    justify-content: space-between;
    height: 38px;
    align-items: center;
    padding: 15px 15px 0 15px;
  }
  .vehicle-details{
    display: flex;
    width: 65%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
  }
  .active-content {
    display: flex;
    align-items: center;
    background: #e9ecec;
    overflow: hidden;
    position: relative;
    padding: 2px 15px;
    font-size: 14px;
    text-transform: uppercase;
    color:#0c121c;
    z-index: 1;
    i{
      font-size: 30px;
      color: var(--_c-green-primary);
    }
    i::before{
      vertical-align: middle;
    }
  }
  .action-button {
     display: flex;
    align-items: center;
    background: #e9ecec;
    overflow: hidden;
    position: relative;
    padding: 2px 15px;
    font-size: 14px;
    text-transform: uppercase;
    color:#0c121c;
    z-index: 1;
    i{
      font-size: 30px;
      color: var(--_c-green-primary);
    }
    i::before{
      vertical-align: middle;
    }
  }
  // &:hover {
  //   .title {
  //     text-decoration: underline;
  //   }
  // }
  .sf-image {
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
  }
  .title {
    color: var(--c-grey-text);
    font-size: 20px;
    margin: 0;
    display: flex;
    align-items: center;
    padding-right: var(--spacer-xl);
  }
  .check__icon {
    position: relative;
    top: -65px;
    right: 0;
  }
  .input-wrapper {
    display: flex;
  }
  .editable-input {
    display: flex;
    gap: var(--spacer-sm);
  }
}
</style>
