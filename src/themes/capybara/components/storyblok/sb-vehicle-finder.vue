<template>
  <div class="af-vehicle-finder">
    <div class="container">
      <SfTabs :open-tab="selectedTab">
        <SfTab title="Tire By Vehicle">
          <div class="selector-wrapper">
            <select
              v-for="(selectorName, index) in Object.keys(options.vehicle)"
              :key="selectorName"
              :name="selectorName"
              :id="selectorName"
              :disabled="!options.vehicle[selectorName].length"
              @change="changeSelector('vehicle', index)"
              v-model="models['vehicle'][selectorName]"
            >
            <option value="" disabled selected hidden>Select {{changeText(selectorName)}}</option>
              <option
                v-for="label in options.vehicle[selectorName]"
                :value="label"
                :key="label"
              >
                {{ label }}
              </option>
            </select>
            <SfButton
              class="om-btn--primary"
              :disabled="disableVehicleGoButton"
              @click="fetchNationalCode('vehicle')"
            >
              {{ isModelSet ? 'Start New Search' :  'Find My Tires' }}
            </SfButton>
          </div>
        </SfTab>
        <SfTab title="By Tire Size">
          <div class="selector-wrapper">
            <select
              v-for="(selectorName, index) in Object.keys(options.size)"
              :key="selectorName"
              :name="selectorName"
              :id="selectorName"
              :disabled="!options.size[selectorName].length"
              @change="changeSelector('size', index)"
              v-model="models['size'][selectorName]"
            >
            <option value="" disabled selected hidden>Select {{changeText(selectorName)}}</option>
              <option
                v-for="label in options.size[selectorName]"
                :value="label"
                :key="label"
              >
                {{ label }}
              </option>
            </select>
            <SfButton
               class="om-btn--primary"
              :disabled="disableSizeGoButton"
              @click="fetchNationalCode('size')"
            >
              Go
            </SfButton>
          </div>
        </SfTab>
      </SfTabs>
    </div>
  </div>
</template>

<script>
import { SfTabs, SfButton } from '@storefront-ui/vue';
import axios from 'axios';
import config from 'config';
import { mapGetters } from 'vuex';

export default {
  name: 'SbVehicleFinder',
  components: { SfTabs, SfButton },
  data () {
    return {
      makeOptions: [],
      widthOptions: [],
      options: {
        vehicle: {
          make: [],
          model: [],
          tire_size: []
        },
        size: {
          width: [],
          rim: [],
          profile: []
        }
      },
      models: {
        vehicle: {
          make: '',
          model: '',
          tire_size: ''
        },
        size: {
          width: '',
          rim: '',
          profile: ''
        }
      }
    };
  },
  computed: {
    ...mapGetters({activeVehicle: 'vehicles/activeVehicle'}),
    disableVehicleGoButton () {
      return Object.keys(this.models['vehicle']).some(key => this.models['vehicle'][key] === null);
    },
    disableSizeGoButton () {
      return Object.keys(this.models['size']).some(key => this.models['size'][key] === null);
    },
    selectedTab () {
      return this.activeVehicle?.width ? 2 : 1;
    },
    isModelSet () {
      return this.activeVehicle && Object.keys(this.activeVehicle).length
    }
  },
  methods: {
    changeText(text) {
      console.log(text, 'text')
      let texts = text.split("_");
      let results = texts.map(text => text.charAt(0).toUpperCase() + text.slice(1));
      console.log(results, 'texts')
      return results.join(" ");
    },
    async changeSelector (type, keyIndex) {
      console.log('changeSelector', type, 'type', keyIndex, 'keyIndex');
      if (type === 'vehicle') {
        if (keyIndex < 2) {
          const allKeys = Object.keys(this.models.vehicle);
          const key = allKeys[keyIndex + 1];
          const url = `${config.api.url}/api/ext/alfardan/vehicle-finder/options/${key}`;
          for (let i = keyIndex + 1; i <= 2; i++) {
            // this.models.vehicle[allKeys[i]] = null;
          }
          const payload = allKeys.reduce((result, key) => {
            if (this.models.vehicle[key]) {
              result = { ...result, [key]: this.models.vehicle[key] }
            }

            return result;
          }, {});

          const { data: { code, result } } = await axios.post(url, payload);
          if (code === 200) {
            this.options.vehicle[key] = result;
            if (keyIndex === 0) {
              this.options.vehicle[allKeys[2]] = [];
            }
          }
        }
      } else {
        if (keyIndex < 2) {
          const allKeys = Object.keys(this.models.size);
          const key = allKeys[keyIndex + 1];
          const url = `${config.api.url}/api/ext/alfardan/tire-size/options/${key}`;
          for (let i = keyIndex + 1; i <= 2; i++) {
            // this.models.size[allKeys[i]] = null;
          }
          const payload = allKeys.reduce((result, key) => {
            if (this.models.size[key]) {
              result = { ...result, [key]: this.models.size[key] }
            }

            return result;
          }, {})

          const { data: { code, result } } = await axios.post(url, payload);
          if (code === 200) {
            this.options.size[key] = result;
            if (keyIndex === 0) {
              this.options.size[allKeys[2]] = [];
            }
          }
        }
      }
    },
    async fetchNationalCode (type) {
      const urlType = type === 'vehicle' ? 'vehicle-finder' : 'tire-size';
      const url = `${config.api.url}/api/ext/alfardan/${urlType}/national-code`;

      const { data: { code, result } } = await axios.post(url, this.models[type]);
      if (code === 200) {
        this.$store.dispatch('vehicles/saveActiveVehicle', result);
        this.$router.push('/tires');
        this.options = {
          vehicle: {
            make: this.makeOptions,
            model: [],
            tire_size: []
          },
          size: {
            width: this.widthOptions,
            rim: [],
            profile: []
          }
        };
        this.models = {
          vehicle: {
            make: '',
            model: '',
            tire_size: ''
          },
          size: {
            width: '',
            rim: '',
            profile: ''
          }
        }
      }
    }
  },
  async mounted () {
      let response = await axios.post(
        `${config.api.url}/api/ext/alfardan/vehicle-finder/options/make`
      );
      if (response.data.code === 200) {
        this.options.vehicle.make = response.data.result;
        this.makeOptions = response.data.result;
      }

      if (this.activeVehicle?.make) {
        this.models.vehicle.make = this.activeVehicle.make;
        await this.changeSelector('vehicle', 0);
        this.models.vehicle.model = this.activeVehicle.model;
        await this.changeSelector('vehicle', 1);
        this.models.vehicle.tire_size = this.activeVehicle.tire_size;
      }

      response = await axios.post(
        `${config.api.url}/api/ext/alfardan/tire-size/options/width`
      );
      if (response.data.code === 200) {
        this.options.size.width = response.data.result;
        this.widthOptions = response.data.result;
      }

      if (this.activeVehicle?.width) {
        this.models.size.width = this.activeVehicle.width;
        await this.changeSelector('size', 0);
        this.models.size.rim = this.activeVehicle.rim;
        await this.changeSelector('size', 1);
        this.models.size.profile = this.activeVehicle.profile;
      }           
  },
  // watch: {
  //   async activeVehicle (value) {
  //     console.log(value, 'activeVehicle');
  //     if (value?.make) {
  //       this.models.vehicle.make = value.make;
  //       await this.changeSelector('vehicle', 0);
  //       this.models.vehicle.model = value.model;
  //       await this.changeSelector('vehicle', 1);
  //       this.models.vehicle.tire_size = value.tire_size;
  //     }

  //     if (value?.width) {
  //       this.models.size.width = value.width;
  //       await this.changeSelector('size', 0);
  //       this.models.size.model = value.model;
  //       await this.changeSelector('size', 1);
  //       this.models.size.tire_size = value.tire_size;
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
.af-vehicle-finder {
  max-width: 1200px;
  margin-top: -63px !important;
  margin: auto;

  .container {
    margin: 0 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    .sf-tabs {
      width: 100%;
      &__title{
    padding: 20px;
    background: orange;
    border: none;
    color: #fff;
    font-weight: 700;
    margin: 0;
    &--active{
      background: #fff;
      color: #333;
    }
      }
    &__content__tab{
      padding: 20px;
    }
    }
.sf-tabs__title--active + .sf-tabs__content{
   --tabs-content-border-width: 0 0 0 0;
   background: #fff;
}
    .selector-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;

      select {
           /* Reset */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    /* Add some styling */

    display: block;
    width: 100%;
    height: 54px;
    float: right;
    padding: 0px 24px;
    border-radius: 8px;
    font-size: 16px;
    line-height: 1.75;
    color: #333;
    background-color: #ffffff;
    background-image: none;
    border: 1px solid #cccccc;
    -ms-word-break: normal;
    word-break: normal;
    /* Remove IE arrow */
    &::-ms-expand {
      display: none;
    }
      }
    }
  }
}
</style>
