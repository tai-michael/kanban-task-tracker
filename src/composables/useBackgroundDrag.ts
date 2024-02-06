import { ref, type Ref } from 'vue'

export default function (
  containerRef: Ref<HTMLElement | null>,
  shouldStartDrag: Function
) {
  const isDragging = ref(false)
  const startX = ref(0)
  const scrollLeftStart = ref(0)

  const startDragging = (event) => {
    // console.log(event.target.classList)

    if (shouldStartDrag(event)) {
      isDragging.value = true
      startX.value = event.clientX
      scrollLeftStart.value = containerRef.value.scrollLeft
    }
  }

  const stopDragging = () => {
    isDragging.value = false
  }

  const dragBackground = (event) => {
    if (!isDragging.value) return
    event.preventDefault() // Prevents unwanted text selection
    const deltaX = event.clientX - startX.value
    containerRef.value.scrollLeft = scrollLeftStart.value - deltaX
  }

  return {
    startDragging,
    stopDragging,
    dragBackground,
  }
}
