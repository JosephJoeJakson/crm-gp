<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text   ">
        Articles
      </h1>
      <router-link
        to="/articles/new"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-teal-700 transition duration-300"
      >
        Add New Article
      </router-link>
    </div>

    <ErrorMessage v-if="articlesStore.error" :message="articlesStore.error" />
    <LoadingSpinner v-else-if="articlesStore.loading" />

    <div v-else class="table-container mt-8">
      <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-blue-600 to-teal-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SKU</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price HT</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cost</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="article in articlesStore.articles" :key="article.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{{ article.sku }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ article.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ article.priceHT.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ article.cost.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="article.stockQty > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                  {{ article.stockQty }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="article.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ article.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/articles/${article.id}`"
                    class="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </router-link>
                  <router-link
                    :to="`/articles/${article.id}/edit`"
                    class="px-3 py-1 text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteArticle(article.id)"
                    class="px-3 py-1 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useArticlesStore } from '@/stores/articles';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const articlesStore = useArticlesStore();

onMounted(() => {
  articlesStore.fetchArticles();
});

const deleteArticle = async (id: string) => {
  if (confirm('Are you sure you want to delete this article?')) {
    await articlesStore.deleteArticle(id);
  }
};
</script>
