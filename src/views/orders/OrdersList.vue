<template>
  <div class="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Orders
      </h1>
      <router-link
        to="/orders/new"
        class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
      >
        Create New Order
      </router-link>
    </div>

    <ErrorMessage v-if="ordersStore.error" :message="ordersStore.error" />
    <LoadingSpinner v-else-if="ordersStore.loading" />

    <div v-else class="table-container mt-8">
      <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-purple-600 to-pink-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total HT</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total TTC</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Margin</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in ordersStore.orders" :key="order.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap font-mono text-sm font-medium text-gray-900">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getClientName(order.clientId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ order.totals.totalHT.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{{ order.totals.totalTTC.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="order.totals.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                  €{{ order.totals.totalMargin.toFixed(2) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/orders/${order.id}`"
                    class="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    View
                  </router-link>
                  <router-link
                    :to="`/orders/${order.id}/edit`"
                    class="px-3 py-1 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteOrder(order.id)"
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
import { useOrdersStore } from '@/stores/orders';
import { useClientsStore } from '@/stores/clients';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const ordersStore = useOrdersStore();
const clientsStore = useClientsStore();

onMounted(() => {
  ordersStore.fetchOrders();
  if (clientsStore.clients.length === 0) {
    clientsStore.fetchClients();
  }
});

const getClientName = (clientId: string) => {
  const client = clientsStore.getClientById(clientId);
  return client ? client.name : 'Unknown Client';
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const deleteOrder = async (id: string) => {
  if (confirm('Are you sure you want to delete this order? This will restore stock quantities.')) {
    await ordersStore.deleteOrder(id);
  }
};
</script>
