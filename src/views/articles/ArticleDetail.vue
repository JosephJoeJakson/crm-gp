<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
        Article Details
      </h1>
      <div class="space-x-3">
        <router-link
          :to="`/articles/${article?.id}/edit`"
          class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Edit Article
        </router-link>
        <router-link
          to="/articles"
          class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Back to List
        </router-link>
      </div>
    </div>

    <ErrorMessage v-if="articlesStore.error" :message="articlesStore.error" />
    <LoadingSpinner v-else-if="articlesStore.loading" />

    <div v-else-if="article" class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Product Information</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">SKU</dt>
              <dd class="text-sm text-gray-900 font-mono">{{ article.sku }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="text-sm text-gray-900">{{ article.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="article.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ article.active ? 'Active' : 'Inactive' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Pricing & Stock</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Price HT</dt>
              <dd class="text-sm text-gray-900">€{{ article.priceHT.toFixed(2) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Cost</dt>
              <dd class="text-sm text-gray-900">€{{ article.cost.toFixed(2) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">TVA Rate</dt>
              <dd class="text-sm text-gray-900">{{ article.tvaRate }}%</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Stock Quantity</dt>
              <dd class="text-sm text-gray-900">{{ article.stockQty }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Margin</dt>
              <dd class="text-sm text-gray-900">€{{ (article.priceHT - article.cost).toFixed(2) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Metadata</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="text-sm text-gray-900">{{ formatDate(article.createdAt) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd class="text-sm text-gray-900">{{ formatDate(article.updatedAt) }}</dd>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-500">Article not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticlesStore } from '@/stores/articles';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const articlesStore = useArticlesStore();

const article = computed(() => {
  const id = route.params.id as string;
  return articlesStore.getArticleById(id);
});

onMounted(() => {
  if (articlesStore.articles.length === 0) {
    articlesStore.fetchArticles();
  }
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};
</script>
