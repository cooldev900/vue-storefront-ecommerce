<template>
  <SfCallToAction class="om-hero" :image="newsletterImage">
    <template #description>
      <div class="sub-title">
        {{ subTitle }}
      </div>
      <div class="button-container">
        <div class="hero-selector-modal">
          <SfButton
            class="color-primary search-button"
            @click="showSelectorModal()"
          >
            <div class="search-button-content">
              SELECT YOUR CAR
            </div>
          </SfButton>
        </div>
      </div>
    </template>
    <template #title>
      <div class="title">
        {{ title }}
      </div>
    </template>
  </SfCallToAction>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { SfCallToAction, SfButton } from '@storefront-ui/vue';
import { checkWebpSupport } from 'theme/helpers';
import FilterSelect from './filter-select';
import vehicleData from 'theme/resource/vehicles.json';
import { getTopLevelCategories } from 'theme/helpers';
// import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import NewVehicle from './new-vehicle.vue';
import { ModalList } from 'theme/store/ui/modals';

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size',
  'Trim'
];

export default {
  name: 'OmHero',
  components: {
    SfCallToAction,
    SfButton,
    FilterSelect,
    NewVehicle
  },
  props: {
    storyblokKey: {
      type: String,
      default: 'home'
    }
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters('category', ['getCategories', 'getCurrentCategory']),
    ...mapGetters('vehicles', [
      'storyblok',
      'getAttributeIdByLabel',
      'storyblokContent'
    ]),
    newsletterImage () {
      const storyContentData = this.storyblokContent('hero', this.storyblokKey);
      if (storyContentData) {
        const imgUrl = storyContentData?.image?.filename
          ? storyContentData?.image?.filename
          : 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472';

        const webSupportedImage = checkWebpSupport([
          {
            image: {
              webp: imgUrl,
              fallback: imgUrl
            }
          }
        ]);

        return webSupportedImage[0].image;
      } else {
        return 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472';
      }
    },
    title () {
      return this.storyblokContent('hero', this.storyblokKey)
        ? this.storyblokContent('hero').Title
        : '';
    },
    subTitle () {
      return this.storyblokContent('hero', this.storyblokKey)
        ? this.storyblokContent('hero').Sub_title
        : '';
    },
    vehicles () {
      return vehicleData['vehicles'];
    },
    categories () {
      return getTopLevelCategories(this.getCategories);
    }
  },
  data () {
    return {
      initialSelectorData: [],
      selectorData: [],
      selectedItems: {},
      resultProducts: [],
      isVisible: false
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    ...mapMutations({
      saveVehicle: 'vehicles/saveVehicle'
    }),
    async onSearch () {
      const filteredVehicles = this.vehicles.find(data => {
        return Object.values(this.selectedItems).every(
          item => Object.values(data).indexOf(item) >= 0
        );
      });
      this.saveVehicle(filteredVehicles);
      this.$router.push({
        name: 'vehicle-svg',
        params: {
          nationalCode: filteredVehicles.national_code,
          visualGroup: '02'
        }
      })
    },
    toggleDropdown (kindIndex) {
      this.selectorData = this.selectorData.map((d, index) => {
        if (index === kindIndex) {
          d.showDropdown = !d.showDropdown;
        } else {
          d.showDropdown = false;
        }
        return d;
      });
    },
    hideDropdown () {
      this.selectorData.forEach(d => {
        d.showDropdown = false;
      });
    },
    getCurrentSelectorData (index, dropdownItems) {
      const newDropdownItems = Object.assign(dropdownItems);
      if (this.selectedItems[`level${index + 1}`]) {
        const filteredVehicles = this.vehicles.filter(data => {
          return Object.values(this.selectedItems).every(
            item => Object.values(data).indexOf(item) >= 0
          );
        });
        if (index + 2 <= dropdownKeys.length) {
          const nextDropdownItems = this.getLevelNDropdownItems(
            filteredVehicles,
            index + 2
          );
          this.selectorData[index + 1].items = nextDropdownItems;
        }
      }

      return newDropdownItems;
    },
    dropdownItemClick (data, index) {
      this.selectedItems[`level${index + 1}`] = data;
      for (let i = index + 1; i < dropdownKeys.length; i++) {
        delete this.selectedItems[`level${i + 1}`];
      }
    },
    getLevelNDropdownItems (source, level) {
      const dropdownItems = source.reduce((result, vehicle) => {
        if (!result.includes(vehicle[`level${level}`])) {
          result = [...result, vehicle[`level${level}`]];
        }
        return result;
      }, []);

      return dropdownItems;
    },
    disableSearch () {
      return Object.values(this.selectedItems).length !== dropdownKeys.length;
    },
    showSelectorModal () {
      this.openModal({
        name: ModalList.OmSelectorModal
      });
    }
  },
  mounted () {
    const level1DropdownItems = this.getLevelNDropdownItems(this.vehicles, 1);
    this.initialSelectorData = dropdownKeys.map((key, index) => {
      const result = {
        text: `Select ${key}`,
        showDropdown: false,
        items: []
      };
      if (index === 0) {
        result.items = level1DropdownItems;
      }
      return result;
    });

    /*
      {"text":"Select Brand","showDropdown":false,"items":["BMW","Nissan"]}
     */
    this.selectorData = this.initialSelectorData;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

 ::v-deep .sf-call-to-action__text-container{
    width: 600px !important;
    padding: 80px 40px;
    margin-top: 40px;
  }
.om-hero {
  margin: 0;
  position: relative;
  box-sizing: border-box;
  min-height: calc(100vh - var(--height-confidence-bar) - var(--height-header));
  background-position: center;
  display: flex;
.om-hero__overlay{
    background: linear-gradient(to left,rgba(255,255,255,0) 45%,rgba(0,0,0,.7) 100%);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
}
  @include for-desktop {
    margin: 0;
  }
  .title {
    color: #fff;
    font-weight: 400;
    order: 3;
    font-size: 18px;
    margin-top: 30px;
  }
  .button-container {
    margin-top: 30px;
    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      .select-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .hero-content-selector {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
        align-items: center;
      }
      .hero-content-selector::after {
        content: "";
        flex: auto;
      }
    }
    .hero-selector-modal {
      margin-top: 1rem;
    }
  }
  .search-button {
  border-radius: 0;
    height: 50px;
    color: #fff;
    background: #0c121c;
    border: 1px solid #0c121c;
    width: 400px;
    .search-button-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .sub-title {
    color: #fff;
    font-size: 38px;
    font-weight: 300;
    text-transform: uppercase;
  }
}
</style>
