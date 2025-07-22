<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
      <form @submit.prevent="register" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:from-green-500 hover:to-green-700"
        >
          Register
        </button>
        <p v-if="message" class="text-green-600 text-sm text-center">{{ message }}</p>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:underline font-medium">Login</router-link>
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
const message = ref('')
const router = useRouter()

const register = () => {
  localStorage.setItem('user', JSON.stringify({ email: email.value, password: password.value }))
  message.value = 'Registered! Redirecting to login...'
  setTimeout(() => {
    router.push('/login')
  }, 1500)
}
</script>
