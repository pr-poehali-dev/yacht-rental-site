
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking, bookingApi } from '@/services/api';
import { 
  Search, 
  Calendar, 
  RefreshCw, 
  Eye, 
  Check, 
  X, 
  FileText, 
  ArrowUpDown, 
  Ban
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getYachtById } from '@/data/yachts';
import { getUserById } from '@/data/users';

// Мок-данные для бронирований до полной интеграции с API
const mockBookings: Booking[] = [
  {
    id: '1',
    yachtId: '1',
    userId: '1',
    startDate: '2025-05-10',
    endDate: '2025-05-15',
    totalPrice: 125000,
    status: 'confirmed',
    createdAt: '2025-05-01T12:00:00Z',
    updatedAt: '2025-05-01T14:30:00Z',
    specialRequests: 'Нужен дополнительный инвентарь для рыбалки'
  },
  {
    id: '2',
    yachtId: '3',
    userId: '2',
    startDate: '2025-05-20',
    endDate: '2025-05-22',
    totalPrice: 70000,
    status: 'pending',
    createdAt: '2025-05-02T10:15:00Z',
    updatedAt: '2025-05-02T10:15:00Z',
    additionalServices: [
      { id: '1', name: 'Капитан', price: 5000, description: 'Услуги капитана на весь период аренды' },
      { id: '2', name: 'Питание', price: 3000, description: 'Трехразовое питание на борту' }
    ]
  },
  {
    id: '3',
    yachtId: '5',
    userId: '3',
    startDate: '2025-05-15',
    endDate: '2025-05-18',
    totalPrice: 195000,
    status: 'completed',
    createdAt: '2025-04-25T16:40:00Z',
    updatedAt: '2025-05-19T10:00:00Z'
  },
  {
    id: '4',
    yachtId: '2',
    userId: '4',
    startDate: '2025-06-01',
    endDate: '2025-06-05',
    totalPrice: 160000,
    status: 'cancelled',
    createdAt: '2025-04-30T09:20:00Z',
    updatedAt: '2025-05-02T11:30:00Z',
    specialRequests: 'Отмена по личным обстоятельствам'
  }
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Booking>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь будет запрос к API через bookingApi.getAll()
        // const response = await bookingApi.getAll();
        // if (response.success) {
        //   setBookings(response.data);
        // }
        
        // Имитация задержки запроса
        await new Promise(resolve => setTimeout(resolve, 800));
        setBookings(mockBookings);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Обновление статуса бронирования
  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    try {
      setLoading(true);
      // В реальном приложении здесь будет запрос к API
      // const response = await bookingApi.updateStatus(id, newStatus);
      // if (response.success) {
      //   setBookings(prev => prev.map(booking => booking.id === id ? {...booking, status: newStatus, updatedAt: new Date().toISOString()} : booking));
      // }
      
      // Имитация обновления
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings(prev => prev.map(booking => 
        booking.id === id ? {...booking, status: newStatus, updatedAt: new Date().toISOString()} : booking
      ));
      
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация и сортировка бронирований
  const filteredAndSortedBookings = bookings
    .filter(booking => {
      // Фильтр по статусу
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }
      
      // Поиск по ID яхты, ID пользователя или ID бронирования
      if (searchTerm) {
        const yacht = getYachtById(booking.yachtId);
        const user = getUserById(booking.userId);
        
        return (
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (yacht && yacht.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Сортировка по выбранному полю
      if (sortBy === 'totalPrice') {
        return sortDirection === 'asc' 
          ? a.totalPrice - b.totalPrice 
          : b.totalPrice - a.totalPrice;
      }
      
      // Сортировка по дате
      const dateA = new Date(sortBy === 'startDate' ? a.startDate : a.createdAt);
      const dateB = new Date(sortBy === 'startDate' ? b.startDate : b.createdAt);
      
      return sortDirection === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });

  // Функция для отображения статуса с соответствующим цветом
  const renderStatusBadge = (status: Booking['status']) => {
    const statusConfig = {
      pending: { label: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Подтверждено', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Завершено', color: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Переключение направления сортировки
  const toggleSort = (column: keyof Booking) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <AdminLayout title="Управление бронированиями">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Бронирования</CardTitle>
              <CardDescription>
                Управление бронированиями яхт и дополнительными услугами
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setBookings(mockBookings)} variant="outline" disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Обновить
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Поиск бронирований..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-lg text-gray-500">Загрузка...</span>
              </div>
            ) : (
              <>
                {filteredAndSortedBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Бронирования не найдены</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Яхта</TableHead>
                          <TableHead>Клиент</TableHead>
                          <TableHead onClick={() => toggleSort('startDate')} className="cursor-pointer">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Даты
                              <ArrowUpDown className="h-4 w-4 ml-1" />
                            </div>
                          </TableHead>
                          <TableHead onClick={() => toggleSort('totalPrice')} className="cursor-pointer">
                            <div className="flex items-center">
                              Сумма
                              <ArrowUpDown className="h-4 w-4 ml-1" />
                            </div>
                          </TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead onClick={() => toggleSort('createdAt')} className="cursor-pointer">
                            <div className="flex items-center">
                              Создано
                              <ArrowUpDown className="h-4 w-4 ml-1" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedBookings.map((booking) => {
                          const yacht = getYachtById(booking.yachtId);
                          const user = getUserById(booking.userId);
                          
                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.id}</TableCell>
                              <TableCell>{yacht ? yacht.name : `Яхта ID: ${booking.yachtId}`}</TableCell>
                              <TableCell>{user ? user.name : `Клиент ID: ${booking.userId}`}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>
                                    {format(new Date(booking.startDate), 'dd.MM.yyyy', { locale: ru })}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    до {format(new Date(booking.endDate), 'dd.MM.yyyy', { locale: ru })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{booking.totalPrice.toLocaleString()} ₽</TableCell>
                              <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                              <TableCell>
                                {format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-1">
                                  <Button variant="ghost" size="icon" title="Просмотр">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {booking.status === 'pending' && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-green-600"
                                        title="Подтвердить"
                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-600"
                                        title="Отменить"
                                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  
                                  {booking.status === 'confirmed' && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-blue-600"
                                        title="Завершить"
                                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-600"
                                        title="Отменить"
                                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                      >
                                        <Ban className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Всего бронирований: {filteredAndSortedBookings.length}
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default AdminBookings;
