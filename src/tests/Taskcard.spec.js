import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../stores/tasks'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('tasks store', () => {
  it('starts empty', () => {
    const tasks = useTasksStore()
    expect(tasks.tasks).toHaveLength(0)
    expect(tasks.stats.total).toBe(0)
  })

  it('adds a task', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'Lab report', dueDate: '2099-01-01', priority: 'high' })
    expect(tasks.tasks).toHaveLength(1)
    expect(tasks.tasks[0].title).toBe('Lab report')
    expect(tasks.stats.total).toBe(1)
  })

  it('updates a task', () => {
    const tasks = useTasksStore()
    const t = tasks.addTask({ title: 'Old', dueDate: '2099-01-01' })
    tasks.updateTask(t.id, { title: 'New' })
    expect(tasks.tasks[0].title).toBe('New')
  })

  it('deletes a task', () => {
    const tasks = useTasksStore()
    const t = tasks.addTask({ title: 'Delete me', dueDate: '2099-01-01' })
    tasks.deleteTask(t.id)
    expect(tasks.tasks).toHaveLength(0)
  })

  it('toggles status through the cycle', () => {
    const tasks = useTasksStore()
    const t = tasks.addTask({ title: 'Cycle', dueDate: '2099-01-01' })
    expect(t.status).toBe('pending')
    tasks.toggleStatus(t.id)
    expect(tasks.tasks[0].status).toBe('in-progress')
    tasks.toggleStatus(t.id)
    expect(tasks.tasks[0].status).toBe('done')
    tasks.toggleStatus(t.id)
    expect(tasks.tasks[0].status).toBe('pending')
  })

  it('filters by status', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'A', dueDate: '2099-01-01', status: 'pending' })
    tasks.addTask({ title: 'B', dueDate: '2099-01-01', status: 'done' })
    tasks.setFilter({ status: 'done' })
    expect(tasks.filteredTasks).toHaveLength(1)
    expect(tasks.filteredTasks[0].title).toBe('B')
  })

  it('filters by priority', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'A', dueDate: '2099-01-01', priority: 'high' })
    tasks.addTask({ title: 'B', dueDate: '2099-01-01', priority: 'low' })
    tasks.setFilter({ priority: 'high' })
    expect(tasks.filteredTasks).toHaveLength(1)
  })

  it('searches by title', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'Math assignment', dueDate: '2099-01-01' })
    tasks.addTask({ title: 'Physics lab', dueDate: '2099-01-01' })
    tasks.setFilter({ search: 'math' })
    expect(tasks.filteredTasks).toHaveLength(1)
    expect(tasks.filteredTasks[0].title).toBe('Math assignment')
  })

  it('counts overdue tasks in stats', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'Past', dueDate: '2000-01-01', status: 'pending' })
    tasks.addTask({ title: 'Future', dueDate: '2099-01-01', status: 'pending' })
    expect(tasks.stats.overdue).toBe(1)
  })

  it('persists tasks across init()', () => {
    const tasks = useTasksStore()
    tasks.addTask({ title: 'Persist me', dueDate: '2099-01-01' })
    const fresh = useTasksStore()
    fresh.tasks = []
    fresh.init()
    expect(fresh.tasks).toHaveLength(1)
    expect(fresh.tasks[0].title).toBe('Persist me')
  })
})