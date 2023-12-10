<template>
  <div>
    <label>Due Date:</label>
    <VueDatePicker
      v-model="date"
      @update:model-value="handleDateSelected"
      time-picker-inline
      select-text="Save"
      ref="datePicker"
    >
      <template #trigger>
        <div class="flex gap-x-2">
          <input
            type="text"
            :value="formattedDueDate"
            class="w-[150px] p-1 border-2"
            placeholder="Select Date"
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
import { computed, onMounted, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
const props = defineProps(['date'])

const datePicker = ref<DatePickerInstance>(null)
const handleClearDueDate = () => {
  if (datePicker.value) {
    datePicker.value.closeMenu()
    datePicker.value.clearValue()
  }
}

const date = ref()
const formatDate = (date: Date) => {
  if (!date) return ''
  return `${date.getMonth() + 1}/${date.getDate()} at ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

const formattedDueDate = computed(() => formatDate(date.value))

const emit = defineEmits(['dateSelected'])
const handleDateSelected = (modelData: Date) => {
  console.log(modelData)
  emit('dateSelected', modelData)
}

const isOverdue = computed(() => {
  return date.value < new Date()
})

onMounted(() => {
  // convert Firestore timestamp to Date format
  if (!props.date) return
  date.value = new Date(props.date.seconds * 1000)
})
</script>

<style scoped lang="scss"></style>
