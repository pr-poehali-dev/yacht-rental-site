
import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
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
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Download, FileText, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

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
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const AdminAnalytics = () => {
  const { stats, loading, error, filters, updateFilters, exportToCSV } = useAdminAnalytics();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(filters.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(filters.dateTo);

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

  const handleExport = () => {
    const success = exportToCSV();
    if (!success) {
      // Можно добавить уведомление об ошибке
      console.error('Ошибка при экспорте данных');
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
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Экспорт CSV
            </Button>
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
                icon={<CalendarIcon className="h-4 w-4" />}
                colorClass="bg-purple-100 text-purple-700"
              />
            </div>

            {/* Графики и диаграммы */}
            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Доходы</TabsTrigger>
                <TabsTrigger value="bookings">Бронирования</TabsTrigger>
                <TabsTrigger value="yachts">Популярные яхты</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue">
                <Card>
                  <CardHeader>
                    <CardTitle>Динамика доходов по месяцам</CardTitle>
                    <CardDescription>
                      Общая сумма доходов от бронирований за выбранный период
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
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
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Суммы указаны в рублях и включают все успешные бронирования
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Статус бронирований</CardTitle>
                    <CardDescription>
                      Распределение бронирований по статусам
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
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
                            outerRadius={150}
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
              </TabsContent>
              
              <TabsContent value="yachts">
                <Card>
                  <CardHeader>
                    <CardTitle>Популярные яхты</CardTitle>
                    <CardDescription>
                      Рейтинг самых востребованных яхт по количеству бронирований
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
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
