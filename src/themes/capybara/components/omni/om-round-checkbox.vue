<template>
  <div class="slot" :class=" available ? '' : 'disabled'" @click="setAppointment">
    <label class="container">{{label}}
      <input type="checkbox" v-model="checked" :disabled="!available">
      <span class="checkmark"></span>
    </label>
    <div class="bookingStatus">{{bookingStatus}}</div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n'
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OmRadio',
  props: {
    appointment: {
      type: Object,
      default: {},
    },
    availableStartTime: {
      type: Number,
      default: 24
    }
  },
  data() {
    return {
      checked: false
    }
  },

  computed: {
    ...mapGetters({
      cartToken: 'cart/getCartToken',
      slot_id: 'vehicles/getSlotID',
      slot_data: 'vehicles/getSlotData'
    }),
    label () {
      let timePart = config.timePart;
      console.log(timePart, 'timePart')
      let pm = this.$t('pm');
      let am = this.$t('am');
      let start_time = new Date(this.appointment.start_time).getHours();
      let end_time = new Date(this.appointment.end_time).getHours();
      if (timePart === '12') {
        start_time = start_time === 24 ? '0: 00' : `${start_time}: 00`;
        end_time = end_time === 24 ? '0: 00' : `${end_time}: 00`;
      } else {
        start_time = start_time === 12 ? '12 pm' : start_time > 12 ? (`${start_time - 12} ${pm}`) : `${start_time} ${am}`;
        end_time = end_time === 12 ? '12 pm' : end_time > 12 ? (`${end_time - 12} ${pm}`) : `${end_time} ${am}`;
      }
      
      return `${start_time} - ${end_time}`;
    },

    available () {
      let availableStartTime = config.availableStartTime;
      if (!availableStartTime) availableStartTime = this.availableStartTime;
      console.log(availableStartTime, 'available start time')
      let tomorrow = new Date().getTime() + availableStartTime * 3600 * 1000;
      let startTime = new Date(this.appointment.start_time).getTime();
      return !!this.appointment?.available && startTime > tomorrow;
    },

    bookingStatus() {
      if (!this.available) return this.$t('Unavailable');
      if (this.checked) return this.$t('Selected');
      return this.$t('Available');
    }
  },

  methods: {
    setAppointment () {
      let payload = {...this.appointment};
      // console.log(currentStoreView().storeId, 'storeId');
      // this.checked = !this.checked;
      payload.booked_online = true;
      payload.internal_booking = false;
      payload.client_id = config.clientIds[currentStoreView().storeId];
      payload.order_id = this.cartToken;
      // if (this.checked) this.$store.dispatch('vehicles/setAppointment', payload);
      // else this.$store.dispatch('vehicles/deleteAppointment', payload);
      let slot_id = this.appointment.id;
      // let slot_data = this.slot_data;
      // if (!this.checked) {
      //   slot_id.push(this.appointment.id);
      //   slot_data.push(this.appointment);
      // } else {
      //   slot_id = slot_id.filter(id => id !== this.appointment.id);
      //   slot_data = slot_data.filter(data => data.id !== this.appointment.id);
      // }
      this.$store.commit('vehicles/setSlotID', slot_id);
      this.$store.commit('vehicles/setSlotData', payload);
    }
  },

  watch: {
    // checked (value) {
    //   console.log(value, 'checked');
    //   let payload = {...this.appointment};
    //   payload.booked_online = true;
    //   payload.internal_booking = false;
    //   payload.client_id = config.clientIds[currentStoreView().storeId];
    //   payload.orderid = this.cartToken;
    //   console.log(payload, 'appointment payload');
    //   this.$store.dispatch('vehicles/setAppointment', payload);
    // },

    appointment: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {        
          // this.checked = this.slot_id.includes(newValue.id);
          this.checked = this.slot_id === newValue.id;
      }
    },

    slot_id(newValue) {
      // this.checked = newValue.includes(this.appointment.id);
      this.checked = newValue === this.appointment.id;
    }
  }
};
</script>
<style lang="scss">

.slot {
    align-items: center;
    padding: 15px;
    border-radius: 5px;
    background-color: #eee;
    border: 1px solid #fff;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    .bookingStatus {
      font-size: 15px;
      font-weight: bold;
    }
  &:hover{
    border: 1px solid #ccc;
  }
}

.disabled {
  background-color: gray;
  cursor: move;

  .container {
    cursor: inherit;
    input, span {
      cursor: inherit;
    }
  }
}

.container {
  display: block;
  position: relative;
  padding-left: 40px;
  cursor: pointer;
  font-size: 15px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 15px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: rgb(255, 165, 0);
  border: 1px solid rgb(255, 165, 0);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
