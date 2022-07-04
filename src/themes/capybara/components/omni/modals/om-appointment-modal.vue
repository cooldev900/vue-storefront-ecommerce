<template>
  <div class="om-appointment-modal">
    <SfModal :visible="isVisible" @close="closeModal" title="Your Appointment">
      <div class="om-appointment-modal__content">
        <h1>Your Appointment</h1>
        <P>{{$t('Unfortunately the appointment you selected was reserved. Please select a new slot that works for you.')}}</P>
        <OmAppointmentSelector
            v-model="schedule"
            :appointment-duration="120"
            :appointments-taken="appointmentsTaken"
            :intervals="intervals"
            :non-working-days="[0, 5]"
            :period="5"
        />
        <div class="actions">
            <SfButton @click="go">{{$t('continue')}}</SfButton>
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfIcon, SfButton, SfInput } from '@storefront-ui/vue';
import OmAppointmentSelector from 'theme/components/omni/om-appointment-selector.vue';
import dayjs from 'dayjs';

export default {
  name: 'OmAppointmentModal',
  components: { SfModal, SfIcon, SfButton, SfInput, OmAppointmentSelector },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: 'OmAppointmentModal',
        payload: {
          orderId: '',
        }
      }),
      required: true
    }
  },
  data () {
    return {
      saving: false,
      form: {},
      schedule: {
        start: dayjs()
          .add(1, 'day')
          .hour(14)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss'),
        end: dayjs()
          .add(1, 'day')
          .hour(16)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss')
      },
      minWeeks: 2,
      intervals: [
        {
          from: {
            hour: 8,
            minute: 0
          },
          to: {
            hour: 20,
            minute: 0
          }
        }
      ],
      appointmentsTaken: []
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    cancelOrder() {
      //cancel order operation
      this.closeModal();
    },
    async go() {
      try{
        await this.$store.dispatch('vehicles/setAppointment', this.modalData.payload.orderId);
        this.closeModal();
      } catch(e) {

      }
      
    },
  },
  async mounted () {
    
  }
};
</script>

<style lang="scss">
.om-appointment-modal {
  .sf-modal {
    --modal-width: 51.375rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
    padding-top: 0;

    .title {
      font-weight: bold;
      font-size: 14px;
    }

    .product-count {
      display: flex;
      gap: var(--spacer-xs);
      color: var(--c-primary);
    }

    .actions {
      display: flex;
      gap: var(--spacer-base);
      margin-top: var(--spacer-lg);
      justify-content: space-between;
    }

    .row {
      display: flex;
      gap: var(--spacer-sm);
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
