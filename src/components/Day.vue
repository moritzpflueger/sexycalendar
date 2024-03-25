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
    <div v-if="holidayName" :class="stylex(styles.holiday)">
      {{ holidayName }}
    </div>
  </div>
</template>

<script setup>
import stylex from '@stylexjs/stylex'

const props = defineProps({
  day: Object,
  holidayName: String
})
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
    height: '6vw'
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
