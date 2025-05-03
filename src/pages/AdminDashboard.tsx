
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Boat, Users, ShoppingBag, ArrowRightIcon, TrendingUp } from 'lucide-react';
import { yachts } from '@/data/yachts';
import { getAllUsers } from '@/data/users';
import { getAllOrders } from '@/data/cart';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    yachts: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      // Имитация загрузки данных с API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const orders = getAllOrders();
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        yachts: yachts.length,
        users: getAllUsers().length,
        orders: orders.length,
        revenue: totalRevenue
      });
      
      setLoading(false);
    };
    
    loadStats();
  }, []);
  
  // Заглушка для данных графика
  const recentActivities = [
    { id: 1, action: 'Новый заказ', details: 'Аренда яхты "Морская звезда" на 5 дней', timestamp: '10 минут назад' },
    { id: 2, action: 'Новый пользователь', details: 'Зарегистрировался Иван Петров', timestamp: '2 часа назад' },
    { id: 3, action: 'Редактирование яхты', details: 'Обновлены характеристики яхты "Посейдон"', timestamp: '5 часов назад' },
    { id: 4, action: 'Новый заказ', details: 'Аренда яхты "Океаник" на 3 дня', timestamp: 'Вчера' }
  ];
  
  const statCards = [
    { title: 'Яхты', value: stats.yachts, icon: Boat, path: '/admin/yachts', color: 'bg-blue-100 text-blue-700' },
    { title: 'Пользователи', value: stats.users, icon: Users, path: '/admin/users', color: 'bg-green-100 text-green-700' },
    { title: 'Заказы', value: stats.orders, icon: ShoppingBag, path: '/admin/orders', color: 'bg-amber-100 text-amber-700' },
    { title: 'Выручка', value: `${stats.revenue.toLocaleString()} ₽`, icon: TrendingUp, path: '/admin/finance', color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <AdminLayout title="Панель управления">
      <div className="space-y-6">
        {/* Статистика */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="absolute right-4 top-4">
                    <div className={`p-2 rounded-full ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {loading ? (
                      <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                    ) : (
                      card.value
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={card.path}>
                    <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Подробнее <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Данные и активность */}
        <div className="grid gap-6 md:grid-cols-7">
          {/* Графики и аналитика */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Аналитика</CardTitle>
              <CardDescription>
                Обзор ключевых показателей за последний период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue">
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue">Выручка</TabsTrigger>
                  <TabsTrigger value="orders">Заказы</TabsTrigger>
                  <TabsTrigger value="users">Пользователи</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">График выручки будет доступен после интеграции с API</p>
                    <div className="w-full h-[200px] bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                      <TrendingUp className="h-16 w-16 text-gray-300" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">График заказов будет доступен после интеграции с API</p>
                    <div className="w-full h-[200px] bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-gray-300" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="users" className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">График пользователей будет доступен после интеграции с API</p>
                    <div className="w-full h-[200px] bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                      <Users className="h-16 w-16 text-gray-300" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Последние активности */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Последние активности</CardTitle>
              <CardDescription>
                Недавние действия и события в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-full bg-gray-100 animate-pulse rounded-md"></div>
                      <div className="h-3 w-20 bg-gray-100 animate-pulse rounded-md"></div>
                    </div>
                  ))
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="border-b pb-3 last:border-0">
                      <p className="font-medium text-blue-900">{activity.action}</p>
                      <p className="text-sm text-gray-700">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
