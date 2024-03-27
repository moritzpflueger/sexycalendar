<template>
  <div ref="canvasContainer" :class="stylex(styles.canvasContainer)"></div>
</template>

<script setup async>
import { ref, onMounted } from 'vue'
import stylex from '@stylexjs/stylex'

const props = defineProps(['month'])
const canvasContainer = ref(null)
const isDrawing = ref(false)
const lastPosition = ref({ x: 0, y: 0 })

function getEventPosition(event) {
  const canvas = canvasContainer.value.querySelector('canvas')
  const rect = canvas.getBoundingClientRect()
  let x, y

  if (event.touches) {
    x = event.touches[0].clientX - rect.left
    y = event.touches[0].clientY - rect.top
  } else {
    x = event.clientX - rect.left
    y = event.clientY - rect.top
  }

  return { x, y }
}

function startDrawing(event) {
  if (event.touches && event.touches[0].touchType === 'stylus') {
    event.preventDefault()
    isDrawing.value = true
    const { x, y } = getEventPosition(event)
    lastPosition.value = { x, y }
  }
}

function draw(event) {
  if (event.touches && event.touches[0].touchType === 'stylus') {
    event.preventDefault()
    if (!isDrawing.value) return
    const { x, y } = getEventPosition(event)
    const ctx = canvasContainer.value.querySelector('canvas').getContext('2d')

    ctx.beginPath()
    ctx.moveTo(lastPosition.value.x, lastPosition.value.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.closePath()

    lastPosition.value = { x, y }
  }
}

function stopDrawing(event) {
  if (event.touches && event.touches[0].touchType === 'stylus') {
    event.preventDefault()
    if (isDrawing.value) saveDrawing()
    isDrawing.value = false
  }
}

function setupEventListeners(canvas) {
  canvas.addEventListener('touchstart', startDrawing, { passive: false })
  canvas.addEventListener('touchmove', draw, { passive: false })
  canvas.addEventListener('touchend', stopDrawing, { passive: false })
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)
}

function initializeWebGL() {
  const canvas = document.createElement('canvas')
  canvas.width = canvasContainer.value.offsetWidth
  canvas.height = canvasContainer.value.offsetHeight
  canvasContainer.value.appendChild(canvas)

  setupEventListeners(canvas)
}

function saveDrawing() {
  const canvas = canvasContainer.value.querySelector('canvas')
  if (canvas) {
    const dataUrl = canvas.toDataURL('image/png')
    const key = `savedDrawing-${props.month.getFullYear()}-${props.month.getMonth()}`
    localStorage.setItem(key, dataUrl)
  }
}

function loadDrawing() {
  const key = `savedDrawing-${props.month.getFullYear()}-${props.month.getMonth()}`
  const savedDrawing = localStorage.getItem(key)
  if (savedDrawing) {
    const canvas = canvasContainer.value.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = function () {
      ctx.drawImage(img, 0, 0) // Draw the saved image onto the canvas
    }
    img.src = savedDrawing
  }
}

onMounted(() => {
  initializeWebGL()
  loadDrawing()
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
  }
})
</script>
