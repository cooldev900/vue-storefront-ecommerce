<template>
  <div class="m-modal-authentication">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <MLogin v-if="modalData.payload === 'login'" />
        <MRegister v-if="modalData.payload === 'register'" />
        <MResetPassword v-if="modalData.payload === 'forgot-pass'" />
        <MForgotPassword v-if="modalData.payload === 'forgot-reset'" />
      </transition>
    </SfModal>
  </div>
</template>

<script>
import SfModal from './m-modal-no-focusing.vue';
import MLogin from 'theme/components/molecules/m-login'
import MRegister from 'theme/components/molecules/m-register'
import MResetPassword from 'theme/components/molecules/m-reset-password'
import MForgotPassword from 'theme/components/molecules/m-forgot-password'

export default {
  name: 'MModalAuthentication',
  components: { SfModal, MLogin, MRegister, MResetPassword, MForgotPassword },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>
