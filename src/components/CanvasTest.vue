<template>
  <div ref="canvasContainer" :class="stylex(styles.canvasContainer)">
    <svg
      ref="svgCanvas"
      :width="svgWidth"
      :height="svgHeight"
      class="drawing-svg"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      xmlns="http://www.w3.org/2000/svg"
    >
      <template v-for="(commands, index) in drawingCommands" :key="index">
        <path :d="commands" stroke="red" stroke-width="3" fill="none" />
      </template>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import stylex from '@stylexjs/stylex'

const props = defineProps(['month'])
const canvasContainer = ref(null)
const isDrawing = ref(false)
const lastPosition = ref({ x: 0, y: 0 })
const drawingCommands = ref([])

const svgWidth = ref(window.innerWidth)
const svgHeight = ref(window.innerHeight)
const initialWidth = ref(null) // Define the initial scale variable
const scale = ref(null) // Define the scale variable

function getEventPosition(event) {
  if (!canvasContainer.value) return { x: 0, y: 0 }
  const rect = canvasContainer.value.getBoundingClientRect()
  let x, y

  if (event.touches) {
    x = event.touches[0].clientX - rect.left
    y = event.touches[0].clientY - rect.top
  } else {
    x = event.clientX - rect.left
    y = event.clientY - rect.top
  }

  // Adjust coordinates based on the current scale factor
  x /= scale.value
  y /= scale.value

  return { x, y }
}

function startDrawing(event) {
  event.preventDefault()
  isDrawing.value = true
  const { x, y } = getEventPosition(event)
  lastPosition.value = { x, y }
  const scaledX = x * scale.value
  const scaledY = y * scale.value
  // Start a new drawing with the initial "moveto" command
  drawingCommands.value.push(`M${x} ${y}`)
}

function draw(event) {
  if (!isDrawing.value) return
  event.preventDefault()
  const { x, y } = getEventPosition(event)
  lastPosition.value = { x, y }
  const scaledX = x * scale.value
  const scaledY = y * scale.value
  // Start a new drawing with the initial "moveto" command
  // drawingCommands.value(`M${scaledX} ${scaledY}`)
  // Append line commands to the current drawing
  drawingCommands.value[drawingCommands.value.length - 1] += ` L${x} ${y}`
}

function stopDrawing(event) {
  event.preventDefault()
  isDrawing.value = false
  saveDrawings()
}

function saveDrawings() {
  // Save all drawing commands to local storage
  const keyPrefix = `savedDrawing-${props.month.getFullYear()}-${props.month.getMonth()}`
  drawingCommands.value.forEach((commands, index) => {
    localStorage.setItem(`${keyPrefix}-${index}`, commands)
  })
}

function loadDrawings() {
  // Load all drawing commands from local storage
  const keyPrefix = `savedDrawing-${props.month.getFullYear()}-${props.month.getMonth()}`
  let index = 0
  let key = `${keyPrefix}-${index}`
  while (localStorage.getItem(key)) {
    drawingCommands.value.push(localStorage.getItem(key))
    index++
    key = `${keyPrefix}-${index}`
  }
}

function handleResize() {
  console.log(initialWidth.value)
  // if (!scale.value) {
  scale.value = window.innerWidth / initialWidth.value
  // }
  localStorage.setItem('scaleFactor', scale.value) // Save scale factor to local storage
  // svgWidth.value = window.innerWidth
  // svgHeight.value = window.innerHeight
  document.documentElement.style.setProperty('--scale-factor', scale.value)
}
// Load drawings on component mount
onMounted(() => {
  canvasContainer.value = document.querySelector('.canvas-container')

  const savedInitialWidth = parseFloat(localStorage.getItem('initialWidth')) // Retrieve initial width from localStorage
  if (savedInitialWidth) {
    initialWidth.value = savedInitialWidth // Set the initial width if available in localStorage
  } else {
    localStorage.setItem('initialWidth', svgWidth.value) // Otherwise, store the current width as the initial width
  }

  const savedScaleFactor = localStorage.getItem('scaleFactor')
  if (savedScaleFactor) {
    scale.value = parseFloat(savedScaleFactor)
    document.documentElement.style.setProperty('--scale-factor', scale.value)
  }

  handleResize()
  loadDrawings()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // Save all drawings to local storage before unmounting
  saveDrawings()
  window.removeEventListener('resize', handleResize)
})
</script>

<script>
const styles = stylex.create({
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
    // border: '5px solid pink'
    // backgroundColor: 'lime'
  }
  // drawingSvg: {
  //   transformOrigin: 'top left',
  //   transform: `scale(var(${scale.value})`
  // }
})
</script>

<style>
.drawing-svg {
  transform-origin: top left; /* Set the origin to the top-left corner of the SVG */
  transform: scale(var(--scale-factor)); /* Scale the SVG */
}
</style>
