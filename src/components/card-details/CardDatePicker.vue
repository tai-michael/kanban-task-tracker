<template>
  <div>
    <label>Due Date:</label>
    <VueDatePicker
      @update:model-value="handleDateSelected"
      time-picker-inline
      select-text="Save"
      ref="datePicker"
    >
      <template #trigger>
        <div class="flex gap-x-2">
          <input
            :value="formattedDueDate"
            type="text"
            readonly
            placeholder="Select Date"
            class="w-[150px] p-1 border-2 cursor-pointer"
          /><span
            v-if="formattedDueDate && isOverdue"
            class="bg-red-400 p-1 flex items-center"
            >Overdue</span
          >
          <button v-if="formattedDueDate" @click.stop="handleClearDueDate">
            Remove date
          </button>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
const props = defineProps(['dueDate'])

const datePicker = ref<DatePickerInstance>(null)
const handleClearDueDate = () => {
  if (datePicker.value) {
    datePicker.value.closeMenu()
    datePicker.value.clearValue()
  }
}

const dueDate = computed(() => {
  if (!props.dueDate) return ''
  return props.dueDate.seconds
    ? new Date(props.dueDate.seconds * 1000)
    : props.dueDate
})

const formatDate = (date) => {
  if (!date) return ''
  return `${date.getMonth() + 1}/${date.getDate()} at ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

const formattedDueDate = computed(() => formatDate(dueDate.value))

const emit = defineEmits(['dateSelected'])
const handleDateSelected = (date: Date) => {
  emit('dateSelected', date)
}

const isOverdue = computed(() => {
  return dueDate.value < new Date()
})
</script>

<style scoped lang="scss"></style>
