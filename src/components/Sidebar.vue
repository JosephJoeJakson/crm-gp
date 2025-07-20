<template>
  <!-- Mobile backdrop -->
  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="closeMobileMenu"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-0 z-50 h-screen w-64 bg-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h1 class="text-2xl font-bold text-black">Mini-CRM</h1>
      <button
        @click="closeMobileMenu"
        class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        @click="closeMobileMenu"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.path) ? getActiveClass(item.name) : getInactiveClass(item.name)"
      >
        <span class="text-xl transition-transform group-hover:scale-110">{{ item.emoji }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>

  <!-- Mobile menu button -->
  <button
    @click="openMobileMenu"
    class="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const menuItems = [
  { name: 'Clients', path: '/clients', emoji: '📋' },
  { name: 'Articles', path: '/articles', emoji: '🖼' },
  { name: 'Orders', path: '/orders', emoji: '📦' },
  { name: 'Client Lists', path: '/client-lists', emoji: '🧾' },
];

const isActive = computed(() => (path: string) => {
  return route.path.startsWith(path);
});

const getActiveClass = (name: string) => {
  switch (name) {
    case 'Clients':
      return 'bg-gradient-to-r from-red-200 to-orange-200 text-red-800 border-r-4 border-red-600 shadow-md';
    case 'Articles':
      return 'bg-gradient-to-r from-blue-200 to-teal-200 text-blue-800 border-r-4 border-blue-600 shadow-md';
    case 'Orders':
      return 'bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 border-r-4 border-purple-600 shadow-md';
    case 'Client Lists':
      return 'bg-gradient-to-r from-yellow-200 to-green-200 text-yellow-800 border-r-4 border-yellow-600 shadow-md';
    default:
      return 'bg-gradient-to-r from-yellow-200 to-green-200 text-yellow-800 border-r-4 border-yellow-600 shadow-md';
  }
};

const getInactiveClass = (name: string) => {
  switch (name) {
    case 'Clients':
      return 'text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-800';
    case 'Articles':
      return 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-800';
    case 'Orders':
      return 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-800';
    case 'Client Lists':
      return 'text-gray-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-green-50 hover:text-yellow-800';
    default:
      return 'text-gray-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-green-50 hover:text-yellow-800';
  }
};

const openMobileMenu = () => {
  isMobileMenuOpen.value = true;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>
