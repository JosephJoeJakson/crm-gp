<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <main class="lg:ml-64 min-h-screen">
      <div class="p-4 lg:p-8 pt-16 lg:pt-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>