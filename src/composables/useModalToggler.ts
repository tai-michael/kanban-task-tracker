import { reactive } from 'vue'

const modals = reactive({})

export default function (key: string) {
  function setModalRef(modalElement: HTMLElement) {
    modals[key] = modalElement
  }

  function toggleModal() {
    const modalInstance = modals[key]
    if (!modalInstance || typeof modalInstance.showModal !== 'function') {
      console.error('Modal instance or showModal method not available')
      return
    }

    modalInstance.showModal()
  }

  return {
    setModalRef,
    toggleModal,
  }
}
