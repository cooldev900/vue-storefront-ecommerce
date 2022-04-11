<template>
  <div class="om-selector-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <div class="om-selector-modal__wrapper">
          <div class="om-selector-modal__header">
            <SfBar
              :title="title"
              back
              close
              @click:back="onBackClick"
              @click:close="closeModal"
            >
              <template #title>
                <p class="om-selector-modal__header-title">
                  {{ title }}
                </p>
                <p class="om-selector-modal__header-subtitle">
                  You could select only a item.
                </p>
              </template>
            </SfBar>
            <progress-bar v-if="progressPercentage" :options="options" :value="progressPercentage" />
          </div>
          <div class="om-selector-modal__content" :class="{ 'with-progressbar': progressPercentage }">
            <div
              v-for="(vehicle, index) in currentVehicles"
              :key="vehicle.label"
              class="om-selector-modal__content-item"
            >
              <SfCheckbox
                v-model="vehicle.select"
                :name="vehicle.label"
                :label="vehicle.label"
                hint-message="Required."
                error-message="This field is not correct."
                valid
                @change="onSelectVehicle(index)"
              />
            </div>
          </div>
          <div class="om-selector-modal__footer">
            <!-- <SfButton class="sf-button--outline color-light" @click="goSkip()">
              Skip
            </SfButton> -->
            <SfButton
              class="color-primary"
              @click="goNext()"
              :disabled="disableNextButton"
            >
              {{ buttonLabel }}
            </SfButton>
          </div>
        </div>
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfBar, SfCheckbox, SfButton } from '@storefront-ui/vue';
import MLogin from 'theme/components/molecules/m-login';
import vehicleData from 'theme/resource/vehicles.json';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import ProgressBar from 'vuejs-progress-bar';
import { mapMutations } from 'vuex'

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size'
];

export default {
  name: 'OmSelectorModal',
  components: { SfModal, MLogin, SfBar, SfCheckbox, SfButton, ProgressBar },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        payload: {},
        name: 'modal'
      }),
      required: true
    }
  },
  data () {
    return {
      currentIndex: 1,
      currentVehicles: [],
      searchPattern: [],
      options: {
        text: {
          color: '#FFFFFF',
          shadowEnable: true,
          shadowColor: '#000000',
          fontSize: 14,
          fontFamily: 'Helvetica',
          dynamicPosition: false,
          hideText: false
        },
        progress: {
          color: '#2dbd2d',
          backgroundColor: '#333333',
          inverted: false
        },
        layout: {
          height: 25,
          verticalTextAlign: 61,
          horizontalTextAlign: 43,
          zeroOffset: 0,
          strokeWidth: 30,
          progressPadding: 0,
          type: 'line'
        }
      },
      progressPercentage: 0
    };
  },
  computed: {
    vehicles () {
      return vehicleData['vehicles'];
    },
    disableNextButton () {
      return !this.currentVehicles.some(vehicle => vehicle.select);
    },
    title () {
      return `Select ${dropdownKeys[this.currentIndex - 1]}`;
    },
    buttonLabel () {
      return this.currentIndex === dropdownKeys.length ? 'Search' : 'Next';
    }
  },
  watch: {
    isVisible: function () {
      this.currentIndex = 1;
      this.searchPattern = [];
      this.currentVehicles = this.getNLevelVehicles(this.currentIndex);
      this.progressPercentage = 0;
    },
    currentIndex: function (newVal, oldVal) {
      if (newVal > oldVal) {
        const currentLevelSelectedItem = this.currentVehicles.find(
          vehicle => vehicle.select
        );
        this.searchPattern[this.currentIndex - 2] =
          currentLevelSelectedItem.label;
        this.currentVehicles = this.getNLevelVehicles(this.currentIndex);
      } else {
        const searchPatternInstance = [...this.searchPattern];
        this.searchPattern.pop();

        this.currentVehicles = this.getNLevelVehicles(this.currentIndex);
        this.currentVehicles = this.currentVehicles.map(vehicle => {
          if (vehicle.label === searchPatternInstance[this.currentIndex - 1]) {
            return {
              label: vehicle.label,
              select: true
            };
          } else {
            return {
              label: vehicle.label,
              select: false
            };
          }
        });
      }
    }
  },
  methods: {
    ...mapMutations({
      setActiveVehicle: 'vehicles/setActiveVehicle',
      saveVehicle: 'vehicles/saveVehicle'
    }),
    async onSearch () {
      const filteredVehicles = this.vehicles.find(vehicle => {
        return this.searchPattern.every(item => {
          return Object.values(vehicle).indexOf(item) >= 0;
        });
      });

      if (filteredVehicles) {
        this.saveVehicle(filteredVehicles);
        this.setActiveVehicle(filteredVehicles);
        if (this.modalData?.payload.enableAction) {
          this.$router.push('/vehicle/' + filteredVehicles.national_code);
        }
        this.closeModal();
        this.currentVehicles = [];
      } else {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: 'Not found the correct National Code!'
          }),
          { root: true }
        );
      }
    },
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    onBackClick () {
      this.currentIndex =
        this.currentIndex === 1 ? this.currentIndex : --this.currentIndex;
    },
    // goSkip () {
    //   console.log('goSkip');
    //   this.currentIndex = ++this.currentIndex % dropdownKeys.length;
    // },
    async goNext () {
      if (this.currentIndex === dropdownKeys.length) {
        await this.onSearch();
      } else {
        ++this.currentIndex;
        this.progressPercentage = (Math.round(100 / dropdownKeys.length - 1) * (this.currentIndex - 1));
      }
    },
    getNLevelVehicles (level) {
      let currentStepVehicles = this.vehicles.filter(vehicle => {
        return this.searchPattern.every(item => {
          return Object.values(vehicle).indexOf(item) >= 0;
        });
      });
      currentStepVehicles = currentStepVehicles || this.vehicles;

      const currentStepItems = currentStepVehicles.reduce((result, vehicle) => {
        if (!result.includes(vehicle[`level${level}`])) {
          result = [...result, vehicle[`level${level}`]];
        }
        return result;
      }, []);

      return currentStepItems.map(item => ({
        label: item,
        select: false
      }));
    },
    onSelectVehicle (index) {
      this.currentVehicles = this.currentVehicles.map(vehicle => ({
        select: false,
        label: vehicle.label
      }));

      this.currentVehicles[index].select = true;
    }
  },
  mounted () {
    this.currentVehicles = this.getNLevelVehicles(this.currentIndex);
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
    }
  }

  &__wrapper {
    position: relative;
    overflow: hidden;
  }

  &__header {
    position: absolute;
    width: 100%;

    p {
      margin: 0;
      text-align: center;
    }

    &-subtitle {
      font-size: 12px;
      font-weight: 400;
    }

    .vuejs-progress-bar {
      width: 100%;

      svg {
        width: 100% !important;
      }
    }
  }

  &__content {
    padding: 20px;
    padding-top: 10px;
    min-height: 170px;
    max-height: 45vh;
    margin-top: 50px;
    overflow: auto;

    &-item {
      margin: 10px 0;
    }

    &.with-progressbar {
      margin-top: 78px !important;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    .sf-button {
      padding: 13px 25px;
      margin: 0 10px;
    }
  }
}
</style>
