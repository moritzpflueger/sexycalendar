<template>
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
</template>

<script setup>
import stylex from '@stylexjs/stylex'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<script>
const styles = stylex.create({
  weekdays: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2vw',
    fontSize: '3vw',
    fontWeight: 'normal'
  },
  sunday: {
    color: 'red'
  },
  saturday: {
    color: 'blue'
  }
})
</script>
