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

// Auth components
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const routes = [
  {
    path: '/',
    redirect: '/clients',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  // Clients routes
  {
    path: '/clients',
    name: 'clients',
    component: ClientsList,
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/new',
    name: 'client-create',
    component: ClientCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/:id',
    name: 'client-detail',
    component: ClientDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/:id/edit',
    name: 'client-edit',
    component: ClientEdit,
    meta: { requiresAuth: true },
  },
  // Articles routes
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesList,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/new',
    name: 'article-create',
    component: ArticleCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id',
    name: 'article-detail',
    component: ArticleDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id/edit',
    name: 'article-edit',
    component: ArticleEdit,
    meta: { requiresAuth: true },
  },
  // Orders routes
  {
    path: '/orders',
    name: 'orders',
    component: OrdersList,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/new',
    name: 'order-create',
    component: OrderCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: OrderDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id/edit',
    name: 'order-edit',
    component: OrderEdit,
    meta: { requiresAuth: true },
  },
  // Client Lists routes
  {
    path: '/client-lists',
    name: 'client-lists',
    component: ClientListsList,
    meta: { requiresAuth: true },
  },
  {
    path: '/client-lists/new',
    name: 'client-list-create',
    component: ClientListCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/client-lists/:id',
    name: 'client-list-detail',
    component: ClientListDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/client-lists/:id/edit',
    name: 'client-list-edit',
    component: ClientListEdit,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Simple Auth Guard
router.beforeEach((to, _, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/clients');
  } else {
    next();
  }
});

export default router;
