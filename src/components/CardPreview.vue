<template>
  <ul>
    <li>{{ card.title }}</li>
    <li class="flex gap-x-2 items-center">
      <button
        v-if="formattedDueDate"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        :class="{
          overdue: isOverdue,
          'card-completed': card.is_completed,
          'hover-show-checkbox': hover,
        }"
        class="due-date-button"
      >
        <div class="w-5">
          <input
            v-show="hover"
            type="checkbox"
            :checked="card.is_completed"
            @click.stop="store.toggleCardCompleted(card.id)"
          />
          <span v-show="!hover">🕓</span>
        </div>
        {{ formattedDueDate }}
      </button>

      <span v-if="card.attachments_total">📎 {{ card.attachments_total }}</span>

      <span
        v-if="checklistProgress"
        class="checklist-progress"
        :class="{ 'checklist-completed': allChecklistItemsCompleted }"
        >✅ {{ checklistProgress }}</span
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
const props = defineProps(['card'])
// NOTE Firestore automatically converts all Date objects to firestore timestamp objects (no way to really avoid this), which means when reloading the page, we will receive timestamp objects for dates, which need to be converted to Date objects. Meanwhile, the VueDatePicker only exports data as Date objects, which do not require conversion.
const formatDate = (date) => {
  if (!date) return ''
  const d = date.seconds ? new Date(date.seconds * 1000) : date
  return isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`
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
  padding: 8px 12px 4px;
  margin: 8px 4px;
  background: #73b2f1;
  border: black 1px solid;
  border-radius: 8px;
  min-height: 24px;
}

// li {
//   font-style: italic;
// }

.due-date-button,
.checklist-progress {
  padding: 2px 4px;
  border-radius: 8px;
}
.due-date-button {
  display: flex;
  column-gap: 4px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .due-date-button input[type='checkbox'] {
    display: inline;
  }

  .due-date-button span {
    display: none; /* Hide the clock icon */
  }
}

.overdue {
  background-color: rgb(255, 94, 0);
}

.card-completed {
  background-color: rgb(0, 255, 13);
}

.checklist-completed {
  background-color: rgb(0, 255, 13);
}
</style>
