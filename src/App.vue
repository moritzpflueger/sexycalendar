<template>
  <main :class="stylex(styles.container)">
    <Calendar />
    <br />
    <br />
    <br />
    <br />
    <Calendar />
  </main>
</template>

<script setup>
import stylex from '@stylexjs/stylex'
import Calendar from './components/Calendar.vue'
</script>

<script>
const styles = stylex.create({
  container: {
    padding: '5vw'
  }
})
</script>
