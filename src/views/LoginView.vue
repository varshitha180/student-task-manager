<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validateEmail } from '../utils/validators'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const serverError = ref('')
const loading = ref(false)

function validate() {
  errors.email = ''
  errors.password = ''
  let ok = true
  if (!validateEmail(form.email)) { errors.email = 'Enter a valid email.'; ok = false }
  if (form.password.length < 6) { errors.password = 'Password must be at least 6 characters.'; ok = false }
  return ok
}

async function onSubmit() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.login({ email: form.email, password: form.password })
    // Redirect to where they were trying to go, or dashboard.
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    serverError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p class="text-sm text-gray-500 mb-6">Log in to manage your tasks.</p>

      <div v-if="serverError" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
        {{ serverError }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" :class="{ 'border-red-400': errors.email }" placeholder="you@college.edu" />
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" :class="{ 'border-red-400': errors.password }" placeholder="••••••••" />
          <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
        </div>
        <button type="submit" :disabled="loading" class="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
          {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="text-sm text-gray-600 mt-6 text-center">
        Don't have an account? <router-link to="/register" class="text-primary-600 hover:underline">Sign up</router-link>
      </p>
    </div>
  </div>
</template>