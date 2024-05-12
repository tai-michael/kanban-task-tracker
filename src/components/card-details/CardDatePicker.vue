<template>
  <label
    class="block mb-2 text-sm font-semibold text-[var(--card-text-subtle)] dark:text-white"
    >Due date</label
  >

  <div class="flex items-center gap-x-2">
    <input
      v-if="selectedDate"
      type="checkbox"
      :checked="store.cardSummary?.is_completed"
      @click="store.toggleCardCompleted(store.cardSummary.id)"
      :title="
        store.cardSummary?.is_completed
          ? 'This card is complete.'
          : 'This card is past due.'
      "
      class="accent-[var(--main-purple)] w-4 h-4"
    />

    <div
      class="flex gap-x-2 bg-[var(--card-secondary-button)] p-1.5 rounded"
      :class="{ 'p-0': !selectedDate }"
    >
      <VueDatePicker
        ref="datePicker"
        v-model="selectedDate"
        @update:model-value="handleDateSelected"
        @open="toggleBackdrop"
        @closed="toggleBackdrop"
        @keydown.esc.prevent="datePicker?.closeMenu"
        time-picker-inline
        select-text="Save"
        :teleport-center="isMobileView"
        :alt-position="customCalenderPosition"
        :dark="isDark"
      >
        <template #trigger>
          <div
            class="relative hover:rounded-[2px] hover:outline hover:outline-1 hover:outline-offset-[6px] outline-[var(--main-purple)]"
            :class="{
              'hover:outline-offset-[unset]': selectedDate,
            }"
          >
            <input
              :value="formattedDueDate"
              type="text"
              readonly
              placeholder="Select Date"
              class="date-input w-[140px] py-1 px-3 cursor-pointer outline-none"
              :class="{
                'bg-transparent': !selectedDate,
              }"
            />
            <DownIcon
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--main-purple)]"
              :class="{
                'right-4': !selectedDate,
                'dark:text-[var(--main-purple-hover)]': !selectedDate,
              }"
            />
          </div>
        </template>

        <template #action-buttons class="relative z-[var(--z-popover)]">
          <span
            class="absolute top-[13px] left-[43%] font-semibold text-[var(--card-text-subtle)] dark:text-white"
            >Dates</span
          >

          <button
            @click.prevent="datePicker?.closeMenu"
            type="button"
            class="absolute top-1.5 right-1.5 font-normal p-2.5 rounded-full hover:bg-[#f3f3f3] active:bg-[#f3f3f3] dark:hover:bg-[#484848] dark:active:bg-[#484848]"
          >
            <CrossIcon class="!w-4 !h-4" />
          </button>

          <div class="my-0.5">
            <button
              v-if="selectedDate"
              type="button"
              class="w-[75px] h-[35px] mr-1 rounded hover:bg-[#f3f3f3] active:bg-[#f3f3f3] dark:hover:bg-[#484848] dark:active:bg-[#484848]"
              @click.prevent="handleClearDueDate"
            >
              Remove
            </button>
            <button
              type="button"
              class="w-[65px] h-[35px] rounded text-white bg-[var(--card-primary-button)] hover:bg-[var(--card-primary-button-hover)] active:bg-[var(--card-primary-button-hover)]"
              @click.prevent="datePicker?.selectDate"
            >
              Save
            </button>
          </div>
        </template>
      </VueDatePicker>

      <div
        v-if="isCompleted || isOverdue"
        class="flex items-center justify-center"
      >
        <span
          v-if="isCompleted"
          class="bg-[var(--card-complete)] text-white px-1.5 flex items-center rounded h-[85%]"
          >Completed</span
        >
        <span
          v-if="isOverdue"
          class="px-1.5 flex items-center rounded h-[87%] bg-[hsl(1,96,91)] text-[#ae2a19] dark:bg-[#ae2a19] dark:text-white"
          >Overdue</span
        >
      </div>
    </div>
  </div>

  <div
    class="backdrop"
    v-if="isMobileView && isDatePickerOpen"
    @wheel.prevent
    @touchmove.prevent
    @scroll.prevent
    @touchstart.prevent
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import CrossIcon from '@/assets/icons/icon-cross.vue'
import DownIcon from '@/assets/icons/icon-chevron-down.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
import { useDark } from '@vueuse/core'
import { useCardStore } from '@/stores'
const store = useCardStore()
const isDark = useDark()
const isMobileView = inject<boolean>('isMobileView')
const customCalenderPosition = () => ({ top: 40, left: -6 })

const isDatePickerOpen = ref(false)
const toggleBackdrop = () => {
  isDatePickerOpen.value = !isDatePickerOpen.value
}

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
.date-input::placeholder {
  color: var(--card-text);
}

.dp__main {
  // width: 130px !important;
  width: 140px !important;
  --dp-menu-min-width: 300px;
  --dp-menu-padding: 50px 10px 0 10px;
  --dp-font-family: var(--font-family);
  --dp-font-size: 14px;
}

:global(.dp__arrow_top) {
  display: none;
}

:global(.dp__month_year_select),
:global(.dp__calendar_header_item) {
  font-weight: 600;
}

:global(.dp__theme_light),
:global(.dp__theme_dark) {
  --dp-primary-color: var(--main-purple);
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100vh;
  width: 100%;
  z-index: var(--z-backdrop);
}
</style>
