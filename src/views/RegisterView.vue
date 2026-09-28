<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validateEmail } from '../utils/validators'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const errors = reactive({ name: '', email: '', password: '', confirm: '' })
const serverError = ref('')
const loading = ref(false)

function validate() {
  errors.name = ''; errors.email = ''; errors.password = ''; errors.confirm = ''
  let ok = true
  if (form.name.trim().length < 2) { errors.name = 'Enter your name.'; ok = false }
  if (!validateEmail(form.email)) { errors.email = 'Enter a valid email.'; ok = false }
  if (form.password.length < 6) { errors.password = 'At least 6 characters.'; ok = false }
  if (form.password !== form.confirm) { errors.confirm = 'Passwords do not match.'; ok = false }
  return ok
}

async function onSubmit() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.register({ name: form.name, email: form.email, password: form.password })
    router.push('/')
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
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p class="text-sm text-gray-500 mb-6">Start managing your tasks today.</p>

      <div v-if="serverError" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">{{ serverError }}</div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" :class="{ 'border-red-400': errors.name }" placeholder="Your name" />
          <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" :class="{ 'border-red-400': errors.email }" placeholder="you@college.edu" />
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" :class="{ 'border-red-400': errors.password }" placeholder="••••••••" />
          <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input v-model="form.confirm" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none" :class="{ 'border-red-400': errors.confirm }" placeholder="••••••••" />
          <p v-if="errors.confirm" class="text-xs text-red-600 mt-1">{{ errors.confirm }}</p>
        </div>
        <button type="submit" :disabled="loading" class="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
          {{ loading ? 'Creating account...' : 'Sign up' }}
        </button>
      </form>

      <p class="text-sm text-gray-600 mt-6 text-center">
        Already have an account? <router-link to="/login" class="text-primary-600 hover:underline">Log in</router-link>
      </p>
    </div>
  </div>
</template>