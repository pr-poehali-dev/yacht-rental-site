
import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Boat, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Проверка доступа - только для админов
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6">
          <Alert variant="destructive">
            <AlertDescription>
              У вас нет доступа к этой странице. Необходимы права администратора.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
          </div>
        </div>
      </div>
    );
  }

  // Определение активного пункта меню
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin', label: 'Обзор', icon: Home },
    { path: '/admin/yachts', label: 'Яхты', icon: Boat },
    { path: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
    { path: '/admin/users', label: 'Пользователи', icon: Users },
    { path: '/admin/settings', label: 'Настройки', icon: Settings }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white shadow-sm">
          <div className="flex items-center px-4 mb-4">
            <span className="text-xl font-semibold text-blue-900">МореЯхт</span>
            <span className="ml-2 text-sm text-gray-500">Панель управления</span>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="flex-grow px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {isActive(item.path) && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </div>
          
          <div className="px-4 py-4 mt-auto">
            <Separator className="mb-4" />
            <div className="flex flex-col">
              <div className="flex items-center px-2 py-2 mb-2">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="justify-start text-red-500" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
          <div className="flex flex-1 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
            
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                Вернуться на сайт
              </Button>
            </div>
            
            <div className="hidden md:block">
              <Button onClick={() => navigate('/')} variant="outline" size="sm">
                Вернуться на сайт
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
