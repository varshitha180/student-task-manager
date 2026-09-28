<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Mobile sidebar toggle state.
const mobileOpen = ref(false)

function logout() {
  auth.logout()
  router.push('/login')
}

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 text-primary-700 font-bold text-lg">
          <span class="w-8 h-8 rounded-lg bg-primary-600 text-white grid place-items-center">STM</span>
          <span class="hidden sm:inline">Student Task Manager</span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink to="/" class="text-gray-700 hover:text-primary-600" active-class="text-primary-700 font-medium" exact>Dashboard</RouterLink>
          <RouterLink to="/about" class="text-gray-700 hover:text-primary-600" active-class="text-primary-700 font-medium">About</RouterLink>

          <template v-if="auth.isAuthenticated">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600">Hi, {{ auth.user?.name }}</span>
              <button @click="logout" class="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100">Logout</button>
            </div>
          </template>
          <template v-else>
            <RouterLink to="/login" class="text-gray-700 hover:text-primary-600">Login</RouterLink>
            <RouterLink to="/register" class="px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">Sign up</RouterLink>
          </template>
        </nav>

        <!-- Mobile hamburger -->
        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile overlay sidebar (Week 4 deliverable - responsive) -->
    <transition name="fade">
      <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-30">
        <div class="absolute inset-0 bg-black/40" @click="closeMobile"></div>
        <nav class="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col gap-4">
          <RouterLink to="/" @click="closeMobile" class="text-gray-700 hover:text-primary-600">Dashboard</RouterLink>
          <RouterLink to="/about" @click="closeMobile" class="text-gray-700 hover:text-primary-600">About</RouterLink>
          <hr />
          <template v-if="auth.isAuthenticated">
            <span class="text-sm text-gray-600">Hi, {{ auth.user?.name }}</span>
            <button @click="logout" class="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login" @click="closeMobile" class="text-gray-700">Login</RouterLink>
            <RouterLink to="/register" @click="closeMobile" class="px-4 py-1.5 bg-primary-600 text-white rounded-md text-center text-sm">Sign up</RouterLink>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>