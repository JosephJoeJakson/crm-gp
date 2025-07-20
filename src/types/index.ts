export interface Client {
  id: string;
  name: string;
  status: 'Prospect' | 'Actif' | 'Inactif';
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  sku: string;
  name: string;
  priceHT: number;
  cost: number;
  tvaRate: number;
  stockQty: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderLine {
  id: string;
  articleId: string;
  qty: number;
  unitPriceHT: number;
  tvaRate: number;
  lineTotalHT: number;
  lineTotalTVA: number;
  lineCost: number;
  lineMargin: number;
}

export interface OrderTotals {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  totalCost: number;
  totalMargin: number;
}

export interface Order {
  id: string;
  clientId: string;
  createdAt: Date;
  lines: OrderLine[];
  totals: OrderTotals;
}

export interface ClientList {
  id: string;
  name: string;
  clientIds: string[];
  createdAt: Date;
}

export type CreateClientData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientData = Partial<CreateClientData>;

export type CreateArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateArticleData = Partial<CreateArticleData>;

export type CreateOrderData = Omit<Order, 'id' | 'createdAt' | 'totals'> & {
  lines: Omit<OrderLine, 'id' | 'lineTotalHT' | 'lineTotalTVA' | 'lineCost' | 'lineMargin'>[];
};
export type UpdateOrderData = Partial<CreateOrderData>;

export type CreateClientListData = Omit<ClientList, 'id' | 'createdAt'>;
export type UpdateClientListData = Partial<CreateClientListData>;