<template>
  <div class="container mx-auto px-4 py-6 text-center">
    <h1 class="text-3xl font-bold mb-4">404 - Page non trouvée</h1>
    <p class="mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <AppButton variant="primary" @click="router.push('/')">
      Retour à l'accueil
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
</script>