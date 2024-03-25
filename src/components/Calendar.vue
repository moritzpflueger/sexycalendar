<template>
  <div :class="stylex(styles.wrapper)">
    <button @click="previousMonth">Previous</button>
    <button @click="nextMonth">Next</button>
    <div :class="stylex(styles.daysGrid)">
      <h1 :class="stylex(styles.h1)">{{ currentMonthName }}</h1>
      <h2 :class="stylex(styles.h2)">{{ currentYear }}</h2>
      <Weekdays />
      <Day
        v-for="day in paddedDaysOfMonth"
        :key="day.key"
        :day="day"
        :holidayName="isHoliday(day.date) ? getHolidayName(day.date) : ''"
      />
    </div>
  </div>
</template>

<script setup async>
import { ref, computed } from 'vue'
import stylex from '@stylexjs/stylex'
import Weekdays from './Weekdays.vue'
import Day from './Day.vue'

const countryIsoCode = 'DE'
const languageIsoCode = 'DE'
const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const germanHolidays = ref([])

async function getHolidays() {
  const baseUrl = 'https://openholidaysapi.org/PublicHolidays'
  await fetch(
    `${baseUrl}?countryIsoCode=${countryIsoCode}&languageIsoCode=${languageIsoCode}&validFrom=${currentYear.value}-01-01&validTo=${currentYear.value}-12-31`,
    {
      method: 'GET',
      headers: {
        Accept: 'text/json'
      }
    }
  )
    .then((res) => res.json())
    .then((data) => {
      germanHolidays.value = data.map((holiday) => {
        return {
          name: holiday.name[0].text,
          date: new Date(holiday.startDate)
        }
      })
    })
}
getHolidays()

const isHoliday = (date) => {
  return germanHolidays.value.some((holiday) => holiday.date.toDateString() === date.toDateString())
}

const getHolidayName = (date) => {
  const holiday = germanHolidays.value.find(
    (holiday) => holiday.date.toDateString() === date.toDateString()
  )
  return holiday ? holiday.name : ''
}

const currentMonthName = computed(() =>
  currentDate.value.toLocaleString('default', { month: 'long' })
)

const daysOfMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
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
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const paddingDays = firstDayOfMonth - 1 < 0 ? 6 : firstDayOfMonth - 1 // Adjust for Monday start

  for (let i = 0; i < paddingDays; i++) {
    padding.push({ date: new Date(), key: `padding-${i}`, isPadding: true })
  }

  return [...padding, ...daysOfMonth.value]
})

function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}
</script>

<script>
const styles = stylex.create({
  wrapper: {
    // backgroundColor: 'red',
  },
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
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5vw',
    fontSize: '5vw',
    fontWeight: 'bold',
    padding: '1vw',
    marginTop: '5vw'
  }
})
</script>
