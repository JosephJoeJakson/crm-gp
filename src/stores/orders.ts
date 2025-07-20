import { defineStore } from 'pinia';
import type { Order, CreateOrderData, UpdateOrderData, OrderLine, OrderTotals } from '@/types';
import { useArticlesStore } from './articles';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getOrderById: (state) => (id: string) => {
      return state.orders.find(order => order.id === id);
    },
    getOrdersByClientId: (state) => (clientId: string) => {
      return state.orders.filter(order => order.clientId === clientId);
    },
  },

  actions: {
    calculateLineValues(line: Omit<OrderLine, 'id' | 'lineTotalHT' | 'lineTotalTVA' | 'lineCost' | 'lineMargin'>, articleCost: number): OrderLine {
      const lineTotalHT = line.qty * line.unitPriceHT;
      const lineTotalTVA = lineTotalHT * (line.tvaRate / 100);
      const lineCost = line.qty * articleCost;
      const lineMargin = lineTotalHT - lineCost;

      return {
        ...line,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        lineTotalHT,
        lineTotalTVA,
        lineCost,
        lineMargin,
      };
    },

    calculateOrderTotals(lines: OrderLine[]): OrderTotals {
      const totalHT = lines.reduce((sum, line) => sum + line.lineTotalHT, 0);
      const totalTVA = lines.reduce((sum, line) => sum + line.lineTotalTVA, 0);
      const totalTTC = totalHT + totalTVA;
      const totalCost = lines.reduce((sum, line) => sum + line.lineCost, 0);
      const totalMargin = totalHT - totalCost;

      return {
        totalHT,
        totalTVA,
        totalTTC,
        totalCost,
        totalMargin,
      };
    },

    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.orders.length === 0) {
          this.orders = [
            {
              id: '1',
              clientId: '1',
              createdAt: new Date('2024-01-15'),
              lines: [
                {
                  id: 'line1',
                  articleId: '1',
                  qty: 2,
                  unitPriceHT: 1200.00,
                  tvaRate: 20,
                  lineTotalHT: 2400.00,
                  lineTotalTVA: 480.00,
                  lineCost: 1600.00,
                  lineMargin: 800.00,
                },
                {
                  id: 'line2',
                  articleId: '2',
                  qty: 5,
                  unitPriceHT: 45.00,
                  tvaRate: 20,
                  lineTotalHT: 225.00,
                  lineTotalTVA: 45.00,
                  lineCost: 125.00,
                  lineMargin: 100.00,
                },
              ],
              totals: {
                totalHT: 2625.00,
                totalTVA: 525.00,
                totalTTC: 3150.00,
                totalCost: 1725.00,
                totalMargin: 900.00,
              },
            },
          ];
        }
      } catch (error) {
        this.error = 'Failed to fetch orders';
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data: CreateOrderData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const articlesStore = useArticlesStore();
        
        // Check stock availability for all lines
        for (const line of data.lines) {
          const article = articlesStore.getArticleById(line.articleId);
          if (!article) {
            throw new Error(`Article not found: ${line.articleId}`);
          }
          if (article.stockQty < line.qty) {
            throw new Error(`Insufficient stock for ${article.name}. Available: ${article.stockQty}, Required: ${line.qty}`);
          }
        }

        // Calculate line values and totals
        const processedLines: OrderLine[] = [];
        for (const line of data.lines) {
          const article = articlesStore.getArticleById(line.articleId)!;
          const processedLine = this.calculateLineValues(line, article.cost);
          processedLines.push(processedLine);
        }

        const totals = this.calculateOrderTotals(processedLines);

        const newOrder: Order = {
          id: Date.now().toString(),
          clientId: data.clientId,
          createdAt: new Date(),
          lines: processedLines,
          totals,
        };

        // Decrement stock for all articles
        for (const line of processedLines) {
          articlesStore.decrementStock(line.articleId, line.qty);
        }

        this.orders.push(newOrder);
        return newOrder;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create order';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id: string, data: UpdateOrderData) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.orders.findIndex(order => order.id === id);
        if (index !== -1) {
          const existingOrder = this.orders[index];
          const articlesStore = useArticlesStore();

          // Restore stock from existing order
          for (const line of existingOrder.lines) {
            articlesStore.incrementStock(line.articleId, line.qty);
          }

          // Process new lines if provided
          let processedLines = existingOrder.lines;
          if (data.lines) {
            // Check stock availability for new lines
            for (const line of data.lines) {
              const article = articlesStore.getArticleById(line.articleId);
              if (!article) {
                throw new Error(`Article not found: ${line.articleId}`);
              }
              if (article.stockQty < line.qty) {
                throw new Error(`Insufficient stock for ${article.name}. Available: ${article.stockQty}, Required: ${line.qty}`);
              }
            }

            processedLines = [];
            for (const line of data.lines) {
              const article = articlesStore.getArticleById(line.articleId)!;
              const processedLine = this.calculateLineValues(line, article.cost);
              processedLines.push(processedLine);
            }

            // Decrement stock for new lines
            for (const line of processedLines) {
              articlesStore.decrementStock(line.articleId, line.qty);
            }
          }

          const totals = this.calculateOrderTotals(processedLines);

          this.orders[index] = {
            ...existingOrder,
            ...data,
            lines: processedLines,
            totals,
          };
          
          return this.orders[index];
        }
        throw new Error('Order not found');
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update order';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = this.orders.findIndex(order => order.id === id);
        if (index !== -1) {
          const order = this.orders[index];
          const articlesStore = useArticlesStore();
          
          // Restore stock for all lines
          for (const line of order.lines) {
            articlesStore.incrementStock(line.articleId, line.qty);
          }
          
          this.orders.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Failed to delete order';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});