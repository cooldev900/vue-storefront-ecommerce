<template>
    <SfModal :visible="isVisible" @close="closeModal" class="om-info-modal-1">
      <SfHeading
        :title="$t('Order Payload Errors')"
        :level="3"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div>
        <p v-for="error in errors">{{error}}</p>
      </div>
    </SfModal>
</template>

<script>
import { SfModal, SfIcon, SfButton,  SfHeading} from '@storefront-ui/vue';
import axios from 'axios';

export default {
  name: 'OmCheckoutModal',
  components: { SfModal, SfIcon, SfButton, SfHeading },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: []
    },
    modalData: {
      type: Object,
      default: () => {},
      required: false
    }
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    closeModal () {
      this.$emit('update', false)
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-info-modal-1 {
  .sf-modal__container {
    width: 600px;
    height: calc(100vh - 100px);
    border-radius: 10px;
    @include for-mobile{
      width: 100vw;
      height: 100vh;
    }
  }
}
</style>
