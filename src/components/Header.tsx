
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from './ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getCart } from '@/data/cart';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const cartItemsCount = getCart().length;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-900">
            МореЯхт
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Главная</Link>
            <Link to="/catalog" className="text-gray-700 hover:text-blue-600">Каталог</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">О нас</Link>
            <Link to="/contacts" className="text-gray-700 hover:text-blue-600">Контакты</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Личный кабинет
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/orders')}>
                    Мои заказы
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Административная панель
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                Войти
              </Button>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart for Mobile */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Меню</h2>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <nav className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link to="/" className="py-2 text-gray-700 hover:text-blue-600">Главная</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/catalog" className="py-2 text-gray-700 hover:text-blue-600">Каталог</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/about" className="py-2 text-gray-700 hover:text-blue-600">О нас</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/contacts" className="py-2 text-gray-700 hover:text-blue-600">Контакты</Link>
                    </SheetClose>
                  </nav>
                  
                  <div className="mt-auto py-4">
                    {user ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Вы вошли как</p>
                        <p className="font-semibold">{user.name}</p>
                        <div className="space-y-2 mt-4">
                          <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start" 
                              onClick={() => navigate('/profile')}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Личный кабинет
                            </Button>
                          </SheetClose>
                          {user.role === 'admin' && (
                            <SheetClose asChild>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start" 
                                onClick={() => navigate('/admin')}
                              >
                                Административная панель
                              </Button>
                            </SheetClose>
                          )}
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-500" 
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                              navigate('/');
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Выйти
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => navigate('/login')}
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Войти
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => navigate('/register')}
                          >
                            Зарегистрироваться
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
