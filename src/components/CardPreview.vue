<template>
  <ul>
    <li>{{ card.title }}</li>
    <li v-if="formattedDueDate">
      <button :class="{ overdue: isOverdue }" class="due-date-button">
        <input type="checkbox" /> 🕓 {{ formattedDueDate }}
      </button>
    </li>
    <li>{{ card.checklist_progress }}</li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  if (dueDate) {
    const dueDateTime = dueDate.seconds
      ? new Date(dueDate.seconds * 1000)
      : dueDate
    return dueDateTime < new Date()
  }
  return false
})
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

.due-date-button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
}

.overdue {
  background-color: rgb(255, 94, 0);
}
</style>
