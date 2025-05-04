
import { useState, useEffect, useCallback } from 'react';
import { adminAnalyticsApi, BookingStats } from '@/services/adminApi';

interface AnalyticsFilters {
  dateFrom?: Date;
  dateTo?: Date;
}

export function useAdminAnalytics() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)), // По умолчанию данные за последний месяц
    dateTo: new Date(),
  });

  const fetchStats = useCallback(async (newFilters?: AnalyticsFilters) => {
    setLoading(true);
    setError(null);

    try {
      const currentFilters = newFilters || filters;
      const response = await adminAnalyticsApi.getBookingStats(
        currentFilters.dateFrom,
        currentFilters.dateTo
      );

      if (response) {
        setStats(response);
      } else {
        setError('Не удалось загрузить статистику');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных аналитики');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
    fetchStats(newFilters);
  };

  // Функция для экспорта данных в CSV
  const exportToCSV = () => {
    if (!stats) return null;
    
    // Создаем заголовки для CSV
    const headers = [
      'Показатель',
      'Значение'
    ].join(',');
    
    // Создаем строки данных
    const rows = [
      ['Всего бронирований', stats.totalBookings],
      ['Выполнено бронирований', stats.completedBookings],
      ['Отменено бронирований', stats.cancelledBookings],
      ['Общая выручка', stats.revenue]
    ].map(row => row.join(','));
    
    // Добавляем данные по месяцам
    const monthRows = stats.revenueByMonth.map(item => 
      [`Выручка за ${item.month}`, item.value].join(',')
    );
    
    // Объединяем все данные
    const csvContent = [headers, ...rows, ...monthRows].join('\n');
    
    // Создаем ссылку для скачивания
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yacht-stats-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Запускаем скачивание
    link.click();
    document.body.removeChild(link);
    
    return true;
  };

  return {
    stats,
    loading,
    error,
    filters,
    updateFilters,
    exportToCSV
  };
}
