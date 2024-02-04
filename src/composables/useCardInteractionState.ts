import { ref } from 'vue'
const isHoveringDeleteZone = ref(false)
const isCardHeld = ref(false)

export default function () {
  const updateCardHeldStatus = (isHeld: boolean) => {
    isCardHeld.value = isHeld
  }

  const updateHoverDeleteZoneStatus = (isHovering: boolean) => {
    isHoveringDeleteZone.value = isHovering
    // console.log(
    //   'isHoveringDeleteZone: ' + isHoveringDeleteZone.value
    // )
  }

  return {
    isCardHeld,
    isHoveringDeleteZone,

    updateCardHeldStatus,
    updateHoverDeleteZoneStatus,
  }
}
