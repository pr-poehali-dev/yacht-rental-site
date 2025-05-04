
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

// Типы для финансовой аналитики
export interface YachtTypeRevenue {
  yachtType: string;
  revenue: number;
  bookingCount: number;
  percentFromTotal: number;
}

export interface SeasonalRevenue {
  season: 'winter' | 'spring' | 'summer' | 'autumn'; 
  revenue: number;
  bookingCount: number;
  percentChange: number; // Изменение по сравнению с предыдущим годом
}

export interface RevenueForecast {
  month: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface YearOverYear {
  year: number;
  revenue: number;
  percentChange: number;
}

// API для статистики и отчетов
export interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
  revenueByMonth: { month: string; value: number }[];
  popularYachts: { yachtId: string; yachtName: string; bookings: number }[];
  // Расширенные метрики для улучшенного дашборда
  averageBookingValue: number;
  conversionRate: number;
  repeatCustomerRate: number;
  bookingsByDayOfWeek: { day: string; value: number }[];
  topClients: { userId: string; userName: string; bookings: number; totalSpent: number }[];
  bookingDuration: { duration: string; count: number }[];
  // Новые метрики финансовой аналитики
  revenueByYachtType: YachtTypeRevenue[];
  seasonalRevenue: SeasonalRevenue[];
  revenueForecast: RevenueForecast[];
  yearOverYearComparison: YearOverYear[];
}

// Расписание для отчетов
export type ReportSchedule = 'daily' | 'weekly' | 'monthly' | 'quarterly';

// Тип для доставки отчета
export type ReportDelivery = 'email' | 'download' | 'dashboard';

// Интерфейс для шаблона отчета
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  category: 'financial' | 'operational' | 'marketing' | 'custom';
  isDefault: boolean;
  createdAt: Date;
}

// Интерфейс для пользовательского отчета
export interface CustomReport {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  filters: {
    dateFrom?: Date;
    dateTo?: Date;
    yachtIds?: string[];
    userIds?: string[];
    statuses?: string[];
  };
  createdAt: Date;
  lastRunAt?: Date;
  // Новые поля для планирования отчетов
  isScheduled?: boolean;
  schedule?: ReportSchedule;
  nextRunDate?: Date;
  deliveryMethod?: ReportDelivery;
  recipients?: string[]; // Email адреса получателей
  templateId?: string; // ID используемого шаблона
}

export const adminAnalyticsApi = {
  getBookingStats: async (dateFrom?: Date, dateTo?: Date, compareWithPrevPeriod: boolean = false): Promise<BookingStats | null> => {
    const response = await apiRequest<BookingStats>('/admin/analytics/bookings', { 
      method: 'GET',
      headers: {
        ...(dateFrom && { dateFrom: dateFrom.toISOString() }),
        ...(dateTo && { dateTo: dateTo.toISOString() }),
        compareWithPrevPeriod: compareWithPrevPeriod.toString()
      }
    });
    return response.success ? response.data : null;
  },
  
  // Получить список сохраненных пользовательских отчетов
  getSavedReports: async (): Promise<CustomReport[]> => {
    const response = await apiRequest<CustomReport[]>('/admin/analytics/reports', { 
      method: 'GET'
    });
    return response.success ? response.data : [];
  },
  
  // Создать новый пользовательский отчет
  createReport: async (reportData: Omit<CustomReport, 'id' | 'createdAt'>): Promise<CustomReport | null> => {
    const response = await apiRequest<CustomReport>('/admin/analytics/reports', {
      method: 'POST',
      body: reportData
    });
    return response.success ? response.data : null;
  },
  
  // Запустить пользовательский отчет
  runReport: async (reportId: string): Promise<any> => {
    const response = await apiRequest<any>(`/admin/analytics/reports/${reportId}/run`, {
      method: 'POST'
    });
    return response.success ? response.data : null;
  },

  // Получить список шаблонов отчетов
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await apiRequest<ReportTemplate[]>('/admin/analytics/templates', { 
      method: 'GET'
    });
    return response.success ? response.data : [];
  },

  // Создать шаблон отчета
  createReportTemplate: async (templateData: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<ReportTemplate | null> => {
    const response = await apiRequest<ReportTemplate>('/admin/analytics/templates', {
      method: 'POST',
      body: templateData
    });
    return response.success ? response.data : null;
  },

  // Добавить расписание к отчету
  scheduleReport: async (reportId: string, schedule: {
    frequency: ReportSchedule;
    deliveryMethod: ReportDelivery;
    recipients?: string[];
  }): Promise<CustomReport | null> => {
    const response = await apiRequest<CustomReport>(`/admin/analytics/reports/${reportId}/schedule`, {
      method: 'POST',
      body: schedule
    });
    return response.success ? response.data : null;
  },

  // Отправить отчет по email
  sendReportByEmail: async (reportId: string, recipients: string[]): Promise<boolean> => {
    const response = await apiRequest<{success: boolean}>(`/admin/analytics/reports/${reportId}/send`, {
      method: 'POST',
      body: { recipients }
    });
    return response.success && response.data.success;
  },

  // Получить данные сравнения с предыдущими периодами
  getComparisonData: async (dateFrom: Date, dateTo: Date, comparisonPeriod: 'year' | 'month' | 'week'): Promise<any> => {
    const response = await apiRequest<any>('/admin/analytics/comparison', {
      method: 'GET',
      headers: {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        comparisonPeriod
      }
    });
    return response.success ? response.data : null;
  },

  // Получить прогноз доходов
  getRevenueForecast: async (months: number = 3): Promise<RevenueForecast[]> => {
    const response = await apiRequest<RevenueForecast[]>('/admin/analytics/forecast', {
      method: 'GET',
      headers: {
        months: months.toString()
      }
    });
    return response.success ? response.data : [];
  }
};
