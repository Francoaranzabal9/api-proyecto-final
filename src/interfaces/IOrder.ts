export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface Buyer {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

export interface IOrder {
  buyer: Buyer;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_process';
  paymentId?: string;
  paymentMethod: 'card' | 'mp' | 'transfer';
  createdAt?: Date;
  updatedAt?: Date;
}
