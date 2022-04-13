<template>
  <div class="appointment-selector">
    <div class="schedule-navigator">
      <div class="schedule-navigator__button" @click="prevWeek">
        <
      </div>
      <div>{{ schedulePeriod }}</div>
      <div class="schedule-navigator__button" @click="nextWeek">
        >
      </div>
    </div>
    <div class="schedule">
      <table>
        <tbody v-for="(week, i) of weeks" :key="i">
          <tr>
            <th class="header-label relation-label">
              {{ relationLabel }}
            </th>
            <th
              v-for="(dayIndex, index) in new Array(period).fill(1)"
              :key="dayIndex + '_' + index"
              class="header-label week-day-label"
            >
              {{ `${getDayLabel(index)} ${week.days[index]}` }}
            </th>
          </tr>
          <tr v-for="(subWeek, j) of week.week" :key="j">
            <td class="cell cell-time">
              {{ subWeek.label }}
            </td>
            <td class="cell" v-for="(schedule, k) of subWeek.schedule" :key="k">
              <div
                :class="[
                  {
                    'cell-selected':
                      isSelected(schedule) ||
                      getAppointmentTaken(schedule.start, schedule.end)
                  },
                  isDisabled(schedule) ? 'cell-disabled' : 'cell-available'
                ]"
                :disabled="isDisabled(schedule)"
                @click="setMeeting(schedule)"
              >
                <div>{{ getCellLabel(schedule) }}</div>
                <div class="info-label">
                  <slot
                    name="info"
                    :schedule="schedule"
                    :appointment="
                      getAppointmentTaken(schedule.start, schedule.end)
                    "
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  components: {},
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
      default: 3
    }
  },
  computed: {
    selectedSchedule () {
      if (!this.selected.start || !this.selected.end) return this.scheduleLabel;

      let start = dayjs(this.selected.start);
      let end = dayjs(this.selected.end);

      return `${start.format('ddd DD, MMMM')} ${start.format(
        'HH:mm'
      )} - ${end.format('HH:mm')}`;
    },
    schedulePeriod () {
      const from = dayjs(this.weeks[0].week[0].schedule[0].start).format(
        'dddd DD, MMM'
      );

      const to = dayjs(
        this.weeks[0].week[0].schedule[this.period - 1].start
      ).format('dddd DD');

      return `${from} - ${to}`;
    }
  },
  data () {
    return {
      weeks: [],
      selected: {},
      isAnotherPopUpDisplayed: false
    };
  },
  methods: {
    nextWeek () {
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
        weekDays.push(newWeek.date());
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
    },
    prevWeek () {
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
        weekDays.push(newWeek.date());
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
    },
    setMeeting (meeting) {
      if (this.isDisabled(meeting) || this.isAnotherPopUpDisplayed) return;
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
    showPopUpInfo (schedule) {
      let appointment = this.getAppointmentTaken(schedule.start, schedule.end);
      if (appointment === undefined) return false;
      return (
        appointment.text !== undefined ||
        appointment.html !== undefined ||
        appointment.data !== undefined
      );
    },
    getTextFromAppointment (schedule) {
      let appointment = this.getAppointmentTaken(schedule.start, schedule.end);
      if (appointment === undefined) return undefined;
      return appointment.text;
    },
    getHtmlFromAppointment (schedule) {
      let appointment = this.getAppointmentTaken(schedule.start, schedule.end);
      if (appointment === undefined) return undefined;
      return appointment.html;
    },
    getDataFromAppointment (schedule) {
      let appointment = this.getAppointmentTaken(schedule.start, schedule.end);
      if (appointment === undefined) return undefined;
      return appointment.data;
    },
    getCellLabel (schedule) {
      if (this.isDisabled(schedule)) return;

      return this.isSelected(schedule) ? 'Booked' : 'Available';
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
    }
  }
};
</script>

<style lang="scss" scoped>
.appointment-selector {
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
}

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
