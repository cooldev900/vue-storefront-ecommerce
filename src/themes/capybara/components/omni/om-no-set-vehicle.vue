<template>
  <div class="om-no-set-vehicle">
    <OmAlertBox
      type="warning"
    >
      <template #message>
        <div class="om-alert-box-message">
          <div>
            <b>We need to verify this fits your vehicle.</b>
          </div>
          <a @click.prevent="showSelectorModal()">Select Your Vehicle</a>
        </div>
      </template>
    </OmAlertBox>
  </div>
</template>

<script>
import OmAlertBox from 'theme/components/omni/om-alert-box';
import { mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals';

export default {
  name: 'OmNoSetVehicle',
  components: {
    OmAlertBox
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showSelectorModal () {
      this.openModal({
        name: ModalList.OmSelectorModal,
        payload: { dropdownKeys: [], enableAction: true }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .om-no-set-vehicle {
    margin-top: 20px;
    width: 100%;

    .om-alert-box-message {
      display: flex;
      flex-direction: column;
      a {
        text-decoration: underline;
        margin-top: 10px;
      }
    }
  }
</style>
