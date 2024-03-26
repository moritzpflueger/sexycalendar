<template>
  <div :class="stylex(styles.month)">
    <h1 :class="stylex(styles.h1)">{{ monthName }}</h1>
    <h2 :class="stylex(styles.h2)">{{ year }}</h2>
    <Weekdays />
    <Day v-for="day in paddedDaysOfMonth" :key="day.key" :day="day" :holidays="holidays" />
  </div>
</template>

<script setup async>
import { computed } from 'vue'
import stylex from '@stylexjs/stylex'
import Weekdays from './Weekdays.vue'
import Day from './Day.vue'

const props = defineProps({
  month: Object,
  holidays: Array,
  year: Number
})

const currentMonth = computed(() => props.month.getMonth())
const monthName = computed(() => props.month.toLocaleString('default', { month: 'long' }))

const daysOfMonth = computed(() => {
  const year = props.year
  const month = props.month.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1)
    const isSaturday = date.getDay() === 6
    const isSunday = date.getDay() === 0
    const isToday = date.toDateString() === new Date().toDateString()
    return {
      date: date,
      label: i + 1,
      key: `${year}-${month}-${i + 1}`,
      isPadding: false,
      isSaturday,
      isSunday,
      isToday
    }
  })
})

const paddedDaysOfMonth = computed(() => {
  const padding = []
  const firstDayOfMonth = new Date(props.year, currentMonth.value, 1).getDay()
  const paddingDays = firstDayOfMonth - 1 < 0 ? 6 : firstDayOfMonth - 1 // Adjust for Monday start

  for (let i = 0; i < paddingDays; i++) {
    padding.push({ date: new Date(), key: `padding-${i}`, isPadding: true })
  }

  return [...padding, ...daysOfMonth.value]
})
</script>

<script>
const styles = stylex.create({
  h1: {
    gridColumnStart: '1',
    gridColumnEnd: '7',
    lineHeight: 1,
    fontSize: '8vw',
    margin: 0,
    alignSelf: 'end',
    paddingBottom: '5vw'
  },
  h2: {
    lineHeight: 1,
    fontSize: '3.5vw',
    margin: 0,
    alignSelf: 'end',
    paddingBottom: '5vw'
  },
  month: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5vw',
    fontSize: '5vw',
    fontWeight: 'bold',
    padding: '10vw 5vw'
  }
})
</script>
