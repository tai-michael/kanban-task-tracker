<template>
  <button
    type="button"
    class="mt-1 mb-2 w-full p-1.5 pl-7 inline-flex items-center gap-2 hover:sidebar-navbtn-hover-effect"
    :class="{ 'sidebar-navbtn-hover-effect': isPopoverOpen }"
    @click.stop="togglePopover"
  >
    <label
      class="flex justify-center items-center w-8 h-8 bg-[hsl(168,77%,17%)] rounded-full font-medium text-white cursor-pointer"
    >
      {{ userInitials }}
    </label>
    <span class="font-bold text-[var(--medium-dark-gray)]">
      {{ user?.displayName }}
    </span>
  </button>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SignOutIcon from '@/assets/icons/icon-signout.vue'
import TransitionFade from '@/components/transitions/TransitionFade.vue'
import { auth, user } from '@/firebaseInit'
import { signOut } from 'firebase/auth'

const userInitials = computed(() => {
  const name = user.value?.displayName
  if (!name) return ''
  const [firstName, lastName] = name.split(' ')
  if (!lastName) return firstName.length > 2 ? firstName[0] : firstName
  return firstName[0].toUpperCase() + lastName[0].toUpperCase()
})

const isPopoverOpen = ref(false)
const togglePopover = () => {
  isPopoverOpen.value = !isPopoverOpen.value
}

const popover = ref(null)
const handleClickOutsidePopover = (event: MouseEvent) => {
  if (popover.value && !popover.value.contains(event.target)) {
    togglePopover()
  }
}

watch(
  () => isPopoverOpen.value,
  (newValue) => {
    if (newValue) {
      document.addEventListener('click', handleClickOutsidePopover)
    } else {
      document.removeEventListener('click', handleClickOutsidePopover)
    }
  }
)
</script>
