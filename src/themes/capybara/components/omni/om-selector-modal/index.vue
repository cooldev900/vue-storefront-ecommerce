<template>
  <div class="om-selector-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <div class="om-selector-modal__wrapper">
          <div class="om-selector-modal__header">
            <SfBar>
              <template #title>
                <p class="om-selector-modal__header-title">
                  Find Your Vehicle
                </p>

                <SfSteps
                  :active="currentStep"
                  :steps="steps"
                  @change="changeStep"
                >
                  <SfStep v-for="(step, index) in steps" :key="`step-${index}`" :name="step" />
                </SfSteps>
              </template>
            </SfBar>
          </div>
          <div class="om-selector-modal__content">
            <SfLoader v-if="loading" :loading="loading" />
            <div v-if="!loading && loadingError">
              {{ errorMessage }}
            </div>
            <div v-if="!loading && !loadingError">
              <div
                v-for="(item, index) in currentItems"
                :key="index"
                class="om-selector-modal__content-item"
                @click="onSelectVehicle(item.label)"
              >
                <div class="title">
                  {{ item.label }}
                </div>
                <i class="icon-arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfBar, SfCheckbox, SfImage, SfSteps, SfLoader } from '@storefront-ui/vue';
import NewVehicle from '../om-hero/new-vehicle.vue';
import config from 'config';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { mapActions } from 'vuex';

export default {
  name: 'OmSelectorModal',
  components: {
    SfModal,
    SfBar,
    SfCheckbox,
    NewVehicle,
    SfImage,
    SfSteps,
    SfLoader
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        payload: {
          hasError: false,
          regCode: '',
          successAction: false
        },
        name: 'modal'
      }),
      required: true
    }
  },
  computed: {
    showBrand () {
      return this.steps.includes('Brand');
    }
  },
  data () {
    return {
      currentItems: [],
      searchPattern: [],
      currentStep: 0, // it's number, not string
      esItems: [],
      steps: [
        'Model'
      ],
      loading: false,
      loadingError: false,
      newVinError: false,
      errorMessage: 'Not connecting ES',
      brands: []
    };
  },
  methods: {
    ...mapActions({
      toggleSidebar: 'ui/toggleSidebar'
    }),
    async onSelectVehicle (label) {
      this.searchPattern = [...this.searchPattern, label];

      if (this.searchPattern.length >= this.steps.length) { // TODO: get all hits instead of aggs
        const result = await this.fetchDataFromES(false, true);

        await this.$store.dispatch('vehicles/saveVehicles', result);
        await this.$store.dispatch('vehicles/saveActiveVehicle', result);
        if (this.modalData?.payload.successAction) {
          this.toggleSidebar({ type: 'vehiclecart' });
        }
        this.closeModal();
        await this.setup();
      } else {
        await this.fetchDataFromES();
        this.currentStep++;
      }
    },
    async changeStep (nextStep) {
      if (nextStep < this.currentStep) {
        this.searchPattern = this.searchPattern.slice(0, nextStep);
        this.currentStep = nextStep;
        if (nextStep === 0) {
          await this.setup(true);
        } else {
          await this.fetchDataFromES(true);
        }
      }
    },
    normalizationData (items, level) {
      return items.filter(item => item !== '-').map(item => {
        return this.showBrand && level === 0 ? {
          label: item.label,
          image: ''
        } : {
          label: item,
          image: ''
        }
      })
    },
    async fetchDataFromES (isBackStep = false, isLastStep = false) {
      this.loading = true;
      let selectedBrand = null; let payload = {}; let esQueryField = null;
      if (!isLastStep) {
        if (isBackStep) {
          esQueryField = this.steps[this.currentStep].toLowerCase();
        } else {
          esQueryField = this.steps[this.currentStep + 1].toLowerCase();
        }
      }

      if (this.showBrand) {
        selectedBrand = this.brands.find(brand => brand.label === this.searchPattern[0])
        if (!selectedBrand) {
          this.currentStep = 0;
          this.errorMessage = 'No matched brand';
          this.loadingError = true;
          this.loading = false;
          this.currentItems = [];
          this.searchPattern = [];
          return;
        }
        this.searchPattern.map((value, index) => {
          if (this.steps[index] === 'Brand') {
            payload['Brand'] = selectedBrand;
          } else {
            payload[this.steps[index]] = value;
          }
        })
      } else {
        selectedBrand = this.brands[0];
        if (selectedBrand.label !== this.searchPattern[0]) {
          this.currentStep = 0;
          this.errorMessage = 'No matched brand';
          this.loadingError = true;
          this.loading = false;
          this.currentItems = [];
          this.searchPattern = [];
          return;
        }
        payload['Brand'] = selectedBrand;
        this.searchPattern.map((value, index) => {
          payload[this.steps[index]] = value;
        })
      }

      if (!isLastStep) {
        const { data: { success, result } } = await axios.post(`${config.api.url}/api/vehicle/models/${esQueryField}`, payload);
        if (success) {
          this.esItems = result;
          this.currentItems = this.normalizationData(this.esItems, this.currentStep + 1);
        } else {
          this.loadingError = true;
        }
      } else {
        const { data: { success, result } } = await axios.post(`${config.api.url}/api/vehicle/vehicle-selector/national-code`, payload);
        if (success) {
          this.loading = false;
          return result;
        } else {
          this.loadingError = true;
          return null;
        }
      }

      this.loading = false;
    },
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    toggleErrorFlag (flag) {
      this.newVinError = flag;
    },
    getVrm () {
      if (this.modalData.payload.regCode) {
        return this.modalData.payload.regCode
      } else {
        return this.$refs['newVehicle'] ? this.$refs['newVehicle'].vrm : '';
      }
    },
    async setup (fromStepper = false) {
      this.searchPattern = [];
      this.currentStep = 0;
      this.loading = false;
      const storeview = currentStoreView();
      this.brands = config['brands'][`store-${storeview.storeId}`];

      if (!this.steps.includes('Brand') && this.brands.length !== 1) {
        this.steps = ['Brand', ...this.steps];
      }

      const { query } = this.$route;
      if (fromStepper || !query?.brand) {
        if (this.brands.length === 1) {
          this.currentStep = -1;
          await this.fetchDataFromES();
          this.currentStep = 0;
        } else {
          this.currentItems = this.normalizationData(this.brands, 0);
        }
      } else {
        if (query?.brand) {
          if (query?.model) {
            this.searchPattern = [query.brand, query.model, ...this.searchPattern];
            this.currentStep = 1;
            await this.fetchDataFromES();
            if (!this.loadingError) {
              this.currentStep = 2;
            }
          } else {
            this.searchPattern = [query.brand, ...this.searchPattern];
            this.currentStep = 0;
            await this.fetchDataFromES();
            if (!this.loadingError) {
              this.currentStep = 1;
            }
          }
        }
      }

      this.newVinError = this.modalData.payload.hasError;
    }
  },
  watch: {
    async isVisible (val) {
      if (val) {
        await this.setup();
      }
    }
  },
  async created () {
    await this.setup();
  }
};
</script>

<style lang="scss">
.om-selector-modal {
  .sf-modal__close {
    display: none;
  }

  .sf-modal__content {
    padding: 0;

    .sf-bar {
      width: 100%;
      height: auto;
      padding: 10px;

      & > div:nth-child(2) {
        width: 100% !important;
      }
    }
  }

  .sf-steps {
    &__title {
      font-size: 12px;
    }
  }

  &__new-vehicle {
    text-align: left;

    .new-vehicle {
      margin-left: 12px;
    }
  }

  &__wrapper {
    position: relative;
    text-align: center;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__header {
    width: 100%;

    &-title {
      margin: 0;
      text-align: center;
      padding: 10px 0;
      margin-bottom: 10px;
      font-weight: 500;
      font-family: var(--font-family-secondary);
    }

    &-subtitle {
      font-size: 12px;
      font-weight: 400;
      text-align: center;
    }

    .vuejs-progress-bar {
      width: 100%;

      svg {
        width: 100% !important;
      }
    }
  }

  &__content {
    min-height: 45vh;
    max-height: 45vh;
    overflow: auto;

    &-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 15px;
      i {
        font-size: 30px;
      }

      .sf-image {
        width: 170px;
        margin-right: 5px;
      }

      .title {
        font-weight: bold;
        font-size: 16px;
      }

      .description {
        font-size: 14px;
        color: gray;
      }
    }

    .sf-loader {
      height: inherit;
      position: relative;
      min-height: inherit;
    }

    &.with-progressbar {
      margin-top: 78px !important;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .sf-button {
      padding: 13px 25px;
      margin: 0 10px;
    }
  }

  .new-vin-wrapper__error {
    color: red;
  }
}
</style>