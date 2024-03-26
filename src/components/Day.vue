<template>
  <div
    :class="[
      stylex(styles.day),
      day.isSaturday && stylex(styles.saturday),
      day.isSunday && stylex(styles.sunday),
      day.isToday && stylex(styles.today)
    ]"
  >
    <div>{{ day.label }}</div>
    <div v-if="isHoliday(day.date)" :class="stylex(styles.holiday)">
      {{ getHolidayName(day.date) }}
    </div>
  </div>
</template>

<script setup>
import stylex from '@stylexjs/stylex'

const props = defineProps({
  day: Object,
  holidays: Array
})

const isHoliday = (date) => {
  return props.holidays.some((holiday) => holiday.date.toDateString() === date.toDateString())
}

const getHolidayName = (date) => {
  const holiday = props.holidays.find(
    (holiday) => holiday.date.toDateString() === date.toDateString()
  )
  return holiday ? holiday.name : ''
}
</script>

<script>
const styles = stylex.create({
  holiday: {
    fontSize: '1vw',
    fontWeight: 'normal',
    textAlign: 'center'
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'between',
    alignItems: 'center',
    height: '4vw'
  },
  saturday: {
    color: 'blue'
  },
  sunday: {
    color: 'red'
  },
  today: {
    color: 'orangered !important'
  },
  holiday: {
    fontSize: '1vw',
    fontWeight: 'normal',
    textAlign: 'center'
  }
})
</script>
