<template>
  <div class="af-tyre-finder">
    <div class="my-tyre" v-if="shouldShowVehicleCard">
      <span class="my-tyre__header">Your Tire Size</span>
      <div class="my-tyre__container">
      <div class="my-tyre__icon">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="50" height="50"
viewBox="0 0 50 50"
style=" fill:orange;">    <path d="M 25 2 C 12.318 2 2 12.318 2 25 C 2 37.682 12.318 48 25 48 C 37.682 48 48 37.682 48 25 C 48 12.318 37.682 2 25 2 z M 24.998047 9 C 25.299824 9 25.594873 9.0283545 25.892578 9.0449219 C 25.867808 9.1408872 25.842172 9.2375964 25.847656 9.3417969 L 26.3125 18.449219 C 26.3345 18.856219 26.599422 19.20975 26.982422 19.34375 C 27.691422 19.59175 28.337297 19.963219 28.904297 20.449219 C 29.090297 20.608219 29.320688 20.691406 29.554688 20.691406 C 29.718688 20.691406 29.883203 20.650359 30.033203 20.568359 L 38.117188 16.167969 C 38.172517 16.137851 38.208677 16.089158 38.255859 16.050781 C 38.600697 16.559872 38.907898 17.094152 39.193359 17.642578 C 39.053736 17.664249 38.916031 17.710851 38.791016 17.794922 L 31.308594 22.800781 C 30.972594 23.025781 30.806766 23.429172 30.884766 23.826172 C 30.961766 24.215172 31 24.611 31 25 C 31 25.389 30.960813 25.784828 30.882812 26.173828 C 30.803812 26.569828 30.970688 26.972266 31.304688 27.197266 L 38.927734 32.328125 C 38.99973 32.376543 39.075808 32.40998 39.154297 32.4375 C 38.870539 32.975317 38.561756 33.49653 38.220703 33.996094 C 38.158522 33.936248 38.100732 33.871678 38.021484 33.828125 L 33.730469 31.466797 C 33.664469 31.426797 33.601297 31.380422 33.529297 31.357422 L 30.035156 29.433594 C 29.670156 29.231594 29.218344 29.279781 28.902344 29.550781 C 28.335344 30.036781 27.689469 30.410203 26.980469 30.658203 C 26.597469 30.792203 26.3325 31.144781 26.3125 31.550781 L 25.847656 40.615234 C 25.841626 40.734121 25.865782 40.847458 25.898438 40.955078 C 25.598815 40.971861 25.301796 41 24.998047 41 C 24.694628 41 24.398906 40.971829 24.099609 40.955078 C 24.131696 40.849416 24.155676 40.739529 24.150391 40.623047 L 23.742188 31.578125 C 23.724187 31.165125 23.456406 30.806828 23.066406 30.673828 C 22.324406 30.421828 21.646734 30.029766 21.052734 29.509766 C 20.738734 29.234766 20.286922 29.183813 19.919922 29.382812 L 11.697266 33.875 C 11.355136 33.363741 11.050081 32.827746 10.767578 32.277344 C 10.90933 32.256613 11.050099 32.215949 11.177734 32.130859 L 18.679688 27.128906 C 19.012687 26.905906 19.181422 26.505328 19.107422 26.111328 C 19.035422 25.730328 19 25.357 19 25 C 19 24.643 19.035422 24.269672 19.107422 23.888672 C 19.181422 23.494672 19.013687 23.094094 18.679688 22.871094 L 11.177734 17.876953 C 11.050413 17.792257 10.909474 17.745504 10.767578 17.724609 C 11.065466 17.144075 11.385922 16.577873 11.75 16.041016 C 11.838923 16.185323 11.951355 16.316103 12.111328 16.402344 L 19.921875 20.615234 C 20.070875 20.696234 20.234484 20.736328 20.396484 20.736328 C 20.633484 20.736328 20.867688 20.652281 21.054688 20.488281 C 21.647687 19.968281 22.324406 19.577219 23.066406 19.324219 C 23.455406 19.191219 23.724187 18.832875 23.742188 18.421875 L 24.152344 9.3359375 C 24.156977 9.2336369 24.131756 9.1391112 24.107422 9.0449219 C 24.404159 9.0284586 24.69726 9 24.998047 9 z M 22.152344 9.2675781 L 21.96875 13.390625 C 19.90775 13.925625 18.048297 14.993719 16.529297 16.511719 L 13.0625 14.640625 C 13.002898 14.608569 12.939145 14.603074 12.876953 14.583984 C 15.223455 11.856725 18.469082 9.9325147 22.152344 9.2675781 z M 27.847656 9.2695312 C 31.483771 9.9267197 34.690008 11.812101 37.029297 14.484375 L 33.412109 16.451172 C 31.923109 14.988172 30.067594 13.931391 28.058594 13.400391 L 27.847656 9.2695312 z M 39.964844 19.392578 C 40.622249 21.140718 41 23.024823 41 25 C 41 26.977996 40.622085 28.865013 39.962891 30.615234 L 36.529297 28.302734 C 36.835297 27.232734 37 26.126 37 25 C 37 23.878 36.839156 22.776938 36.535156 21.710938 L 39.902344 19.455078 C 39.927844 19.438023 39.941434 19.41149 39.964844 19.392578 z M 10.003906 19.476562 C 10.027992 19.496072 10.042063 19.523484 10.068359 19.541016 L 13.441406 21.787109 C 13.152406 22.829109 13 23.906 13 25 C 13 26.095 13.155312 27.171844 13.445312 28.214844 L 10.068359 30.466797 C 10.042859 30.483852 10.029275 30.51039 10.005859 30.529297 C 9.3672041 28.802932 9 26.945804 9 25 C 9 23.056369 9.3666108 21.20131 10.003906 19.476562 z M 25 21 C 22.794 21 21 22.794 21 25 C 21 27.206 22.794 29 25 29 C 27.206 29 29 27.206 29 25 C 29 22.794 27.206 21 25 21 z M 25 23 C 26.103 23 27 23.897 27 25 C 27 26.103 26.103 27 25 27 C 23.897 27 23 26.103 23 25 C 23 23.897 23.897 23 25 23 z M 16.523438 33.486328 C 18.029438 34.987328 19.917797 36.069469 21.966797 36.605469 L 22.152344 40.712891 C 22.152653 40.719798 22.155802 40.725554 22.15625 40.732422 C 18.498798 40.073058 15.274794 38.170748 12.931641 35.474609 L 16.523438 33.486328 z M 33.396484 33.564453 L 37 35.548828 C 34.661929 38.204959 31.465244 40.078951 27.841797 40.732422 C 27.842126 40.72751 27.845444 40.723682 27.845703 40.71875 L 28.056641 36.599609 C 30.058641 36.070609 31.910484 35.018453 33.396484 33.564453 z"></path></svg>
      </div>
      <span>{{ activeVehicle.national_code }}</span>
      <SfButton class="om-btn--primary btn--full-width" @click="showTireSearch">
        Start New Search</SfButton>
    </div>
    </div>
    <div class="container" v-else>
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
              class="om-btn--primary btn--full-width"
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
              <option value="" disabled selected hidden>
                Select {{ selectorName }}
              </option>
              <option
                v-for="label in options.size[selectorName]"
                :value="label"
                :key="label"
              >
                {{ label }}
              </option>
            </select>
            <SfButton
              class="om-btn--primary btn--full-width"
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
import { SfTabs, SfButton } from "@storefront-ui/vue";
import axios from "axios";
import config from "config";
import { mapGetters } from "vuex";

export default {
  name: "OmTyreFinder",
  components: { SfTabs, SfButton },
  data() {
    return {
      isTireSearch: false,
      makeOptions: [],
      widthOptions: [],
      options: {
        vehicle: {
          make: [],
          model: [],
          tire_size: [],
        },
        size: {
          width: [],
          rim: [],
          profile: [],
        },
      },
      models: {
        vehicle: {
          make: "",
          model: "",
          tire_size: "",
        },
        size: {
          width: "",
          rim: "",
          profile: "",
        },
      }
    };
  },
  computed: {
    ...mapGetters({
      activeVehicle: "vehicles/activeVehicle",
      getCurrentCategory: "category-next/getCurrentCategory",
    }),
    shouldShowVehicleCard() {
      let existsNationCode = false;
      if (this.activeVehicle && this.activeVehicle.national_code)
        existsNationCode = true;

      let isFullWidth = false;
      if (
        this.getCurrentCategory &&
        this.getCurrentCategory?.page_layout === "category-full-width"
      )
        isFullWidth = true;

      return !!existsNationCode;
    },
    disableVehicleGoButton() {
      return Object.keys(this.models["vehicle"]).some(
        (key) => this.models["vehicle"][key] === null
      );
    },
    disableSizeGoButton() {
      return Object.keys(this.models["size"]).some(
        (key) => this.models["size"][key] === null
      );
    },
  },
  methods: {
    showTireSearch() {
      this.$store.dispatch("vehicles/saveActiveVehicle", {});
    },
    async changeSelector(type, keyIndex) {
      if (type === "vehicle") {
        if (keyIndex < 2) {
          const allKeys = Object.keys(this.models.vehicle);
          const key = allKeys[keyIndex + 1];
          const url = `${config.api.url}/api/ext/alfardan/vehicle-finder/options/${key}`;
          for (let i = keyIndex + 1; i <= 2; i++) {
            // this.models.vehicle[allKeys[i]] = [];
          }
          const payload = allKeys.reduce((result, key) => {
            if (this.models.vehicle[key]) {
              result = { ...result, [key]: this.models.vehicle[key] };
            }

            return result;
          }, {});

          const {
            data: { code, result },
          } = await axios.post(url, payload);
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
            // this.models.size[allKeys[i]] = [];
          }
          const payload = allKeys.reduce((result, key) => {
            if (this.models.size[key]) {
              result = { ...result, [key]: this.models.size[key] };
            }

            return result;
          }, {});

          const {
            data: { code, result },
          } = await axios.post(url, payload);
          if (code === 200) {
            this.options.size[key] = result;
            if (keyIndex === 0) {
              this.options.size[allKeys[2]] = [];
            }
          }
        }
      }
    },
    async fetchNationalCode(type) {
      const urlType = type === "vehicle" ? "vehicle-finder" : "tire-size";
      const url = `${config.api.url}/api/ext/alfardan/${urlType}/national-code`;

      const {
        data: { code, result },
      } = await axios.post(url, this.models[type]);
      if (code === 200) {
        this.$store.dispatch("vehicles/saveActiveVehicle", result);
        this.$router.push("/tires");
        this.options = {
          vehicle: {
            make: this.makeOptions,
            model: [],
            tire_size: [],
          },
          size: {
            width: this.widthOptions,
            rim: [],
            profile: [],
          },
        };
        this.models = {
          vehicle: {
            make: "",
            model: "",
            tire_size: "",
          },
          size: {
            width: "",
            rim: "",
            profile: "",
          },
        };
      }
    },
  },
  async mounted() {
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
  },
};
</script>

<style lang="scss">
.af-tyre-finder {
  max-width: 1200px;
  margin: auto;

  .my-tyre {
    background-color: white;
    margin: 0 15px;
    box-shadow: #d6d5d5 0px 1px 3px 0px;
    border-radius: 8px;
    overflow: hidden;
    &__header{
    padding: 15px 10px;
    background: #ddd;
    font-weight: 700;
    display: block;
    }
    &__container{
      padding: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    &__button {
      flex: 1;
      height: 54px;
      border-radius: 4px;
      background-color: orange;
      margin-top: 20px;
      font-size: 15px !important;
      font-weight: 700;
      font-family: var(--font-family-bold);
    }
  }

  .container {
    margin: 0 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    .sf-tabs {
      width: 100%;
      box-shadow: #d6d5d5 0px 1px 3px 0px;
      border-radius: 8px;
      overflow: hidden;
      &__title {
        padding: 20px;
        background: orange;
        border: none;
        color: #fff;
        flex: 1;
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
      flex-wrap: wrap;
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
