<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-200 mt-12">
    <div class="container mx-auto px-4 py-6 max-w-6xl text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© {{ year }} Student Task Manager. Built with Vue 3 + Pinia + Tailwind.</p>
      <p class="text-xs">Internship project — v1.0</p>
    </div>
  </footer>
</template>