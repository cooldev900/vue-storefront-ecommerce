<template>
  <div class="om-enquiry-modal">
    <SfModal :visible="isVisible" @close="$emit('close', modalData.name)">
            <h3>Contact Us</h3>
      <OmContactForm />
    </SfModal>
  </div>
</template>
<script>
import OmContactForm from 'theme/components/omni/om-contact-form.vue';
import { SfModal } from '@storefront-ui/vue';

export default {
  name: 'OmContactModal',
  components: {
    OmContactForm,
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
