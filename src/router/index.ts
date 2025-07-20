import { createRouter, createWebHistory } from 'vue-router';

// Client components
import ClientsList from '@/views/clients/ClientsList.vue';
import ClientDetail from '@/views/clients/ClientDetail.vue';
import ClientCreate from '@/views/clients/ClientCreate.vue';
import ClientEdit from '@/views/clients/ClientEdit.vue';

// Article components
import ArticlesList from '@/views/articles/ArticlesList.vue';
import ArticleDetail from '@/views/articles/ArticleDetail.vue';
import ArticleCreate from '@/views/articles/ArticleCreate.vue';
import ArticleEdit from '@/views/articles/ArticleEdit.vue';

// Order components
import OrdersList from '@/views/orders/OrdersList.vue';
import OrderDetail from '@/views/orders/OrderDetail.vue';
import OrderCreate from '@/views/orders/OrderCreate.vue';
import OrderEdit from '@/views/orders/OrderEdit.vue';

// Client List components
import ClientListsList from '@/views/client-lists/ClientListsList.vue';
import ClientListDetail from '@/views/client-lists/ClientListDetail.vue';
import ClientListCreate from '@/views/client-lists/ClientListCreate.vue';
import ClientListEdit from '@/views/client-lists/ClientListEdit.vue';

const routes = [
  {
    path: '/',
    redirect: '/clients',
  },
  // Clients routes
  {
    path: '/clients',
    name: 'clients',
    component: ClientsList,
  },
  {
    path: '/clients/new',
    name: 'client-create',
    component: ClientCreate,
  },
  {
    path: '/clients/:id',
    name: 'client-detail',
    component: ClientDetail,
  },
  {
    path: '/clients/:id/edit',
    name: 'client-edit',
    component: ClientEdit,
  },
  // Articles routes
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesList,
  },
  {
    path: '/articles/new',
    name: 'article-create',
    component: ArticleCreate,
  },
  {
    path: '/articles/:id',
    name: 'article-detail',
    component: ArticleDetail,
  },
  {
    path: '/articles/:id/edit',
    name: 'article-edit',
    component: ArticleEdit,
  },
  // Orders routes
  {
    path: '/orders',
    name: 'orders',
    component: OrdersList,
  },
  {
    path: '/orders/new',
    name: 'order-create',
    component: OrderCreate,
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: OrderDetail,
  },
  {
    path: '/orders/:id/edit',
    name: 'order-edit',
    component: OrderEdit,
  },
  // Client Lists routes
  {
    path: '/client-lists',
    name: 'client-lists',
    component: ClientListsList,
  },
  {
    path: '/client-lists/new',
    name: 'client-list-create',
    component: ClientListCreate,
  },
  {
    path: '/client-lists/:id',
    name: 'client-list-detail',
    component: ClientListDetail,
  },
  {
    path: '/client-lists/:id/edit',
    name: 'client-list-edit',
    component: ClientListEdit,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;