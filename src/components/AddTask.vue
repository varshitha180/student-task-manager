<script setup>
import { reactive, watch } from 'vue'
import { useTasksStore } from '../stores/tasks'

const props = defineProps({
  // When editing an existing task, pass it here.
  existing: { type: Object, default: null },
})

const emit = defineEmits(['saved', 'cancel'])

const tasks = useTasksStore()

const blank = () => ({
  title: '',
  description: '',
  dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  priority: 'medium',
  category: 'general',
  status: 'pending',
})

const form = reactive(blank())
const error = ref('')

// Sync form when editing an existing task.
watch(() => props.existing, (val) => {
  if (val) {
    Object.assign(form, {
      title: val.title,
      description: val.description,
      dueDate: val.dueDate.slice(0, 10),
      priority: val.priority,
      category: val.category,
      status: val.status,
    })
  }
}, { immediate: true })

import { ref } from 'vue'

function save() {
  error.value = ''
  if (!form.title.trim()) { error.value = 'Title is required.'; return }
  if (!form.dueDate) { error.value = 'Due date is required.'; return }

  const payload = { ...form, dueDate: new Date(form.dueDate).toISOString() }
  if (props.existing) {
    tasks.updateTask(props.existing.id, payload)
  } else {
    tasks.addTask(payload)
  }
  emit('saved')
  Object.assign(form, blank())
}
</script>

<template>
  <form @submit.prevent="save" class="space-y-3">
    <div v-if="error" class="p-2 bg-red-50 text-red-700 text-sm rounded">{{ error }}</div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
      <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Finish lab report" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Optional details"></textarea>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Due date *</label>
        <input v-model="form.dueDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select v-model="form.priority" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input v-model="form.category" type="text" list="categories" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" placeholder="general" />
        <datalist id="categories">
          <option value="general" />
          <option value="assignment" />
          <option value="exam" />
          <option value="project" />
          <option value="personal" />
        </datalist>
      </div>
    </div>

    <div class="flex gap-2 justify-end">
      <button v-if="existing" type="button" @click="emit('cancel')" class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
      <button type="submit" class="px-4 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">
        {{ existing ? 'Update task' : 'Add task' }}
      </button>
    </div>
  </form>
</template>