<template>
  <label>Due Date:</label>
  <div class="flex gap-x-2">
    <input
      v-if="selectedDate"
      type="checkbox"
      :checked="store.cardSummary?.is_completed"
      @click="store.toggleCardCompleted(store.cardSummary.id)"
    />
    <VueDatePicker
      ref="datePicker"
      v-model="selectedDate"
      @open="toggleBackdrop"
      @closed="toggleBackdrop"
      @update:model-value="handleDateSelected"
      time-picker-inline
      select-text="Save"
      :teleport-center="isMobileView ? true : false"
      :alt-position="customCalenderPosition"
      :dark="isDark ? true : false"
    >
      <template #trigger>
        <input
          :value="formattedDueDate"
          type="text"
          readonly
          placeholder="Select Date"
          class="w-[120px] py-1 px-2 border-2 cursor-pointer"
        />
      </template>

      <template #action-buttons class="relative z-[var(--z-popover)]">
        <span class="absolute top-[12px] left-[43%] font-semibold">Dates</span>

        <button
          @click.prevent="datePicker?.closeMenu"
          type="button"
          class="absolute top-[8px] right-2 font-normal p-2.5 rounded hover:bg-[#f3f3f3] active:bg-[#f3f3f3]"
        >
          <img :src="CrossIcon" class="w-3 h-3" />
        </button>

        <div class="my-0.5">
          <button
            v-if="selectedDate"
            type="button"
            class="w-[65px] h-[35px] mr-1 rounded hover:bg-[#f3f3f3] active:bg-[#f3f3f3]"
            @click.prevent="handleClearDueDate"
          >
            Remove
          </button>
          <button
            type="button"
            class="w-[65px] h-[35px] rounded text-white bg-[#1976d2] hover:bg-[#1c8cfc] active:bg-[#1c8cfc]"
            @click.prevent="datePicker?.selectDate"
          >
            Save
          </button>
        </div>
      </template>
    </VueDatePicker>

    <div class="flex items-center justify-center">
      <span
        v-if="isCompleted"
        class="bg-[#1f845a] text-white px-1.5 flex items-center rounded h-[85%]"
        >Completed</span
      >
      <span
        v-if="isOverdue"
        class="bg-[#ffeceb] text-[#ae2a19] px-1.5 flex items-center rounded h-[87%]"
        >Overdue</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.svg'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
import { useDark } from '@vueuse/core'
import { useCardStore } from '@/stores'
const store = useCardStore()
const isDark = useDark()
const isMobileView = inject('isMobileView')
const customCalenderPosition = () => ({ top: 44, left: -30 })

const selectedDate = ref(null)
selectedDate.value = store.cardSummary?.due_date?.seconds
  ? new Date(store.cardSummary?.due_date.seconds * 1000)
  : store.cardSummary?.due_date || ''

const formattedDueDate = computed(() => {
  if (!selectedDate.value) return ''
  return `${
    selectedDate.value.getMonth() + 1
  }/${selectedDate.value.getDate()} at ${selectedDate.value.getHours()}:${selectedDate.value
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
})

watch(
  () => store.cardSummary?.due_date,
  (newValue) => {
    selectedDate.value = newValue?.seconds
      ? new Date(newValue.seconds * 1000)
      : newValue || ''
  }
)

const emit = defineEmits(['dateSelected'])
const handleDateSelected = (date: Date) => {
  store.updateCardDueDate(date)
}

const datePicker = ref<DatePickerInstance>(null)
const handleClearDueDate = () => {
  if (datePicker.value) {
    datePicker.value.closeMenu()
    datePicker.value.clearValue()
  }
  if (store.cardSummary?.is_completed)
    store.toggleCardCompleted(store.cardSummary.id)
}

const isCompleted = computed(
  () => selectedDate.value && store.cardSummary?.is_completed
)

const isOverdue = computed(() => {
  return (
    selectedDate.value && !isCompleted.value && selectedDate.value < new Date()
  )
})
</script>

<style scoped lang="scss">
.dp__main {
  width: 120px !important;
  --dp-menu-min-width: 300px;
  --dp-menu-padding: 40px 10px 0 10px;
  --dp-font-family: var(--font-family);
  --dp-font-size: 14px;
}
</style>
