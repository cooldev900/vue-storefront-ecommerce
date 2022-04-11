<template>
  <div class="new-vehicle">
    <input type="text" v-model="vrm" :disabled="disableInput" placeholder="e.g. YA16 ABC" />

    <!-- <VueRecaptcha sitekey="6Ld9BDIbAAAAAH37kokRJW0RjJO0jFv3RP-6KpqT" :loadRecaptchaScript="true"> -->
    <SfButton class="om-btn--primary" v-if="showGoButton" @click="onSubmit()" :disabled="loading">
      <SfLoader v-if="loading" :loading="loading" />
      <span v-else>Find</span>
    </SfButton>
    <!-- </VueRecaptcha> -->
    <OmNotificationModal :isVisible="showNotificationModal" @close="showNotificationModal=false">
      <OmAlertBox type="warning" :message="errorMessage" />
    </OmNotificationModal>
  </div>
</template>

<script>
import { SfButton, SfLoader } from '@storefront-ui/vue';
import axios from 'axios';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapActions } from 'vuex';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import OmNotificationModal from 'theme/components/omni/modals/om-notification-modal.vue';
import OmAlertBox from 'theme/components/omni/om-alert-box';
// import { localizedRoute } from '@vue-storefront/core/lib/multistore';
// import config from 'config';

export default {
  components: {
    SfButton,
    SfLoader,
    OmNotificationModal,
    OmAlertBox
  },
  props: {
    showGoButton: {
      type: Boolean,
      required: false,
      default: true
    },
    disableInput: {
      type: Boolean,
      required: false,
      default: false
    },
    initalValue: {
      type: String,
      required: false,
      default: null
    },
    successAction: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      vrm: this.initalValue,
      hasError: false,
      modalData: {},
      loading: false,
      showNotificationModal: false,
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions({
      toggleSidebar: 'ui/toggleSidebar'
    }),
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    async onSubmit () {
      if (!this.vrm) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: 'This field should be inputted'
          }),
          { root: true }
        );
        return;
      }

      try {
        this.loading = true;
        // await this.$recaptchaLoaded()
        // // Execute reCAPTCHA with action "login".
        // const token = await this.$recaptcha('login')

        const {
          data: { result, success }
        } = await axios.post(
          `https://shop.theoceangroup.co.uk/api/vehicle/new-vehicle`,
          {
            vrm: this.vrm
            // token
          }
        );
        result.reg = result.level6;
        delete result.level6;

        if (success && result.national_code) {
          const storeview = currentStoreView();
          const brands = config['brands'][`store-${storeview.storeId}`];
          const brandVrns = brands.map(brand => brand.brand_vrn);

          if (brandVrns.includes(result.Make)) {
            await this.$store.dispatch('vehicles/saveVehicles', result);
            await this.$store.dispatch('vehicles/saveActiveVehicle', result);
            if (this.successAction) {
              this.toggleSidebar({ type: 'vehiclecart' });
            }
            // const {
            //   meta: { breadcrumb },
            //   fullPath
            // } = this.$route;

            // if (
            //   !(breadcrumb.includes('Category') || fullPath.includes('.html'))
            // ) {
            //   this.$router.push(localizedRoute('/'));
            // }
          } else {
            this.showNotificationModal = true;
            this.errorMessage = `This vrn is not fit for current brands - ${brandVrns.join(',')}. But your vrn has ${result.Make} brand.`
          }
          // this.closeModal();
        } else {
          this.$store.dispatch(
            'notification/spawnNotification',
            notifications.createNotification({
              type: 'danger',
              message: 'Failed the registeration a new RegCode!'
            }),
            { root: true }
          );
        }
      } catch (e) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: 'Failed the registeration a new RegCode!'
          }),
          { root: true }
        );
      }
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.new-vehicle {
  position: relative;
  display: flex;
  padding: 0 20px 20px 20px;
  input {
    max-width: 315px;
    text-align: center;
    width: 100%;
    font-size: 18px;
    color: #343434;
    background: #fff;
    resize: none;
    padding-left: 32px;
    border: 1px solid #666;
    font-weight: normal;
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
  .sf-button {
    display: inline-block;
    min-width: 97px;
    min-height: 51.19px;
  }
}
</style>
