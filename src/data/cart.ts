
import { getYachtById, Yacht } from './yachts';

export interface CartItem {
  yachtId: string;
  yacht: Yacht;
  startDate: Date;
  days: number;
  price: number;
}

export interface OrderStatus {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  updatedAt: Date;
  comment?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  statusHistory: OrderStatus[];
  currentStatus: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

// Имитация хранилища заказов
let orders: Order[] = [];

// Локальное хранилище корзины
// В реальном приложении корзина может храниться в localStorage или Redux
let cart: CartItem[] = [];

// Функции для работы с корзиной
export const addToCart = (yachtId: string, startDate: Date, days: number): void => {
  const yacht = getYachtById(yachtId);
  
  if (!yacht) {
    throw new Error('Яхта не найдена');
  }
  
  // Проверяем, есть ли уже такая яхта в корзине
  const existingIndex = cart.findIndex(item => item.yachtId === yachtId);
  
  if (existingIndex !== -1) {
    // Если есть, обновляем даты и дни
    cart[existingIndex].startDate = startDate;
    cart[existingIndex].days = days;
    cart[existingIndex].price = yacht.pricePerDay * days;
  } else {
    // Если нет, добавляем новый элемент
    cart.push({
      yachtId,
      yacht,
      startDate,
      days,
      price: yacht.pricePerDay * days
    });
  }
};

export const removeFromCart = (yachtId: string): void => {
  cart = cart.filter(item => item.yachtId !== yachtId);
};

export const updateCartItem = (yachtId: string, startDate: Date, days: number): void => {
  const item = cart.find(item => item.yachtId === yachtId);
  
  if (item) {
    const yacht = getYachtById(yachtId);
    if (!yacht) return;
    
    item.startDate = startDate;
    item.days = days;
    item.price = yacht.pricePerDay * days;
  }
};

export const getCart = (): CartItem[] => {
  return [...cart];
};

export const clearCart = (): void => {
  cart = [];
};

export const getCartTotal = (): number => {
  return cart.reduce((total, item) => total + item.price, 0);
};

// Функции для работы с заказами
export const createOrder = (
  userId: string,
  contactInfo: { name: string; email: string; phone: string }
): Order => {
  const newOrder: Order = {
    id: `${orders.length + 1}`,
    userId,
    items: [...cart],
    totalPrice: getCartTotal(),
    createdAt: new Date(),
    statusHistory: [
      {
        status: 'pending',
        updatedAt: new Date(),
        comment: 'Заказ создан'
      }
    ],
    currentStatus: 'pending',
    contactInfo
  };
  
  orders.push(newOrder);
  clearCart(); // Очищаем корзину после создания заказа
  
  return newOrder;
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return orders.filter(order => order.userId === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  return orders.find(order => order.id === orderId);
};

export const updateOrderStatus = (
  orderId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  comment?: string
): Order | undefined => {
  const order = orders.find(order => order.id === orderId);
  
  if (order) {
    const statusUpdate: OrderStatus = {
      status,
      updatedAt: new Date(),
      comment
    };
    
    order.statusHistory.push(statusUpdate);
    order.currentStatus = status;
    
    return order;
  }
  
  return undefined;
};

export const getAllOrders = (): Order[] => {
  return [...orders];
};
