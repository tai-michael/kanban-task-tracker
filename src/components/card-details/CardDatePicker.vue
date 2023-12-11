<template>
  <div>
    <label>Due Date:</label>
    <VueDatePicker
      v-model="selectedDate"
      @update:model-value="handleDateSelected"
      time-picker-inline
      select-text="Save"
      ref="datePicker"
    >
      <template #trigger>
        <div class="flex gap-x-2">
          <input
            v-if="selectedDate"
            type="checkbox"
            :checked="store.cardSummary?.is_completed"
            @click.stop="store.toggleCardCompleted(store.cardSummary.id)"
          />
          <input
            :value="formattedDueDate"
            type="text"
            readonly
            placeholder="Select Date"
            class="w-[130px] p-1 border-2 cursor-pointer"
          />
          <span v-if="isCompleted" class="bg-green-300 p-1 flex items-center"
            >Completed</span
          >
          <span v-if="isOverdue" class="bg-red-400 p-1 flex items-center"
            >Overdue</span
          >
          <button v-if="selectedDate" @click.stop="handleClearDueDate">
            Remove date
          </button>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
import { useCardStore } from '@/stores'
const store = useCardStore()

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

<style scoped lang="scss"></style>
