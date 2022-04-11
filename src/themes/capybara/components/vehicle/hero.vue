<template>
  <div class="vehicle-hero">
    <div class="vehicle-hero__info">
      <div class="vehicle-hero__info-link">
        <span>Activate Vehicle</span>
        <span><a @click="changeVehicle($event)" class="change-vehicle">Change My Vehicle</a></span>
      </div>
      <h1>Your {{ brand }}</h1>
      <p class="vehicle-hero__info-description">
        {{ description }}
      </p>
      <NewVehicle
        v-if="regCode"
        :show-go-button="false"
        :disable-input="true"
        :inital-value="regCode"
        class="vehicle-hero__register"
      />
      <a><p class="vehicle-hero__info-item">Shop {{ brand }} Accessories</p></a>
      <a><p class="vehicle-hero__info-item">Shop {{ brand }} Parts</p></a>
      <a><p class="vehicle-hero__info-item">Service Plans</p></a>

      <OmVehicleTooltips />
    </div>
    <div class="vehicle-hero__image">
      <img src="https://prod-suzuki.azureedge.net/media/18286/501-v2-small.jpg?anchor=center&mode=crop&width=710&format=webp&quality=80&rnd=132683324400000000"/>

    </div>
  </div>
</template>

<script>
import NewVehicle from 'theme/components/omni/om-hero/new-vehicle.vue';
import OmVehicleTooltips from 'theme/components/omni/om-vehicle/om-vehicle-tooltips.vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { SfImage } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';

export default {
  name: 'VehicleHero',
  components: {
    NewVehicle,
    SfImage,
    SvgViewer,
    OmVehicleTooltips
  },
  data () {
    return {
      vehicle: {}
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode'
    }),
    description () {
      return `${this.vehicle?.level1 || ''} ${this.vehicle?.level2 ||
        ''} ${this.vehicle?.level5 || ''} ${this.vehicle?.level6 ||
        ''} ${this.vehicle?.level7 || ''} ${this.vehicle?.level3 ||
        ''}`;
    },
    brand () {
      return this.vehicle?.level1 || '';
    },
    nationalCode () {
      return this.$route.params.nationalCode;
    },
    regCode () {
      if (this.vehicle?.reg) {
        return this.vehicle?.reg;
      } else {
        return null;
      }
    }
  },
  methods: {
    changeVehicle (e) {
      e.preventDefault();

      console.log(this.nationalCode);
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler () {
        this.vehicle = this.getVehicleByNationalCode(this.nationalCode)
      }
    },
    activeVehicle () {
      this.vehicle = this.getVehicleByNationalCode(this.nationalCode)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.vehicle-hero {
  // color: red;
  border: 1px solid #e4e4e4;
  display: grid;
  grid-template-columns: 1fr 1fr;

  &__info {
    display: flex;
    flex-direction: column;
    padding: 40px;
    background: #e7e7ff;

    &-link {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .change-vehicle {
        color: #5959f7;
      }
    }

    h1 {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    &-description {
      margin-top: 0px;
      margin-bottom: 20px;
      font-size: 18px;
    }

    &-item {
      margin-top: 5px;
      margin-bottom: 5px;
      border: 1px solid #b3b3b3;
      padding: 5px;
    }
  }

  &__image {
    padding: 0 20px;

    img {
      width: 100%;
    }
  }

  &__register {
    margin-bottom: 24px;
  }
}
</style>
