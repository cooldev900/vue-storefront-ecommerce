<template>
  <div class="om-notification-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <slot />
    </SfModal>
  </div>
</template>

<script>
import { SfModal } from '@storefront-ui/vue';

export default {
  name: 'OmNotificationModal',
  components: { SfModal },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-notification-modal {
  .sf-modal__container {
    width: 600px;

    .sf-modal__content {
      margin-top: var(--spacer-lg) !important;
    }

    @include for-mobile{
      width: 100vw;
      height: 100vh;
    }
  }
}
</style>