<template>
  <div class="af-vehicle-finder">
    <div class="container">
      <SfTabs :open-tab="1">
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
            <option value="" disabled selected hidden>Select {{selectorName}}</option>
              <option
                v-for="label in options.vehicle[selectorName]"
                :value="label"
                :key="label"
              >
                {{ label }}
              </option>
            </select>
            <SfButton
              :disabled="disableVehicleGoButton"
              @click="fetchNationalCode('vehicle')"
            >
              Go
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
            <option value="" disabled selected hidden>Select {{selectorName}}</option>
              <option
                v-for="label in options.size[selectorName]"
                :value="label"
                :key="label"
              >
                {{ label }}
              </option>
            </select>
            <SfButton
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
    disableVehicleGoButton () {
      return Object.keys(this.models['vehicle']).some(key => this.models['vehicle'][key] === null);
    },
    disableSizeGoButton () {
      return Object.keys(this.models['size']).some(key => this.models['size'][key] === null);
    }
  },
  methods: {
    async changeSelector (type, keyIndex) {
      if (type === 'vehicle') {
        if (keyIndex < 2) {
          const allKeys = Object.keys(this.models.vehicle);
          const key = allKeys[keyIndex + 1];
          const url = `${config.api.url}/api/ext/alfardan/vehicle-finder/options/${key}`;
          for (let i = keyIndex + 1; i <= 2; i++) {
            this.models.vehicle[allKeys[i]] = null;
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
            this.models.size[allKeys[i]] = null;
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
            make: null,
            model: null,
            tire_size: null
          },
          size: {
            width: null,
            rim: null,
            profile: null
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

    response = await axios.post(
      `${config.api.url}/api/ext/alfardan/tire-size/options/width`
    );
    if (response.data.code === 200) {
      this.options.size.width = response.data.result;
      this.widthOptions = response.data.result;
    }
  }
};
</script>

<style lang="scss">
.af-vehicle-finder {
  max-width: 1200px;
  margin: auto;

  .container {
    margin: var(--spacer-lg) 15px;
    display: flex;
    background: var(--c-primary);
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
