<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
        Create New Article
      </h1>
      <router-link
        to="/articles"
        class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
      >
        Back to List
      </router-link>
    </div>
    <ErrorMessage v-if="articlesStore.error" :message="articlesStore.error" />
    <div class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="sku" class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input
              type="text"
              id="sku"
              v-model="form.sku"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="form-group">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="form-group">
            <label for="priceHT" class="block text-sm font-medium text-gray-700 mb-1">Price HT *</label>
            <input
              type="number"
              id="priceHT"
              v-model.number="form.priceHT"
              step="0.01"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="form-group">
            <label for="cost" class="block text-sm font-medium text-gray-700 mb-1">Cost *</label>
            <input
              type="number"
              id="cost"
              v-model.number="form.cost"
              step="0.01"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="form-group">
            <label for="tvaRate" class="block text-sm font-medium text-gray-700 mb-1">TVA Rate (%) *</label>
            <input
              type="number"
              id="tvaRate"
              v-model.number="form.tvaRate"
              step="0.01"
              min="0"
              max="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="form-group">
            <label for="stockQty" class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
            <input
              type="number"
              id="stockQty"
              v-model.number="form.stockQty"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="form.active"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>
        <div class="flex justify-end space-x-3">
          <router-link
            to="/articles"
            class="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-teal-700 transition duration-300"
            :disabled="articlesStore.loading"
          >
            {{ articlesStore.loading ? 'Creating...' : 'Create Article' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useArticlesStore } from '@/stores/articles';
import ErrorMessage from '@/components/ErrorMessage.vue';
import type { CreateArticleData } from '@/types';

const router = useRouter();
const articlesStore = useArticlesStore();

const form = reactive<CreateArticleData>({
  sku: '',
  name: '',
  priceHT: 0,
  cost: 0,
  tvaRate: 20,
  stockQty: 0,
  active: true,
});

const handleSubmit = async () => {
  try {
    await articlesStore.createArticle(form);
    router.push('/articles');
  } catch (error) {
    console.error('Failed to create article:', error);
  }
};
</script>
