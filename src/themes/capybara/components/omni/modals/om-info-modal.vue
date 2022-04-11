<template>
  <div class="om-info-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfLoader :loading="loading">
        <div v-html="content"></div>
      </SfLoader>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfLoader } from '@storefront-ui/vue';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

export default {
  name: 'OmInfoModal',
  components: { SfModal, SfLoader },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: String,
        payload: {
          contentKey: String
        }
      }),
      required: true
    }
  },
  data () {
    return {
      content: null,
      loading: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    async fetchContent () {
      this.loading = true;
      const storeId = currentStoreView().storeId;
      const { data: { result } } = await axios.get(
        `${config.api.url}/api/storyblok/storyblok-1/info-modals/${this.modalData.payload.contentKey}`
      );

      this.content = result;
      this.loading = false;
    }
  },
  watch: {
    async isVisible (flag) {
      if (flag) {
        await this.fetchContent();
      }
    }
  },
  async created () {
    await this.fetchContent();
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-info-modal {
  .sf-modal__container {
    width: 900px;
    height: calc(100vh - 100px);
    border-radius: 10px;
    @include for-mobile {
      width: 100vw;
      height: 100vh;
    }

    .sf-modal__content {
      height: 100%;
    }
  }
}
</style>
