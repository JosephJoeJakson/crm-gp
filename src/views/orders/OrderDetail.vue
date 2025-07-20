<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Order Details
      </h1>
      <div class="space-x-3">
        <router-link
          :to="`/orders/${order?.id}/edit`"
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
        >
          Edit Order
        </router-link>
        <router-link
          to="/orders"
          class="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Back to List
        </router-link>
      </div>
    </div>

    <ErrorMessage v-if="ordersStore.error" :message="ordersStore.error" />
    <LoadingSpinner v-else-if="ordersStore.loading" />

    <div v-else-if="order" class="space-y-6">
      <!-- Order Header -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Order Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Order ID</dt>
                <dd class="text-sm text-gray-900 font-mono">#{{ order.id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Client</dt>
                <dd class="text-sm text-gray-900">{{ getClientName(order.clientId) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Date</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(order.createdAt) }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Totals</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Total HT</dt>
                <dd class="text-sm text-gray-900">€{{ order.totals.totalHT.toFixed(2) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total TVA</dt>
                <dd class="text-sm text-gray-900">€{{ order.totals.totalTVA.toFixed(2) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total TTC</dt>
                <dd class="text-sm text-gray-900 font-semibold">€{{ order.totals.totalTTC.toFixed(2) }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Profitability</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Total Cost</dt>
                <dd class="text-sm text-gray-900">€{{ order.totals.totalCost.toFixed(2) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total Margin</dt>
                <dd class="text-sm font-semibold" :class="order.totals.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                  €{{ order.totals.totalMargin.toFixed(2) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Order Lines -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium text-gray-900 mb-4">Order Lines</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-purple-600 to-pink-600">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Article</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Qty</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Unit Price HT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">TVA Rate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total HT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total TVA</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="line in order.lines" :key="line.id" class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getArticleName(line.articleId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ line.qty }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ line.unitPriceHT.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ line.tvaRate }}%</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ line.lineTotalHT.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ line.lineTotalTVA.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="line.lineMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                  €{{ line.lineMargin.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-500">Order not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import { useClientsStore } from '@/stores/clients';
import { useArticlesStore } from '@/stores/articles';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const ordersStore = useOrdersStore();
const clientsStore = useClientsStore();
const articlesStore = useArticlesStore();

const order = computed(() => {
  const id = route.params.id as string;
  return ordersStore.getOrderById(id);
});

onMounted(() => {
  if (ordersStore.orders.length === 0) {
    ordersStore.fetchOrders();
  }
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
  if (articlesStore.articles.length === 0) {
    articlesStore.fetchArticles();
  }
});

const getClientName = (clientId: string) => {
  const client = clientsStore.getClientById(clientId);
  return client ? client.name : 'Unknown Client';
};

const getArticleName = (articleId: string) => {
  const article = articlesStore.getArticleById(articleId);
  return article ? article.name : 'Unknown Article';
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};
</script>
