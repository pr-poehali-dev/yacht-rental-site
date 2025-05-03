
import { Yacht } from '@/data/yachts';
import { User } from '@/data/users';

// Базовый URL API (в реальном приложении заменить на фактический URL)
const API_BASE_URL = 'https://api.moreyacht.ru/v1';

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Тип для ответа API
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Конфигурация запроса
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

// Базовая функция для отправки запросов
async function apiRequest<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
  try {
    // Имитация обращения к API
    console.log(`API Request: ${config.method} ${endpoint}`, config.body);
    
    // Имитация задержки сети
    await delay(500);
    
    // Временное решение: возврат мокового ответа
    // В реальном приложении здесь будет fetch() запрос
    return {
      success: true,
      data: {} as T
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      data: {} as T,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}

// API для работы с яхтами
export const yachtApi = {
  // Получение списка всех яхт
  getAll: async (): Promise<ApiResponse<Yacht[]>> => {
    return apiRequest<Yacht[]>('/yachts', { method: 'GET' });
  },
  
  // Получение яхты по ID
  getById: async (id: string): Promise<ApiResponse<Yacht>> => {
    return apiRequest<Yacht>(`/yachts/${id}`, { method: 'GET' });
  },
  
  // Создание новой яхты
  create: async (yacht: Omit<Yacht, 'id'>): Promise<ApiResponse<Yacht>> => {
    return apiRequest<Yacht>('/yachts', {
      method: 'POST',
      body: yacht
    });
  },
  
  // Обновление яхты
  update: async (id: string, yacht: Partial<Yacht>): Promise<ApiResponse<Yacht>> => {
    return apiRequest<Yacht>(`/yachts/${id}`, {
      method: 'PUT',
      body: yacht
    });
  },
  
  // Удаление яхты
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/yachts/${id}`, { method: 'DELETE' });
  }
};

// API для работы с пользователями
export const userApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return apiRequest<User[]>('/users', { method: 'GET' });
  },
  
  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiRequest<User>(`/users/${id}`, { method: 'GET' });
  }
};

// API для работы с бронированиями
export interface Booking {
  id: string;
  yachtId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  additionalServices?: BookingService[];
  specialRequests?: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const bookingApi = {
  // Получение списка всех бронирований
  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/bookings', { method: 'GET' });
  },
  
  // Получение бронирования по ID
  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/bookings/${id}`, { method: 'GET' });
  },
  
  // Создание нового бронирования
  create: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: booking
    });
  },
  
  // Обновление статуса бронирования
  updateStatus: async (id: string, status: Booking['status']): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  },
  
  // Отмена бронирования
  cancel: async (id: string, reason?: string): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: { reason }
    });
  },
  
  // Получение доступных дат для бронирования яхты
  getAvailableDates: async (yachtId: string, month: number, year: number): Promise<ApiResponse<string[]>> => {
    return apiRequest<string[]>(`/yachts/${yachtId}/available-dates`, {
      method: 'GET',
      headers: {
        'month': month.toString(),
        'year': year.toString()
      }
    });
  }
};

// API для работы с дополнительными услугами
export const servicesApi = {
  // Получение списка всех дополнительных услуг
  getAll: async (): Promise<ApiResponse<BookingService[]>> => {
    return apiRequest<BookingService[]>('/services', { method: 'GET' });
  },
  
  // Получение услуги по ID
  getById: async (id: string): Promise<ApiResponse<BookingService>> => {
    return apiRequest<BookingService>(`/services/${id}`, { method: 'GET' });
  },
  
  // Создание новой услуги
  create: async (service: Omit<BookingService, 'id'>): Promise<ApiResponse<BookingService>> => {
    return apiRequest<BookingService>('/services', {
      method: 'POST',
      body: service
    });
  }
};
