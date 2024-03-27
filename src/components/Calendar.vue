<template>
  <div :class="stylex(styles.wrapper)">
    <Month
      v-for="month in months"
      :key="`month-${month.getFullYear()}-${month.getMonth()}`"
      :ref="(el) => (monthRefs[`month-${month.getFullYear()}-${month.getMonth()}`] = el)"
      :month="month"
      :year="currentYear"
      :holidays="germanHolidays"
    />
  </div>
</template>

<script setup async>
import { ref, computed, onMounted } from 'vue'
import stylex from '@stylexjs/stylex'
import Month from './Month.vue'

const countryIsoCode = 'DE'
const languageIsoCode = 'DE'
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const germanHolidays = ref([])
const months = ref([])
const monthRefs = ref({})

function initMonths() {
  for (let i = 0; i < 12; i++) {
    months.value.push(new Date(currentYear.value, i, 2))
  }
}

async function getHolidays() {
  const baseUrl = 'https://openholidaysapi.org/PublicHolidays'
  const url = `${baseUrl}?countryIsoCode=${countryIsoCode}&languageIsoCode=${languageIsoCode}&validFrom=${currentYear.value}-01-01&validTo=${currentYear.value}-12-31`
  await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'text/json'
    }
  })
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
initMonths()
getHolidays()

onMounted(() => {
  monthRefs.value[`month-${currentYear.value}-${currentDate.value.getMonth()}`].$el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
})
</script>

<script>
const styles = stylex.create({
  wrapper: {
    // backgroundColor: 'red'
  }
})
</script>
