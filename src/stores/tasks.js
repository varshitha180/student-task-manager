import { defineStore } from 'pinia'

const TASKS_KEY = 'stm_tasks'

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    filter: { status: 'all', priority: 'all', search: '' },
    sortBy: 'dueDate',
  }),

  getters: {
    filteredTasks(state) {
      let result = [...state.tasks]
      const { status, priority, search } = state.filter
      if (status !== 'all') result = result.filter(t => t.status === status)
      if (priority !== 'all') result = result.filter(t => t.priority === priority)
      if (search.trim()) {
        const q = search.toLowerCase()
        result = result.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
      }
      // Sort by selected field.
      result.sort((a, b) => {
        if (state.sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
        if (state.sortBy === 'priority') {
          const order = { high: 0, medium: 1, low: 2 }
          return order[a.priority] - order[b.priority]
        }
        if (state.sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt)
        return 0
      })
      return result
    },

    stats(state) {
      const total = state.tasks.length
      const done = state.tasks.filter(t => t.status === 'done').length
      const pending = state.tasks.filter(t => t.status === 'pending').length
      const inProgress = state.tasks.filter(t => t.status === 'in-progress').length
      const overdue = state.tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length
      return { total, done, pending, inProgress, overdue }
    },
  },

  actions: {
    init() {
      this.tasks = loadTasks()
    },

    addTask(task) {
      const newTask = {
        id: Date.now().toString(),
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate,
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        category: task.category || 'general',
        createdAt: new Date().toISOString(),
      }
      this.tasks.unshift(newTask)
      saveTasks(this.tasks)
      return newTask
    },

    updateTask(id, updates) {
      const idx = this.tasks.findIndex(t => t.id === id)
      if (idx !== -1) {
        this.tasks[idx] = { ...this.tasks[idx], ...updates }
        saveTasks(this.tasks)
      }
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      saveTasks(this.tasks)
    },

    toggleStatus(id) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        const next = { pending: 'in-progress', 'in-progress': 'done', done: 'pending' }
        task.status = next[task.status]
        saveTasks(this.tasks)
      }
    },

    setFilter(partial) {
      this.filter = { ...this.filter, ...partial }
    },

    setSortBy(field) {
      this.sortBy = field
    },
  },
})