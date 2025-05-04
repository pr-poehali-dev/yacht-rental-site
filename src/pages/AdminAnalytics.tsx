
import { useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminAnalytics, ReportMetric, availableMetrics } from '@/hooks/useAdminAnalytics';
import { CustomReport } from '@/services/adminApi';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  Loader2, 
  FilePdf, 
  FileDown,
  Plus,
  Save,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  CreditCard,
  Star,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Компонент карточки с информацией
const StatCard = ({ title, value, description, icon, colorClass }: { 
  title: string, 
  value: string | number, 
  description?: string,
  icon: React.ReactNode,
  colorClass?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-md p-2 ${colorClass || 'bg-primary/20'}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

// Цвета для графиков
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#9b87f5', '#7E69AB'];

const AdminAnalytics = () => {
  const { toast } = useToast();
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const { 
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
  } = useAdminAnalytics();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(filters.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(filters.dateTo);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Состояние для диалога создания отчета
  const [isCreateReportDialogOpen, setIsCreateReportDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const applyDateFilter = () => {
    if (dateFrom && dateTo) {
      updateFilters({ dateFrom, dateTo });
    }
  };

  const resetDateFilter = () => {
    const newDateFrom = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const newDateTo = new Date();
    setDateFrom(newDateFrom);
    setDateTo(newDateTo);
    updateFilters({ dateFrom: newDateFrom, dateTo: newDateTo });
  };

  const handleExportCSV = () => {
    const success = exportToCSV();
    if (!success) {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные в CSV",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Экспорт успешен",
        description: "Данные успешно экспортированы в CSV",
      });
    }
  };

  const handleExportPDF = async () => {
    if (!reportContainerRef.current) {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось найти данные для экспорта",
        variant: "destructive"
      });
      return;
    }
    
    const success = await exportToPDF('report-container', 'yacht-analytics');
    if (success) {
      toast({
        title: "Экспорт успешен",
        description: "Отчет успешно экспортирован в PDF",
      });
    } else {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные в PDF",
        variant: "destructive"
      });
    }
  };

  // Обработчик создания пользовательского отчета
  const handleCreateReport = async () => {
    if (!reportName || selectedMetrics.length === 0) {
      toast({
        title: "Ошибка",
        description: "Укажите название отчета и выберите хотя бы один показатель",
        variant: "destructive"
      });
      return;
    }

    const reportData: Omit<CustomReport, 'id' | 'createdAt'> = {
      name: reportName,
      description: reportDescription,
      metrics: selectedMetrics,
      filters: {
        dateFrom: dateFrom,
        dateTo: dateTo
      },
      lastRunAt: new Date()
    };

    const result = await createCustomReport(reportData);
    if (result.success) {
      toast({
        title: "Отчет создан",
        description: "Пользовательский отчет успешно сохранен",
      });
      setIsCreateReportDialogOpen(false);
      setReportName('');
      setReportDescription('');
      setSelectedMetrics([]);
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось создать отчет",
        variant: "destructive"
      });
    }
  };

  // Запуск сохраненного отчета
  const handleRunReport = async (reportId: string) => {
    const result = await runCustomReport(reportId);
    if (result.success) {
      toast({
        title: "Отчет выполнен",
        description: "Результаты доступны для просмотра",
      });
      // В реальном приложении здесь нужно обработать данные отчета
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось выполнить отчет",
        variant: "destructive"
      });
    }
  };

  // Форматирование денежных значений
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Обработчик выбора метрик для отчета
  const handleMetricToggle = (id: string) => {
    setSelectedMetrics(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(m => m !== id)
        : [...prevSelected, id]
    );
  };

  // Функция для группировки метрик по категориям
  const getMetricsByCategory = (category: ReportMetric['category']) => {
    return availableMetrics.filter(metric => metric.category === category);
  };

  const getIconForMetric = (metric: ReportMetric) => {
    switch (metric.category) {
      case 'financial':
        return <CreditCard className="h-4 w-4" />;
      case 'bookings':
        return <CalendarIcon className="h-4 w-4" />;
      case 'customers':
        return <Users className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Аналитика и отчёты</h1>
            <p className="text-muted-foreground">Просмотр статистики бронирований и доходов</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 pl-3 text-left font-normal">
                    {dateFrom ? (
                      format(dateFrom, 'dd.MM.yyyy', { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-muted-foreground">—</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 pl-3 text-left font-normal">
                    {dateTo ? (
                      format(dateTo, 'dd.MM.yyyy', { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={applyDateFilter} className="ml-2">Применить</Button>
              <Button variant="outline" onClick={resetDateFilter}>Сбросить</Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <FilePdf className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={() => setIsCreateReportDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Новый отчет
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {loading ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2 text-sm text-muted-foreground">Загрузка данных...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-8">
            <div className="flex items-center gap-2 text-destructive">
              <FileText className="h-5 w-5" />
              <p className="font-medium">Ошибка при загрузке данных</p>
            </div>
            <p className="mt-2 text-sm">{error}</p>
            <Button onClick={() => updateFilters(filters)} className="mt-4" variant="secondary">
              Попробовать снова
            </Button>
          </div>
        ) : !stats ? (
          <div className="rounded-md bg-muted p-8 text-center">
            <p>Нет данных для отображения</p>
          </div>
        ) : (
          <>
            <Tabs defaultValue="overview" className="w-full mb-6" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="financial">Финансы</TabsTrigger>
                <TabsTrigger value="bookings">Бронирования</TabsTrigger>
                <TabsTrigger value="customers">Клиенты</TabsTrigger>
                <TabsTrigger value="saved-reports">Сохраненные отчеты</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div id="report-container" ref={reportContainerRef}>
              {activeTab === 'overview' && (
                <>
                  {/* Основные показатели */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard 
                      title="Всего бронирований" 
                      value={stats.totalBookings} 
                      icon={<CalendarIcon className="h-4 w-4" />}
                      colorClass="bg-blue-100 text-blue-700"
                    />
                    <StatCard 
                      title="Выполнено" 
                      value={stats.completedBookings} 
                      description={`${Math.round((stats.completedBookings / stats.totalBookings) * 100)}% от общего числа`}
                      icon={<CalendarIcon className="h-4 w-4" />}
                      colorClass="bg-green-100 text-green-700"
                    />
                    <StatCard 
                      title="Отменено" 
                      value={stats.cancelledBookings} 
                      description={`${Math.round((stats.cancelledBookings / stats.totalBookings) * 100)}% от общего числа`}
                      icon={<CalendarIcon className="h-4 w-4" />}
                      colorClass="bg-red-100 text-red-700"
                    />
                    <StatCard 
                      title="Общая выручка" 
                      value={formatCurrency(stats.revenue)} 
                      description={`За период ${format(new Date(filters.dateFrom!), 'dd.MM.yyyy')} - ${format(new Date(filters.dateTo!), 'dd.MM.yyyy')}`}
                      icon={<CreditCard className="h-4 w-4" />}
                      colorClass="bg-purple-100 text-purple-700"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard 
                      title="Средний чек" 
                      value={formatCurrency(stats.averageBookingValue)} 
                      description="Средняя стоимость бронирования"
                      icon={<CreditCard className="h-4 w-4" />}
                      colorClass="bg-indigo-100 text-indigo-700"
                    />
                    <StatCard 
                      title="Конверсия" 
                      value={`${stats.conversionRate}%`} 
                      description="Процент посетителей, выполнивших бронирование"
                      icon={<LineChart className="h-4 w-4" />}
                      colorClass="bg-amber-100 text-amber-700"
                    />
                    <StatCard 
                      title="Повторные клиенты" 
                      value={`${stats.repeatCustomerRate}%`} 
                      description="Доля клиентов, вернувшихся для повторного бронирования"
                      icon={<Users className="h-4 w-4" />}
                      colorClass="bg-cyan-100 text-cyan-700"
                    />
                    <StatCard 
                      title="Загруженность" 
                      value={`${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`} 
                      description="Процент использования доступных временных слотов"
                      icon={<BarChart3 className="h-4 w-4" />}
                      colorClass="bg-emerald-100 text-emerald-700"
                    />
                  </div>

                  {/* Графики и диаграммы */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Динамика доходов по месяцам</CardTitle>
                        <CardDescription>
                          Общая сумма доходов от бронирований за выбранный период
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={stats.revenueByMonth}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [formatCurrency(value as number), 'Доход']}
                              />
                              <Legend />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                name="Доход" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.3}
                                activeDot={{ r: 8 }} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Распределение по дням недели</CardTitle>
                        <CardDescription>
                          Количество бронирований в разные дни недели
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={stats.bookingsByDayOfWeek}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="value" 
                                name="Кол-во бронирований" 
                                fill="#82ca9d" 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Статус бронирований</CardTitle>
                        <CardDescription>
                          Распределение бронирований по статусам
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Выполнено', value: stats.completedBookings },
                                  { name: 'Отменено', value: stats.cancelledBookings },
                                  { name: 'В процессе', value: stats.totalBookings - stats.completedBookings - stats.cancelledBookings }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[
                                  { name: 'Выполнено', value: stats.completedBookings },
                                  { name: 'Отменено', value: stats.cancelledBookings },
                                  { name: 'В процессе', value: stats.totalBookings - stats.completedBookings - stats.cancelledBookings }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} бронирований`, '']} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Длительность бронирований</CardTitle>
                        <CardDescription>
                          Распределение бронирований по длительности
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={stats.bookingDuration}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="duration" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="count" 
                                name="Количество" 
                                fill="#7E69AB" 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Динамика доходов</CardTitle>
                      <CardDescription>
                        Сравнение ежемесячной выручки за выбранный период
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={stats.revenueByMonth}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [formatCurrency(value as number), 'Доход']}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              name="Доход" 
                              stroke="#9b87f5" 
                              activeDot={{ r: 8 }} 
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Популярные яхты</CardTitle>
                      <CardDescription>
                        Рейтинг яхт по количеству бронирований
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.popularYachts}
                            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="yachtName"
                              tick={{ angle: -45, textAnchor: 'end', dominantBaseline: 'auto' }}
                              height={80}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="bookings" 
                              name="Кол-во бронирований" 
                              fill="#82ca9d" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Лучшие клиенты</CardTitle>
                      <CardDescription>
                        Клиенты с наибольшим количеством бронирований и расходами
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.topClients}
                            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis 
                              dataKey="userName" 
                              type="category"
                              width={150}
                            />
                            <Tooltip 
                              formatter={(value, name) => {
                                return name === 'totalSpent' 
                                  ? [formatCurrency(value as number), 'Потрачено'] 
                                  : [`${value} бронирований`, 'Бронирования'];
                              }}
                            />
                            <Legend />
                            <Bar 
                              dataKey="bookings" 
                              name="Бронирования" 
                              fill="#8884d8"
                              barSize={20} 
                            />
                            <Bar 
                              dataKey="totalSpent" 
                              name="Потрачено" 
                              fill="#82ca9d"
                              barSize={20} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'saved-reports' && (
                <div className="space-y-4">
                  {savedReports.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium">Сохраненных отчетов нет</h3>
                          <p className="text-sm text-muted-foreground mt-2">Создайте новый отчет, чтобы сохранить нужные вам метрики</p>
                          <Button className="mt-4" onClick={() => setIsCreateReportDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Создать отчет
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Сохраненные отчеты</h2>
                        <Button onClick={() => setIsCreateReportDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Создать отчет
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {savedReports.map((report) => (
                          <Card key={report.id}>
                            <CardHeader>
                              <CardTitle>{report.name}</CardTitle>
                              <CardDescription>{report.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    Период: {report.filters.dateFrom ? format(new Date(report.filters.dateFrom), 'dd.MM.yyyy') : 'Все время'} — 
                                    {report.filters.dateTo ? format(new Date(report.filters.dateTo), 'dd.MM.yyyy') : 'Текущая дата'}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>
                                    Последний запуск: {report.lastRunAt ? format(new Date(report.lastRunAt), 'dd.MM.yyyy HH:mm') : 'Никогда'}
                                  </span>
                                </div>
                                <div className="text-sm mt-2">
                                  <strong>Метрики:</strong> 
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {report.metrics.map((metricId) => {
                                      const metric = availableMetrics.find(m => m.id === metricId);
                                      return metric ? (
                                        <span 
                                          key={metricId} 
                                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium"
                                        >
                                          {getIconForMetric(metric)}
                                          <span className="ml-1">{metric.name}</span>
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={() => handleRunReport(report.id)}>
                                <LineChart className="mr-2 h-4 w-4" />
                                Запустить
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Экспорт
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Диалог создания отчета */}
      <Dialog open={isCreateReportDialogOpen} onOpenChange={setIsCreateReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Создать новый отчет</DialogTitle>
            <DialogDescription>
              Настройте показатели, которые хотите включить в отчет
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="report-name">Название отчета *</Label>
              <Input 
                id="report-name" 
                value={reportName} 
                onChange={(e) => setReportName(e.target.value)} 
                placeholder="Например: Ежемесячный отчет по доходам" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Описание</Label>
              <Input 
                id="report-description" 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)} 
                placeholder="Краткое описание отчета" 
              />
            </div>

            <div className="space-y-2">
              <Label>Период отчета</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 pl-3 text-left font-normal">
                      {dateFrom ? (
                        format(dateFrom, 'dd.MM.yyyy', { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-sm text-muted-foreground">—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 pl-3 text-left font-normal">
                      {dateTo ? (
                        format(dateTo, 'dd.MM.yyyy', { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Выберите показатели для отчета *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Отметьте метрики, которые хотите включить в отчет
              </p>
              
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="financial">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Финансовые показатели</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {getMetricsByCategory('financial').map((metric) => (
                        <div key={metric.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`metric-${metric.id}`} 
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`metric-${metric.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {metric.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="bookings">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Показатели бронирований</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {getMetricsByCategory('bookings').map((metric) => (
                        <div key={metric.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`metric-${metric.id}`} 
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`metric-${metric.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {metric.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="customers">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Показатели клиентов</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {getMetricsByCategory('customers').map((metric) => (
                        <div key={metric.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`metric-${metric.id}`} 
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`metric-${metric.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {metric.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateReportDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleCreateReport} 
              disabled={!reportName || selectedMetrics.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить отчет
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAnalytics;
