<template>
  <ul class="select-none" :class="{ 'custom-outline': !isCardHeld }">
    <li class="leading-5 mb-1.5 text-[var(--card-preview-title)]">
      {{ card.title }}
    </li>

    <li class="flex flex-wrap gap-x-2 items-center *:mb-1">
      <button
        v-if="formattedDueDate"
        type="button"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        class="card-badge"
        :class="{
          'bg-[var(--card-preview-overdue)] hover:bg-[var(--card-preview-overdue-hover)]':
            isOverdue,
          'bg-[var(--card-preview-complete)] hover:bg-[var(--card-preview-complete-hover)]':
            card.is_completed,
        }"
      >
        <div class="w-5">
          <input
            v-show="hover"
            type="checkbox"
            :checked="card.is_completed"
            @click.stop="store.toggleCardCompleted(card.id)"
          />
          <ClockIcon
            v-show="!hover"
            :color="
              isOverdue || card.is_completed
                ? 'white'
                : 'var(--card-text-subtle)'
            "
          />
        </div>
        <span
          v-if="formattedDueDate"
          :class="
            isOverdue || card.is_completed
              ? 'text-white'
              : 'text-[var(--card-text-subtle)]'
          "
        >
          {{ formattedDueDate }}
        </span>
      </button>

      <div
        v-if="checklistProgress"
        class="card-badge text-[var(--card-text-subtle)]"
        :class="{ 'bg-[#259c6b]': allChecklistItemsCompleted }"
      >
        <CheckSquareIcon
          :color="
            allChecklistItemsCompleted ? 'white' : 'var(--card-text-subtle)'
          "
        /><span
          :class="
            allChecklistItemsCompleted
              ? 'text-[white]'
              : 'text-[var(--card-text-subtle)]'
          "
        >
          {{ checklistProgress }}</span
        >
      </div>

      <div v-if="card.attachments_total" class="card-badge">
        <AttachmentIcon :color="'var(--card-preview-attachment-icon)'" /><span
          class="text-[var(--card-text-subtle)]"
          >{{ card.attachments_total }}</span
        >
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCardStore } from '@/stores'
import ClockIcon from '@/assets/icons/icon-clock.vue'
import CheckSquareIcon from '@/assets/icons/icon-check-square.vue'
import AttachmentIcon from '@/assets/icons/icon-attachment.vue'
import useCardInteractionState from '@/composables/useCardInteractionState'
const { isCardHeld } = useCardInteractionState()
const store = useCardStore()
const props = defineProps(['card'])
// NOTE Firestore automatically converts all Date objects to firestore timestamp objects (no way to really avoid this), which means when reloading the page, we will receive timestamp objects for dates, which need to be converted to Date objects. Meanwhile, the VueDatePicker only exports data as Date objects, which do not require conversion.
const formatDate = (date) => {
  if (!date) return ''
  // NOTE Returns the date as, for example, '3/14' instead of 'Mar 14'
  // const d = date.seconds ? new Date(date.seconds * 1000) : date
  // return isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`

  const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
  if (isNaN(d.getTime())) return ''
  // return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    month: 'short',
    day: 'numeric',
  })
  return formatter.format(d)
}

const formattedDueDate = computed(() => formatDate(props.card.due_date))

const isOverdue = computed(() => {
  const dueDate = props.card.due_date
  if (dueDate && !props.card.is_completed) {
    const dueDateTime = dueDate.seconds
      ? new Date(dueDate.seconds * 1000)
      : dueDate
    return dueDateTime < new Date()
  }
  return false
})

const hover = ref(false)
const checklistProgress = computed(() => {
  if (props.card.checklist_items_total > 0) {
    return `${props.card.checklist_items_completed}/${props.card.checklist_items_total}`
  } else {
    return ''
  }
})
const allChecklistItemsCompleted = computed(() =>
  props.card.checklist_items_completed / props.card.checklist_items_total === 1
    ? true
    : false
)
</script>

<style scoped lang="scss">
ul {
  min-height: 24px;
  padding: 8px 12px 4px;
  margin: 8px 0px;
  border-radius: 8px;
  background: var(--card-preview-bg);
  box-shadow: var(--box-shadow-light);

  &:first-child {
    margin-top: 0px;
  }

  &:last-child {
    margin-bottom: 0px;
  }
}

.custom-outline:hover {
  outline: 2px solid var(--main-purple);
}

.card-badge {
  display: flex;
  align-items: center;
  column-gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
