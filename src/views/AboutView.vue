<script setup>
const stack = [
  { name: 'Vue 3', role: 'Frontend framework (Composition API, SFCs)' },
  { name: 'Vue Router', role: 'Page navigation + auth guards' },
  { name: 'Pinia', role: 'State management (auth + tasks stores)' },
  { name: 'Tailwind CSS', role: 'Utility-first styling, responsive design' },
  { name: 'Vitest + Vue Test Utils', role: 'Unit testing + coverage' },
  { name: 'Vite', role: 'Dev server + production bundler' },
  { name: 'Docker + Nginx', role: 'Containerized production deployment' },
  { name: 'GitHub Actions', role: 'CI/CD pipeline' },
]
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">About this project</h1>
      <p class="text-gray-600 mt-2">The Student Task Manager is a single-page application built to help students organize assignments, exams, and project deadlines in one place. It demonstrates a complete Vue 3 stack — from reactive UI to containerized deployment.</p>
    </div>

    <div>
      <h2 class="font-semibold text-gray-800 mb-2">Tech stack</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="t in stack" :key="t.name" class="bg-white p-3 rounded-md border border-gray-200">
          <p class="font-medium text-gray-900">{{ t.name }}</p>
          <p class="text-xs text-gray-500">{{ t.role }}</p>
        </div>
      </div>
    </div>

    <div>
      <h2 class="font-semibold text-gray-800 mb-2">Key features</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1 text-sm">
        <li>Email/password authentication with session persistence</li>
        <li>Protected dashboard route with navigation guards</li>
        <li>Full CRUD on tasks — create, edit, delete, cycle status</li>
        <li>Filtering by status, priority, and free-text search</li>
        <li>Sorting by due date, priority, or recency</li>
        <li>Overdue highlighting and stats dashboard</li>
        <li>Mobile-responsive: sidebar overlay, card-based layout on small screens</li>
        <li>Local persistence via localStorage (no backend required)</li>
      </ul>
    </div>
  </div>
</template>