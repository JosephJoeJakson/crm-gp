<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Create New Order
      </h1>
      <router-link
        to="/orders"
        class="flex items-center px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </router-link>
    </div>

    <ErrorMessage v-if="ordersStore.error" :message="ordersStore.error" />

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Client Selection -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium text-gray-900 mb-4">Client Information</h3>
        <div class="form-group">
          <label for="clientId" class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select
            id="clientId"
            v-model="form.clientId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select a client</option>
            <option v-for="client in clientsStore.activeClients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Order Lines -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-gray-900">Order Lines</h3>
          <button
            type="button"
            @click="addLine"
            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
          >
            Add Line
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(line, index) in form.lines" :key="index" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="flex justify-between items-start mb-4">
              <h4 class="text-sm font-medium text-gray-700">Line {{ index + 1 }}</h4>
              <button
                type="button"
                @click="removeLine(index)"
                class="text-red-600 hover:text-red-900 text-sm font-bold"
                :disabled="form.lines.length === 1"
              >
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Article *</label>
                <select
                  v-model="line.articleId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  @change="updateLineFromArticle(index)"
                >
                  <option value="">Select article</option>
                  <option
                    v-for="article in articlesStore.activeArticles"
                    :key="article.id"
                    :value="article.id"
                    :disabled="article.stockQty === 0"
                  >
                    {{ article.name }} (Stock: {{ article.stockQty }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  v-model.number="line.qty"
                  min="1"
                  :max="getMaxQuantity(line.articleId)"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p v-if="line.articleId" class="text-xs text-gray-500 mt-1">
                  Max: {{ getMaxQuantity(line.articleId) }}
                </p>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price HT *</label>
                <input
                  type="number"
                  v-model.number="line.unitPriceHT"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">TVA Rate (%)</label>
                <input
                  type="number"
                  v-model.number="line.tvaRate"
                  step="0.01"
                  min="0"
                  max="100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  readonly
                />
              </div>
            </div>

            <div v-if="line.articleId && line.qty > 0" class="mt-4 p-3 bg-gray-100 rounded">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Total HT:</span>
                  <span class="font-medium ml-1">€{{ (line.qty * line.unitPriceHT).toFixed(2) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Total TVA:</span>
                  <span class="font-medium ml-1">€{{ (line.qty * line.unitPriceHT * line.tvaRate / 100).toFixed(2) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Total TTC:</span>
                  <span class="font-medium ml-1">€{{ (line.qty * line.unitPriceHT * (1 + line.tvaRate / 100)).toFixed(2) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Margin:</span>
                  <span class="font-medium ml-1">€{{ calculateLineMargin(line).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Totals -->
      <div v-if="hasValidLines" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium text-gray-900 mb-4">Order Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Total HT</dt>
            <dd class="text-lg font-semibold text-gray-900">€{{ orderTotals.totalHT.toFixed(2) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total TVA</dt>
            <dd class="text-lg font-semibold text-gray-900">€{{ orderTotals.totalTVA.toFixed(2) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total TTC</dt>
            <dd class="text-lg font-semibold text-gray-900">€{{ orderTotals.totalTTC.toFixed(2) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total Cost</dt>
            <dd class="text-lg font-semibold text-gray-900">€{{ orderTotals.totalCost.toFixed(2) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total Margin</dt>
            <dd class="text-lg font-semibold" :class="orderTotals.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'">
              €{{ orderTotals.totalMargin.toFixed(2) }}
            </dd>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <router-link
          to="/orders"
          class="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
          :disabled="ordersStore.loading || !isFormValid"
        >
          {{ ordersStore.loading ? 'Creating...' : 'Create Order' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import { useClientsStore } from '@/stores/clients';
import { useArticlesStore } from '@/stores/articles';
import ErrorMessage from '@/components/ErrorMessage.vue';
import type { CreateOrderData } from '@/types';

const router = useRouter();
const ordersStore = useOrdersStore();
const clientsStore = useClientsStore();
const articlesStore = useArticlesStore();

const form = reactive<CreateOrderData>({
  clientId: '',
  lines: [
    {
      articleId: '',
      qty: 1,
      unitPriceHT: 0,
      tvaRate: 20,
    }
  ]
});

onMounted(() => {
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
  if (articlesStore.articles.length === 0) {
    articlesStore.fetchArticles();
  }
});

const addLine = () => {
  form.lines.push({
    articleId: '',
    qty: 1,
    unitPriceHT: 0,
    tvaRate: 20,
  });
};

const removeLine = (index: number) => {
  if (form.lines.length > 1) {
    form.lines.splice(index, 1);
  }
};

const updateLineFromArticle = (index: number) => {
  const line = form.lines[index];
  const article = articlesStore.getArticleById(line.articleId);
  if (article) {
    line.unitPriceHT = article.priceHT;
    line.tvaRate = article.tvaRate;
    if (line.qty > article.stockQty) {
      line.qty = article.stockQty;
    }
  }
};

const getMaxQuantity = (articleId: string) => {
  const article = articlesStore.getArticleById(articleId);
  return article ? article.stockQty : 0;
};

const calculateLineMargin = (line: any) => {
  const article = articlesStore.getArticleById(line.articleId);
  if (!article) return 0;
  const lineTotalHT = line.qty * line.unitPriceHT;
  const lineCost = line.qty * article.cost;
  return lineTotalHT - lineCost;
};

const hasValidLines = computed(() => {
  return form.lines.some(line => line.articleId && line.qty > 0);
});

const orderTotals = computed(() => {
  let totalHT = 0;
  let totalTVA = 0;
  let totalCost = 0;

  form.lines.forEach(line => {
    if (line.articleId && line.qty > 0) {
      const lineTotalHT = line.qty * line.unitPriceHT;
      const lineTotalTVA = lineTotalHT * (line.tvaRate / 100);

      totalHT += lineTotalHT;
      totalTVA += lineTotalTVA;

      const article = articlesStore.getArticleById(line.articleId);
      if (article) {
        totalCost += line.qty * article.cost;
      }
    }
  });

  return {
    totalHT,
    totalTVA,
    totalTTC: totalHT + totalTVA,
    totalCost,
    totalMargin: totalHT - totalCost,
  };
});

const isFormValid = computed(() => {
  return form.clientId &&
         form.lines.length > 0 &&
         form.lines.every(line =>
           line.articleId &&
           line.qty > 0 &&
           line.qty <= getMaxQuantity(line.articleId) &&
           line.unitPriceHT > 0
         );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    await ordersStore.createOrder(form);
    router.push('/orders');
  } catch (error) {
    console.error('Failed to create order:', error);
  }
};
</script>
