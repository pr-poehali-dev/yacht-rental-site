
import { useState, useEffect, useCallback } from 'react';
import { adminAnalyticsApi, BookingStats, CustomReport } from '@/services/adminApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AnalyticsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  metrics?: string[];
}

export interface ReportMetric {
  id: string;
  name: string;
  category: 'financial' | 'bookings' | 'customers';
  description: string;
}

export const availableMetrics: ReportMetric[] = [
  { id: 'totalBookings', name: 'Всего бронирований', category: 'bookings', description: 'Общее количество бронирований за период' },
  { id: 'completedBookings', name: 'Выполненные бронирования', category: 'bookings', description: 'Количество успешно выполненных бронирований' },
  { id: 'cancelledBookings', name: 'Отмененные бронирования', category: 'bookings', description: 'Количество отмененных бронирований' },
  { id: 'revenue', name: 'Общая выручка', category: 'financial', description: 'Сумма всех платежей за бронирования' },
  { id: 'averageBookingValue', name: 'Средняя стоимость бронирования', category: 'financial', description: 'Средняя стоимость одного бронирования' },
  { id: 'conversionRate', name: 'Конверсия', category: 'bookings', description: 'Процент посетителей, совершивших бронирование' },
  { id: 'repeatCustomerRate', name: 'Процент повторных клиентов', category: 'customers', description: 'Доля клиентов, сделавших более одного бронирования' },
  { id: 'revenueByMonth', name: 'Доходы по месяцам', category: 'financial', description: 'График доходов в разбивке по месяцам' },
  { id: 'popularYachts', name: 'Популярные яхты', category: 'bookings', description: 'Рейтинг яхт по количеству бронирований' },
  { id: 'bookingsByDayOfWeek', name: 'Бронирования по дням недели', category: 'bookings', description: 'Распределение бронирований по дням недели' },
  { id: 'topClients', name: 'Лучшие клиенты', category: 'customers', description: 'Список клиентов с наибольшим количеством бронирований' },
  { id: 'bookingDuration', name: 'Длительность бронирований', category: 'bookings', description: 'Распределение бронирований по длительности' }
];

export function useAdminAnalytics() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [savedReports, setSavedReports] = useState<CustomReport[]>([]);
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

  const fetchSavedReports = useCallback(async () => {
    try {
      const reports = await adminAnalyticsApi.getSavedReports();
      setSavedReports(reports);
    } catch (err) {
      console.error('Ошибка при загрузке сохраненных отчетов:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSavedReports();
  }, [fetchStats, fetchSavedReports]);

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
      ['Общая выручка', stats.revenue],
      ['Средняя стоимость бронирования', stats.averageBookingValue],
      ['Конверсия', stats.conversionRate],
      ['Процент повторных клиентов', stats.repeatCustomerRate]
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

  // Функция для экспорта данных в PDF
  const exportToPDF = async (elementId: string, filename: string = 'analytics-report') => {
    if (!stats) return null;
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Элемент с ID ${elementId} не найден`);
        return null;
      }
      
      // Создаем canvas из HTML-элемента
      const canvas = await html2canvas(element, {
        scale: 2, // Повышенное качество
        logging: false,
        useCORS: true // Разрешаем загрузку изображений с других доменов
      });
      
      // Создаем PDF в формате A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Размеры страницы A4 в мм
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Соотношение сторон canvas
      const aspectRatio = canvas.width / canvas.height;
      
      // Вычисляем размеры для сохранения соотношения сторон
      let imgWidth = pdfWidth - 20; // Отступы по 10мм с каждой стороны
      let imgHeight = imgWidth / aspectRatio;
      
      // Если изображение получается больше страницы, уменьшаем высоту
      if (imgHeight > pdfHeight - 20) {
        imgHeight = pdfHeight - 20;
        imgWidth = imgHeight * aspectRatio;
      }
      
      // Вычисляем отступы для центрирования
      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = 10; // Отступ сверху
      
      // Добавляем заголовок отчета
      pdf.setFontSize(16);
      pdf.text('Аналитический отчет по бронированиям яхт', xOffset, yOffset);
      
      // Добавляем период отчета
      pdf.setFontSize(12);
      const periodText = `Период: ${filters.dateFrom?.toLocaleDateString('ru-RU')} - ${filters.dateTo?.toLocaleDateString('ru-RU')}`;
      pdf.text(periodText, xOffset, yOffset + 10);
      
      // Добавляем изображение с графиками
      pdf.addImage(imgData, 'PNG', xOffset, yOffset + 15, imgWidth, imgHeight);
      
      // Добавляем дату создания отчета
      pdf.setFontSize(10);
      const dateText = `Отчет сформирован: ${new Date().toLocaleString('ru-RU')}`;
      pdf.text(dateText, xOffset, pdfHeight - 10);
      
      // Сохраняем PDF-файл
      pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (err) {
      console.error('Ошибка при создании PDF:', err);
      return null;
    }
  };

  // Создание пользовательского отчета
  const createCustomReport = async (reportData: Omit<CustomReport, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newReport = await adminAnalyticsApi.createReport(reportData);
      if (newReport) {
        await fetchSavedReports();
        return { success: true, report: newReport };
      }
      return { success: false, error: 'Не удалось создать отчет' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Запуск сохраненного отчета
  const runCustomReport = async (reportId: string) => {
    setLoading(true);
    try {
      const reportData = await adminAnalyticsApi.runReport(reportId);
      if (reportData) {
        return { success: true, data: reportData };
      }
      return { success: false, error: 'Не удалось запустить отчет' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    savedReports,
    loading,
    error,
    filters,
    updateFilters,
    exportToCSV,
    exportToPDF,
    createCustomReport,
    runCustomReport,
    availableMetrics
  };
}
