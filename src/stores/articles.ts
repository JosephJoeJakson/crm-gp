import { defineStore } from 'pinia';
import type { Article, CreateArticleData, UpdateArticleData } from '@/types';

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getArticleById: (state) => (id: string) => {
      return state.articles.find(article => article.id === id);
    },
    activeArticles: (state) => {
      return state.articles.filter(article => article.active);
    },
    inStockArticles: (state) => {
      return state.articles.filter(article => article.stockQty > 0);
    },
  },

  actions: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.articles.length === 0) {
          this.articles = [
            {
              id: '1',
              sku: 'LAPTOP-001',
              name: 'Laptop Dell XPS 13',
              priceHT: 1200.00,
              cost: 800.00,
              tvaRate: 20,
              stockQty: 15,
              active: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '2',
              sku: 'MOUSE-001',
              name: 'Wireless Mouse',
              priceHT: 45.00,
              cost: 25.00,
              tvaRate: 20,
              stockQty: 50,
              active: true,
              createdAt: new Date('2024-01-02'),
              updatedAt: new Date('2024-01-02'),
            },
            {
              id: '3',
              sku: 'KEYBOARD-001',
              name: 'Mechanical Keyboard',
              priceHT: 120.00,
              cost: 70.00,
              tvaRate: 20,
              stockQty: 0,
              active: false,
              createdAt: new Date('2024-01-03'),
              updatedAt: new Date('2024-01-03'),
            },
          ];
        }
      } catch (error) {
        this.error = 'Failed to fetch articles';
      } finally {
        this.loading = false;
      }
    },

    async createArticle(data: CreateArticleData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newArticle: Article = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.articles.push(newArticle);
        return newArticle;
      } catch (error) {
        this.error = 'Failed to create article';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateArticle(id: string, data: UpdateArticleData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
          this.articles[index] = {
            ...this.articles[index],
            ...data,
            updatedAt: new Date(),
          };
          return this.articles[index];
        }
        throw new Error('Article not found');
      } catch (error) {
        this.error = 'Failed to update article';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteArticle(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
          this.articles.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Failed to delete article';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    decrementStock(articleId: string, quantity: number) {
      const article = this.articles.find(a => a.id === articleId);
      if (article && article.stockQty >= quantity) {
        article.stockQty -= quantity;
        article.updatedAt = new Date();
        return true;
      }
      return false;
    },

    incrementStock(articleId: string, quantity: number) {
      const article = this.articles.find(a => a.id === articleId);
      if (article) {
        article.stockQty += quantity;
        article.updatedAt = new Date();
      }
    },
  },
});