<template>
  <div class="appointment-selector">
    <div class="schedule-navigator">
      <div class="schedule-navigator__button" @click="prevWeek">
        <--
      </div>
      <div>{{ schedulePeriod }}</div>
      <div class="schedule-navigator__button" @click="nextWeek">
        -->
      </div>
    </div>
    <div class="schedule-day-selector">
      <div class="schedule-day-selector__button" :class=" isHoliday(date.payload) ? 'disabled' : (today === date.payload ? 'selected' : '') " :key="date.date" v-for="date in weeks[0].days" @click="getAppointment(date.payload)">
        <div class="schedule-day-selector__button--day">{{$t(date.day)}}</div>
        <div class="schedule-day-selector__button--date">{{date.date}}</div>
      </div>
    </div>
    <div class="slots">
      <div class="anytime">
        <OmRadio :key="index" :appointment="appointment" v-for="(appointment, index) in appointmentsData" :availableStartTime="availableStartTime"/>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import OmRadio from 'theme/components/omni/om-round-checkbox.vue';
import { mapGetters, mapActions } from 'vuex';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  components: { OmRadio },
  props: {
    value: Object,
    appointmentsTaken: {
      type: Array,
      default: () => []
    },
    intervals: {
      type: Array,
      required: true
    },
    minWeeks: {
      type: Number,
      default: 1
    },
    nonWorkingDays: {
      type: Array,
      default: () => [0, 5]
    },
    appointmentDuration: {
      type: Number,
      default: 30
    },
    scheduleLabel: {
      type: String,
      default: 'No schedule has been selected'
    },
    relationLabel: {
      type: String,
      default: 'Hour / Day'
    },
    period: {
      type: Number,
      default: 5
    },
    availableStartTime: {
      type: Number,
      default: 24
    }
  },
  computed: {
    ...mapGetters({
      appointments: 'vehicles/getAppointmentsTaken',
      today: 'vehicles/getCurrentDay',
      getSlotData: 'vehicles/getSlotData',
      stepData: 'vehicles/stepData',
    }),
    selectedSchedule () {
      if (!this.selected.start || !this.selected.end) return this.scheduleLabel;

      let start = dayjs(this.selected.start);
      let end = dayjs(this.selected.end);

      return `${start.format('ddd DD, MMMM')} ${start.format(
        'HH:mm'
      )} - ${end.format('HH:mm')}`;
    },
    schedulePeriod () {
      if (currentStoreView().storeId === 3) 
        dayjs.locale('ar-SY');
      else 
        dayjs.locale('en-US');
      const from = dayjs(this.weeks[0].week[0].schedule[0].start).format(
        'dddd DD, MMM'
      );

      const to = dayjs(
        this.weeks[0].week[0].schedule[this.period - 1].start
      ).format('dddd DD');

      return `${from} - ${to}`;
    },
    appointmentsData () {
      let today = new Date();
      return this.appointments.filter(appointment => {
        // if (today.getDate() === new Date(appointment.start_time).getDate()) {
        //    return new Date(appointment.start_time).getHours() >= 12 && new Date(appointment.start_time).getHours() < 20
        // } else 
           return new Date(appointment.start_time).getHours() >= 8 && new Date(appointment.start_time).getHours() < 20
      })
    },
  },
  data () {
    return {
      weeks: [],
      selected: {},
      isAnotherPopUpDisplayed: false,
      days: [
         'SUN', 'MON', 'THU', 'WED', 'TUE', 'FRI', 'SAT' 
      ],
      value1: 'something'
    };
  },
  methods: {
    ...mapActions({
      fetchAppointmentTaken: 'vehicles/fetchAppointmentTaken',
      loadSlotID: 'vehicles/loadSlotID',
    }),
    isHoliday (date) {
      let day = new Date(date).getDay();
      if (day === 6 || day === 5) return true;
      return false;
    },
    async getAppointment (date) {
      if (this.isHoliday(date)) {
        let day = new Date(date).getDay();
        date = new Date(new Date(date).getTime() + (7 - day) * 24 * 60 * 60 * 1000).toISOString();        
      };
      if (this.today !== date) {
        this.$store.commit('vehicles/setCurrentDay', date);
        this.fetchAppointmentTaken(date);
      }
    },
    async nextWeek () {
      let newWeek = this.weeks.length
        ? dayjs(
          this.weeks[this.weeks.length - 1].week[0].schedule[this.period - 1]
            .end
        ).add(1, 'day')
        : dayjs();
      
      let weeks = [];
      let weekDays = [];
      for (let w = 0; w <= this.period - 1; w++) {
        let schedule = [];

        for (let workSchedule of this.intervals) {
          if (w === 0) {
            newWeek = newWeek
              .hour(workSchedule.from.hour)
              .minute(workSchedule.from.minute)
              .second(0);
          } else {
            newWeek = newWeek
              .add(1, 'day')
              .hour(workSchedule.from.hour)
              .minute(workSchedule.from.minute)
              .second(0);
          }
          let currentSchedule = true;

          while (currentSchedule) {
            let start = newWeek.format('YYYY-MM-DD HH:mm:ss');
            newWeek = newWeek.add(this.appointmentDuration, 'minute');
            let end = newWeek.format('YYYY-MM-DD HH:mm:ss');

            schedule.push({ start, end });
            if (
              newWeek.hour() === workSchedule.to.hour &&
              newWeek.minute() === workSchedule.to.minute
            ) { currentSchedule = false; }
          }
        }
        weekDays.push({date: newWeek.date(), day: this.days[newWeek.day()], payload: new Date(newWeek.$d.toISOString().split('T')[0]).toISOString()});
        weeks.push(schedule);
      }

      let schedule = {
        days: [],
        week: []
      };
      for (let s = 0; s < weeks[0].length; s++) {
        let week = [];
        for (let w = 0; w <= this.period - 1; w++) {
          week.push(weeks[w][s]);
        }
        schedule.week.push({
          label: `${weeks[0][s].start
            .split(' ')[1]
            .substring(-3, 5)} - ${weeks[0][s].end
            .split(' ')[1]
            .substring(-3, 5)}`,
          schedule: week
        });
      }
      schedule.days = weekDays;
      this.weeks = [schedule];      
      await this.getAppointment(weekDays[0].payload);
    },
    async prevWeek () {
      let firstDay = new Date(new Date().toISOString().split('T')[0]).toISOString();
      if (this.weeks.length)
        firstDay = this.weeks[0].days[0].payload;
      if ( new Date(firstDay).getTime() <= new Date(new Date(new Date().toISOString().split('T')[0]).toISOString()).getTime()) return;
      let newWeek = this.weeks.length
        ? dayjs(this.weeks[this.weeks.length - 1].week[0].schedule[0].end).add(
          -this.period,
          'day'
        )
        : dayjs();
      // const startDayOfWeek = newWeek.day();

      let weeks = [];
      let weekDays = [];
      for (let w = 0; w <= this.period - 1; w++) {
        let schedule = [];

        for (let workSchedule of this.intervals) {
          if (w === 0) {
            newWeek = newWeek
              .hour(workSchedule.from.hour)
              .minute(workSchedule.from.minute)
              .second(0);
          } else {
            newWeek = newWeek
              .add(1, 'day')
              .hour(workSchedule.from.hour)
              .minute(workSchedule.from.minute)
              .second(0);
          }
          let currentSchedule = true;

          while (currentSchedule) {
            let start = newWeek.format('YYYY-MM-DD HH:mm:ss');
            newWeek = newWeek.add(this.appointmentDuration, 'minute');
            let end = newWeek.format('YYYY-MM-DD HH:mm:ss');

            schedule.push({ start, end });
            if (
              newWeek.hour() === workSchedule.to.hour &&
              newWeek.minute() === workSchedule.to.minute
            ) { currentSchedule = false; }
          }
        }
        weekDays.push({date: newWeek.date(), day: this.days[newWeek.day()], payload: new Date(newWeek.$d.toISOString().split('T')[0]).toISOString()});
        weeks.push(schedule);
      }

      let schedule = {
        days: [],
        week: []
      };
      for (let s = 0; s < weeks[0].length; s++) {
        let week = [];
        for (let w = 0; w <= this.period - 1; w++) {
          week.push(weeks[w][s]);
        }
        schedule.week.push({
          label: `${weeks[0][s].start
            .split(' ')[1]
            .substring(-3, 5)} - ${weeks[0][s].end
            .split(' ')[1]
            .substring(-3, 5)}`,
          schedule: week
        });
      }
      schedule.days = weekDays;
      this.weeks = [schedule];
      await this.getAppointment(weekDays[0].payload);
    },
    setMeeting (meeting) {
      if (this.isDisabled(meeting) || this.isAnotherPopUpDisplayed) return;
      this.$store.dispatch("vehicles/saveSelectedTime", meeting);
      this.selected = meeting;
      this.$emit('input', this.selected);
    },
    isSelected (meeting) {
      return (
        this.selected.start === meeting.start &&
        this.selected.end === meeting.end
      );
    },
    isDisabled (meeting) {
      let start = dayjs(meeting.start);
      return this.nonWorkingDays.includes(start.day());
      // this.getAppointmentTaken(meeting.start, meeting.end) !== undefined
    },
    getAppointmentTaken (start, end) {
      return this.appointmentsTaken.find(
        appointment => appointment.start === start && appointment.end === end
      );
    },
    getDayLabel (index) {
      return dayjs(this.weeks[0].week[0].schedule[index].start).format('ddd');
    },
    initWeeks () {
      let min = this.minWeeks;
      do {
        this.nextWeek();
        min--;
      } while (min > 0);
    },
    async adjustWeek(today, targetDay ) {
      let delta = (new Date(targetDay).getTime() - new Date(today).getTime())/24/60/60/1000;
      console.log(delta, 'delta');
      if (delta < 0) {
        delta = -1 * delta;
        let min = Math.ceil(delta / 5);
        do {
            await this.prevWeek();
            min--;
          } while (min > 0);
      } else {
        if (delta >= 4) {
          let min = Math.floor(delta / 5);
          do {
            await this.nextWeek();
            min--;
          } while (min > 0);
        }
      }
    }
  },
  created () {
    this.initWeeks();
    this.selected = {
      start: this.value.start,
      end: this.value.end
    };
  },
  watch: {
    value: {
      handler (form) {
        this.selected = {
          start: form.start,
          end: form.end
        };
      },
      deep: true
    },
    async stepData(value) {
      if (value === 0) {
        if (this.getSlotData?.start_time) { 
          const date = new Date(this.getSlotData?.start_time.slice(0, 10)).toISOString();
          await this.adjustWeek(this.today, date);
          await this.getAppointment(date);
        }
      }
    }
  },

  async mounted () {
    let date = new Date(new Date().toISOString().split('T')[0]).toISOString();
    if (new Date().getDay() === 5 || new Date().getDay() === 6) {
      date = new Date(new Date(dayjs().add(7 - new Date().getDay(), 'day').toISOString()).toISOString().split('T')[0]).toISOString()
    }
    await this.$store.dispatch('vehicles/loadSlotID')
    await this.$store.dispatch('vehicles/loadSlotData')
    console.log(this.getSlotData, 'slot data');
    if (this.getSlotData?.start_time) {
      date = new Date(this.getSlotData.start_time.slice(0, 10)).toISOString();
      let days = Math.ceil((new Date(date).getTime() - new Date().getTime())/24/60/60/1000);
      if (days >= 4) {
        let min = Math.floor(days/5);
        do {
          this.nextWeek();
          min--;
        } while (min > 0);
      }
    }
    await this.getAppointment(date);
  }
};
</script>

<style lang="scss" scoped>
.appointment-selector {
  margin-bottom: 25px;
  .header {
    margin-bottom: 0.5em;

    &-handler-button {
      min-width: 2rem !important;
      width: 2rem !important;
      cursor: pointer;
    }
  }

  .schedule {
    /* overflow: auto; */

    &-navigator {
      display: flex;
      justify-content: space-between;
      padding: 1.5rem 2rem;

      &__button {
        cursor: pointer;
      }
    }

    table {
      width: 100%;
      text-align: center;
      position: relative;
      border-collapse: collapse;
      margin: -1px;

      tbody {
        tr {
          height: 3em;

          th {
            min-width: 7rem;
            width: 7em;
            position: sticky;
            top: 0;
            z-index: 9999;
          }

          td {
            div {
              width: 100%;
              height: 100%;
              border: none;
              position: relative;

              .info-label {
                position: absolute;
              }

              &.cell-available {
                cursor: pointer;
              }
            }
          }
        }

        th,
        td {
          height: 3em;
          padding: 0;
        }
      }
    }
  }
}

.appointment-selector {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;

.schedule-header {
  margin-top: 15px;
  margin-bottom: 15px;
}

.selected-schedule-label {
  font-style: italic;
}

.schedule {
}

.header-label {
  background-color: orange;
  font-size: 15px;
  text-align: center;
}

.relation-label {
  color: #0071c0;
}

.week-day-label {
  font-weight: normal;
}

.cell {
  /* border: 1px solid #797979; */
}

.cell-time {
  background-color: #d9d9db;
}

.cell-available {
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.cell-available:hover {
  background-color: #0071c0;
}

.cell-disabled {
  background-color: #9b9b9b;
}

.cell-selected {
  background-color: #40b0ff;
}

.info-icon {
  color: white;
}

/*
* Pop over styles
*/

.container:hover .pop-up,
.persist {
  max-width: 500px !important;
  max-height: 500px !important;
  border: 1px solid #0071c0;
  animation: show-info 0.3s ease;
}

.schedule-day-selector {
    display: flex;
    gap: 15px;
    justify-content: space-between;

    &__button {
    padding: 0;
    border: 1px solid gray;
    border-radius: 8px;
    font-size: 20px;
    text-align: center;
    width: 150px;
    height: 100px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    cursor: pointer;

      &--day {
        font-weight: 400;
      }

      &--date {
        font-weight: bold;
      }
    }
}

.selected {
  background-color: var(--c-primary);
  color: white;
  border: 1px solid transparent;
}
.disabled {
  background-color: #fff;
  color: black;
  opacity: 0.3;
  cursor: not-allowed;
}
}

@keyframes show-info {
  from {
    max-width: 0px;
    max-height: 0px;
    transform: translateX(-10px);
  }
  to {
    max-width: 500px;
    max-height: 500px;
    transform: translateX(0);
  }
}
</style>
