<template>
  <div :class="stylex(styles.wrapper)">
    <button @click="previousMonth">Previous</button>
    <button @click="nextMonth">Next</button>
    <div :class="stylex(styles.daysGrid)">
      <h1 :class="stylex(styles.h1)">{{ currentMonthName }}</h1>
      <h2 :class="stylex(styles.h2)">{{ currentYear }}</h2>
      <div
        :class="[
          stylex(styles.weekdays),
          day.includes('Sun') && stylex(styles.sunday),
          day.includes('Sat') && stylex(styles.saturday)
        ]"
        v-for="day in weekdays"
        :key="day"
      >
        {{ day }}
      </div>
      <div
        :class="[
          stylex(styles.day),
          day.isSaturday && stylex(styles.saturday),
          day.isSunday && stylex(styles.sunday),
          day.isToday && stylex(styles.today)
        ]"
        v-for="day in paddedDaysOfMonth"
        :key="day.key"
      >
        {{ day.date }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import stylex from '@stylexjs/stylex'

const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const germanHolidays = ref(null)

try {
  const response = await fetch(
    'https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&languageIsoCode=DE&validFrom=2022-01-01&validTo=2022-06-30',
    {
      method: 'GET',
      headers: {
        Accept: 'text/json'
      }
    }
  )
  if (response.ok) {
    const data = await response.json()
    console.log(data)
    germanHolidays.value = data.map((holiday) => ({
      date: new Date(holiday.startDate),
      name: holiday.name[0].text
    }))
    console.log(germanHolidays.value)
  }
} catch (error) {
  console.error(error)
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
      date: i + 1,
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
    padding.push({ date: '', key: `padding-${i}`, isPadding: true })
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
    overflowX: 'auto',
    overflowY: 'hidden',
    marginTop: '5vw'
  },
  weekdays: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2vw',
    fontSize: '3vw',
    fontWeight: 'normal'
  },
  day: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '4vw'
  },
  saturday: {
    color: 'blue' /* Light blue for Saturdays */
  },
  sunday: {
    color: 'red' /* Light red for Sundays */
  },
  today: {
    color: 'orangered !important' /* Light red for Sundays */
  }
})
</script>
