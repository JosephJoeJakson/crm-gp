<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Welcome to Mini-CRM</h2>
      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700"
        >
          Login
        </button>
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-blue-600 hover:underline font-medium">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = () => {
  const stored = localStorage.getItem('user')
  if (stored) {
    const user = JSON.parse(stored)
    if (user.email === email.value && user.password === password.value) {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/clients')
    } else {
      error.value = 'Invalid credentials'
    }
  } else {
    error.value = 'User not found. Please register.'
  }
}
</script>
