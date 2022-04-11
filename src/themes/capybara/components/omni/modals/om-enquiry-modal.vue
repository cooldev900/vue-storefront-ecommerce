<template>
  <div class="om-enquiry-modal">
    <SfModal :visible="isVisible" @close="$emit('close', modalData.name)">
      <OmEnquiryForm />
    </SfModal>
  </div>
</template>
<script>
import OmEnquiryForm from 'theme/components/omni/om-enquiry-form.vue';
import { SfModal } from '@storefront-ui/vue';

export default {
  name: 'OmEnquiryModal',
  components: {
    OmEnquiryForm,
    SfModal
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => {},
      required: false
    }
  }
}
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-enquiry-modal {
  .sf-modal {
    @include for-desktop {
      --modal-width: 59.375rem;
    }
  }
}
</style>
