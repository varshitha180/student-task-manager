<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTasksStore } from './stores/tasks'

const auth = useAuthStore()
const tasks = useTasksStore()

// On app mount, restore session + load tasks from localStorage.
onMounted(() => {
  auth.init()
  tasks.init()
})
</script>

<template>
  <router-view />
</template>