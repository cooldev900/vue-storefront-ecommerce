<template>
  <div class="slot" :class=" available ? '' : 'disabled'">
    <label class="container">{{label}}
      <input type="checkbox" v-model="checked" @click="setAppointment" :disabled="!available">
      <span class="checkmark"></span>
    </label>
    <div class="bookingStatus">{{bookingStatus}}</div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n'

export default {
  name: 'OmRadio',
  props: {
    appointment: {
      type: Object,
      default: {},
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
      slot_id: 'vehicles/getSlotID'
    }),
    label () {
      let start_time = new Date(this.appointment.start_time).getHours();
      start_time = start_time > 12 ? (`${start_time - 12} pm`) : `${start_time} am`;
      let end_time = new Date(this.appointment.end_time).getHours();
      end_time = end_time > 12 ? (`${end_time - 12} pm`) : `${end_time} am`;
      return `${start_time} - ${end_time}`;
    },

    available () {
      let now = new Date();
      let tomorrow = new Date(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()).getTime() + 86400000;
      let startTime = new Date(this.appointment.start_time);
      return this.appointment?.available && tomorrow <= startTime.getTime() ? true : false;
    },

    bookingStatus() {
      if (!this.available) return 'Unavailable';
      if (this.checked) return 'Selected';
      if (this.available && !!this.appointment.technician_ids) return 'Booked';
      return 'Available';
    }
  },

  methods: {
    setAppointment () {
      // let payload = {...this.appointment};
      // console.log(currentStoreView().storeId, 'storeId');
      // this.checked = !this.checked;
      // payload.booked_online = true;
      // payload.internal_booking = false;
      // payload.client_id = config.clientIds[currentStoreView().storeId];
      // payload.order_id = this.cartToken;
      // console.log(payload, 'appointment payload');
      // if (this.checked) this.$store.dispatch('vehicles/setAppointment', payload);
      // else this.$store.dispatch('vehicles/deleteAppointment', payload);
      this.$store.commit('vehicles/setSlotID', this.appointment.id);
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
          this.checked = newValue.id === this.slot_id;        
      }
    },

    slot_id(newValue) {
      this.checked = newValue.id === this.appointment.id;
    }
  }
};
</script>
<style lang="scss">

.slot {
    border: 1px solid gray;
    align-items: center;
    padding: 15px;
    border-radius: 5px;
    background-color: #eee;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;

    .bookingStatus {
      font-size: 20px;
      font-weight: bold;
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
  font-size: 22px;
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
  top: 5px;
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
