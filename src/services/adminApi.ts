
import { User } from '@/data/users';
import { apiRequest } from './api';

// Типы для администрирования
export interface AdminUserFilters {
  role?: 'user' | 'admin' | 'all';
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// API для администрирования пользователей
export const adminUsersApi = {
  // Получить список пользователей с фильтрацией и пагинацией
  getUsers: async (
    filters?: AdminUserFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiRequest<User[]>('/admin/users', { 
      method: 'GET',
      headers: {
        ...(filters && { filters: JSON.stringify(filters) }),
        ...(pagination && { 
          page: pagination.page.toString(),
          limit: pagination.limit.toString()
        })
      }
    });

    // Имитация ответа с пагинацией (в реальном API это будет приходить с сервера)
    const mockUsers = response.data || [];
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const total = mockUsers.length;
    
    return {
      data: mockUsers.slice((page - 1) * limit, page * limit),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  // Получить пользователя по ID
  getUserById: async (id: string): Promise<User | null> => {
    const response = await apiRequest<User>(`/admin/users/${id}`, { method: 'GET' });
    return response.success ? response.data : null;
  },

  // Создать нового пользователя
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> => {
    const response = await apiRequest<User>('/admin/users', {
      method: 'POST',
      body: userData
    });
    return response.success ? response.data : null;
  },

  // Обновить данные пользователя
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const response = await apiRequest<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: userData
    });
    return response.success ? response.data : null;
  },

  // Удалить пользователя
  deleteUser: async (id: string): Promise<boolean> => {
    const response = await apiRequest<void>(`/admin/users/${id}`, { method: 'DELETE' });
    return response.success;
  }
};

// API для работы с отзывами
export interface Review {
  id: string;
  userId: string;
  userName: string;
  yachtId: string;
  yachtName: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

export const adminReviewsApi = {
  // Получить список отзывов (заглушка для будущей реализации)
  getReviews: async (): Promise<Review[]> => {
    const response = await apiRequest<Review[]>('/admin/reviews', { method: 'GET' });
    return response.success ? response.data : [];
  },

  // Обновить статус отзыва (заглушка для будущей реализации)
  updateReviewStatus: async (id: string, status: Review['status']): Promise<Review | null> => {
    const response = await apiRequest<Review>(`/admin/reviews/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
    return response.success ? response.data : null;
  }
};

// API для статистики и отчетов (заглушка для будущей реализации)
export interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
  revenueByMonth: { month: string; value: number }[];
  popularYachts: { yachtId: string; yachtName: string; bookings: number }[];
}

export const adminAnalyticsApi = {
  getBookingStats: async (dateFrom?: Date, dateTo?: Date): Promise<BookingStats | null> => {
    const response = await apiRequest<BookingStats>('/admin/analytics/bookings', { 
      method: 'GET',
      headers: {
        ...(dateFrom && { dateFrom: dateFrom.toISOString() }),
        ...(dateTo && { dateTo: dateTo.toISOString() })
      }
    });
    return response.success ? response.data : null;
  }
};
