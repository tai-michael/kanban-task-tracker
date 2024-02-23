import { ref } from 'vue'
const isEllipsisMenuActive = ref(false)

export default function () {
  const updateEllipsisMenuStatus = (isActive: boolean) => {
    isEllipsisMenuActive.value = isActive
  }

  return {
    isEllipsisMenuActive,
    updateEllipsisMenuStatus,
  }
}
