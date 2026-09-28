<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import TaskCard from '../components/TaskCard.vue'
import AddTask from '../components/AddTask.vue'

const tasks = useTasksStore()

const showAddForm = ref(false)
const editingTask = ref(null)

const statCards = computed(() => [
  { label: 'Total', value: tasks.stats.total, color: 'bg-blue-50 text-blue-700' },
  { label: 'In progress', value: tasks.stats.inProgress, color: 'bg-indigo-50 text-indigo-700' },
  { label: 'Done', value: tasks.stats.done, color: 'bg-green-50 text-green-700' },
  { label: 'Overdue', value: tasks.stats.overdue, color: 'bg-red-50 text-red-700' },
])

function startEdit(task) {
  editingTask.value = task
  showAddForm.value = true
}

function onSaved() {
  showAddForm.value = false
  editingTask.value = null
}

function onCancelEdit() {
  editingTask.value = null
  showAddForm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500">Track your assignments, exams, and projects.</p>
      </div>
      <button @click="showAddForm = !showAddForm; editingTask = null" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
        {{ showAddForm ? 'Close form' : '+ New task' }}
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="s in statCards" :key="s.label" class="p-4 rounded-lg border border-gray-200" :class="s.color">
        <p class="text-xs uppercase tracking-wide">{{ s.label }}</p>
        <p class="text-2xl font-bold mt-1">{{ s.value }}</p>
      </div>
    </div>

    <!-- Add/Edit form -->
    <div v-if="showAddForm" class="bg-white p-4 rounded-lg border border-gray-200">
      <h2 class="font-semibold text-gray-800 mb-3">{{ editingTask ? 'Edit task' : 'Add a new task' }}</h2>
      <AddTask :existing="editingTask" @saved="onSaved" @cancel="onCancelEdit" />
    </div>

    <!-- Filters -->
    <div class="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3">
      <input :value="tasks.filter.search" @input="tasks.setFilter({ search: $event.target.value })" type="text" placeholder="Search tasks..." class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
      <select :value="tasks.filter.status" @change="tasks.setFilter({ status: $event.target.value })" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="all">All status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <select :value="tasks.filter.priority" @change="tasks.setFilter({ priority: $event.target.value })" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="all">All priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select :value="tasks.sortBy" @change="tasks.setSortBy($event.target.value)" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="dueDate">Sort: Due date</option>
        <option value="priority">Sort: Priority</option>
        <option value="createdAt">Sort: Newest</option>
      </select>
    </div>

    <!-- Task grid -->
    <div v-if="tasks.filteredTasks.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <TaskCard v-for="task in tasks.filteredTasks" :key="task.id" :task="task" @edit="startEdit" />
    </div>
    <div v-else class="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
      No tasks match your filters. Click "New task" to add one.
    </div>
  </div>
</template>