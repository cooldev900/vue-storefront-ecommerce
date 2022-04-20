<template>
  <div class="af-vehicle-finder">
    <div class="container">
      <!-- <SfTabs :open-tab="selectedTab"> -->
      <!-- <div title=""> -->
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
          <option value="" disabled selected hidden>
            Select {{ selectorName }}
          </option>
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
          @click="getProducts()"
        >
          {{ isModelSet ? "Start New Search" : "Find My Vehicle" }}
        </SfButton>
      </div>
      <!-- </div> -->
      <!-- </SfTabs> -->
    </div>
  </div>
</template>

<script>
import { SfTabs, SfButton } from '@storefront-ui/vue';
import axios from 'axios';
import config from 'config';
import { mapGetters, mapActions } from 'vuex';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import { SearchQuery } from 'storefront-query-builder';

export default {
  name: 'OmServiceFinder',
  components: { SfTabs, SfButton },
  props: {
    loading: Boolean
  },
  data () {
    return {
      makeOptions: [],
      widthOptions: [],
      options: {
        vehicle: {
          make: [],
          model: []
        }
      },
      car_size: '',
      models: {
        vehicle: {
          make: '',
          model: ''
        }
      },
      tire_size: '',
      car_size: ''
    };
  },
  computed: {
    ...mapGetters({
      activeVehicle: "vehicles/activeVehicle",
      serviceVehicle: "vehicles/serviceVehicle",
      getAttributeIdByLabel: 'vehicles/getAttributeIdByLabel'
    }),
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
    ...mapActions({
      saveServiceVehicle: 'vehicles/saveServiceVehicle',
      saveServiceVehicles: 'vehicles/saveServiceVehicles'
    }),
    async changeSelector (type, keyIndex) {
      console.log('changeSelector', type, 'type', keyIndex, 'keyIndex');
      if (type === 'vehicle') {
        if (keyIndex < 2) {
          const allKeys = Object.keys(this.models.vehicle);
          let key = allKeys[keyIndex + 1];
          if (keyIndex === 1) key = 'tire_size';
          const url = `${config.api.url}/api/ext/alfardan/vehicle-finder/options/${key}`;
          for (let i = keyIndex + 1; i <= 1; i++) {
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
            if (keyIndex === 1) {
              console.log(result, 'sizes');
              this.tire_size = result[0];
            } else {
              this.options.vehicle[key] = result;
            }
          }
        }
      }
    },
    watch: {
      serviceVehicle (value) {
        if (this.models.vehicle.equal(value)) this.models.vehicle = { ...value };
        this.getProducts();
      }
    },
    async getProducts () {
      this.$emit('update:loading', true);
      const url = `${config.api.url}/api/ext/alfardan/vehicle-finder/national-code`;
      const { data: { code, result } } = await axios.post(url, { ...this.models.vehicle });
      if (code === 200) {
        let { car_size } = result;
        this.car_size = car_size;
        const carSizeValue = this.getAttributeIdByLabel('car_size', car_size);

        let relatedProductsQuery = new SearchQuery();
        relatedProductsQuery = relatedProductsQuery
          .applyFilter({ key: 'category_ids', value: { 'in': [6] } })
          .applyFilter({ key: 'car_size', value: { 'in': carSizeValue } });
        const response = await this.$store.dispatch('product/findProducts', {
          query: relatedProductsQuery,
          size: 36,
          prefetchGroupProducts: false,
          updateState: false
        });

        if (response) {
          console.log(response.items, 'serviceVehicles');
          this.saveServiceVehicle({ ...this.models.vehicle, tire_size: this.tire_size, car_size: this.car_size });
          this.saveServiceVehicles(response.items);
        }

        this.$emit('update:loading', false);
      }
      this.$emit('update:loading', false);
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
    }

    let carSizeValue = '';
    if (this.activeVehicle?.car_size) {
      this.models.vehicle.make = this.activeVehicle.make;
      this.models.vehicle.model = this.activeVehicle.model;
      carSizeValue = this.getAttributeIdByLabel('car_size', this.activeVehicle.car_size);
    } else if (this.serviceVehicle?.car_size) {
      this.models.vehicle.make = this.serviceVehicle.make;
      this.models.vehicle.model = this.serviceVehicle.model;
      carSizeValue = this.serviceVehicle?.car_size
    }

    if (carSizeValue) {
      this.$emit('update:loading', true);
      let relatedProductsQuery = new SearchQuery();
      relatedProductsQuery = relatedProductsQuery
        .applyFilter({ key: 'category_ids', value: { 'in': [6] } })
        .applyFilter({ key: 'car_size', value: { 'in': carSizeValue } });
      const response = await this.$store.dispatch('product/findProducts', {
        query: relatedProductsQuery,
        size: 36,
        prefetchGroupProducts: false,
        updateState: false
      });

      if (response) {
        console.log(response.items, 'serviceVehicles');
        this.saveServiceVehicle({ ...this.models.vehicle, tire_size: this.tire_size, car_size: this.car_size });
        this.saveServiceVehicles(response.items);
      }
      this.$emit('update:loading', false);
    }
  }
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
      &__title {
        padding: 20px;
        background: orange;
        border: none;
        color: #fff;
        font-weight: 700;
        margin: 0;
        &--active {
          background: #fff;
          color: #333;
        }
      }
      &__content__tab {
        padding: 20px;
      }
    }
    .sf-tabs__title--active + .sf-tabs__content {
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
