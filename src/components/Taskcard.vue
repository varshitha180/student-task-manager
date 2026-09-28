<script setup>
import { computed } from 'vue'
import { useTasksStore } from '../stores/tasks'

const props = defineProps({
  task: { type: Object, required: true },
})
const emit = defineEmits(['edit'])

const tasks = useTasksStore()

const isOverdue = computed(() => {
  return props.task.status !== 'done' && new Date(props.task.dueDate) < new Date()
})

const priorityClass = computed(() => ({
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
}[props.task.priority] || 'bg-gray-100 text-gray-700'))

const statusClass = computed(() => ({
  pending: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}[props.task.status] || 'bg-gray-100 text-gray-700'))

function onToggle() {
  tasks.toggleStatus(props.task.id)
}

function onDelete() {
  if (confirm('Delete this task?')) {
    tasks.deleteTask(props.task.id)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 truncate" :class="{ 'line-through text-gray-400': task.status === 'done' }">
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ task.description }}</p>
      </div>
      <div class="flex flex-col gap-1 items-end">
        <span class="text-xs px-2 py-0.5 rounded-full" :class="priorityClass">{{ task.priority }}</span>
        <span class="text-xs px-2 py-0.5 rounded-full" :class="statusClass">{{ task.status }}</span>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span :class="{ 'text-red-600 font-medium': isOverdue }">
        Due: {{ new Date(task.dueDate).toLocaleDateString() }}{{ isOverdue ? ' (overdue)' : '' }}
      </span>
      <span>{{ task.category }}</span>
    </div>

    <div class="mt-3 flex gap-2">
      <button @click="onToggle" class="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded">Toggle status</button>
      <button @click="emit('edit', task)" class="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded">Edit</button>
      <button @click="onDelete" class="text-xs px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded">Delete</button>
    </div>
  </div>
</template>