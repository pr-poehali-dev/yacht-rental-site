
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Trash2, 
  Calendar, 
  Clock, 
  Anchor, 
  ShoppingCart, 
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { getCart, removeFromCart, clearCart, updateCartItem, createOrder } from '@/data/cart';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // В реальном приложении ID пользователя должен быть получен из контекста аутентификации
  const currentUserId = '1';
  
  const [cartItems, setCartItems] = useState(getCart());
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleRemoveItem = (yachtId: string) => {
    removeFromCart(yachtId);
    setCartItems(getCart());
    toast({
      title: "Яхта удалена из корзины",
      duration: 3000
    });
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems(getCart());
    toast({
      title: "Корзина очищена",
      duration: 3000
    });
  };

  const handleUpdateDays = (yachtId: string, startDate: Date, days: number) => {
    if (days < 1) days = 1;
    updateCartItem(yachtId, startDate, days);
    setCartItems(getCart());
  };

  const handleSubmitOrder = () => {
    // Валидация формы
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      createOrder(currentUserId, contactInfo);
      setCheckoutStep('success');
    } catch (error) {
      toast({
        title: "Ошибка при оформлении заказа",
        description: "Пожалуйста, попробуйте еще раз",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Отображение пустой корзины
  if (cartItems.length === 0 && checkoutStep === 'cart') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Корзина</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-6">
              Добавьте яхты в корзину для оформления аренды
            </p>
            <Link to="/catalog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Отображение успешного оформления заказа
  if (checkoutStep === 'success') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Заказ успешно оформлен!</h2>
            <p className="text-gray-600 mb-6">
              Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate('/catalog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться в каталог
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile/orders')}>
                Мои заказы
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          {checkoutStep === 'cart' ? 'Корзина' : 'Оформление заказа'}
        </h1>

        {checkoutStep === 'cart' ? (
          <>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Список яхт в корзине */}
              <div className="md:w-2/3">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Яхты в корзине ({cartItems.length})
                    </h2>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Очистить
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Очистить корзину?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить все яхты из корзины?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearCart} className="bg-red-500 hover:bg-red-600">
                            Очистить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card key={item.yachtId} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/4">
                              <img
                                src={item.yacht.images[0]}
                                alt={item.yacht.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-4 sm:w-3/4">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-blue-900">
                                    <Link to={`/yacht/${item.yachtId}`} className="hover:underline">
                                      {item.yacht.name}
                                    </Link>
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-sm text-gray-600 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {format(item.startDate, 'dd MMMM yyyy', { locale: ru })}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {item.days} {item.days === 1 ? 'день' : (item.days < 5 ? 'дня' : 'дней')}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center">
                                      <Anchor className="h-4 w-4 mr-1" />
                                      {item.yacht.location}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.yachtId)}
                                  className="text-red-500 h-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mt-4 flex justify-between items-end">
                                <div className="flex items-center">
                                  <Label htmlFor={`days-${item.yachtId}`} className="mr-2">
                                    Дней:
                                  </Label>
                                  <Input
                                    id={`days-${item.yachtId}`}
                                    type="number"
                                    min="1"
                                    value={item.days}
                                    onChange={(e) => handleUpdateDays(
                                      item.yachtId,
                                      item.startDate,
                                      parseInt(e.target.value) || 1
                                    )}
                                    className="w-16 h-8"
                                  />
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">
                                    {item.yacht.pricePerDay.toLocaleString()} ₽ × {item.days} {item.days === 1 ? 'день' : (item.days < 5 ? 'дня' : 'дней')}
                                  </div>
                                  <div className="text-lg font-semibold text-blue-900">
                                    {item.price.toLocaleString()} ₽
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Сводка заказа */}
              <div className="md:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Сводка заказа</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Количество яхт:</span>
                      <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Общая сумма:</span>
                      <span className="font-semibold">{calculateTotal().toLocaleString()} ₽</span>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Итого:</span>
                    <span className="text-blue-900">{calculateTotal().toLocaleString()} ₽</span>
                  </div>
                  
                  <Button className="w-full" size="lg" onClick={() => setCheckoutStep('checkout')}>
                    Перейти к оформлению
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setCheckoutStep('cart')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад в корзину
            </Button>

            <div className="grid grid-cols-1 gap-8">
              {/* Форма контактных данных */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Контактная информация</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">ФИО*</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      placeholder="Введите ваше полное имя"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="example@mail.ru"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон*</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Сводка заказа */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Детали заказа</h2>
                
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.yachtId} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.yacht.name} ({item.days} {item.days === 1 ? 'день' : (item.days < 5 ? 'дня' : 'дней')})
                      </span>
                      <span>{item.price.toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Итого:</span>
                  <span className="text-blue-900">{calculateTotal().toLocaleString()} ₽</span>
                </div>
                
                <Button className="w-full" size="lg" onClick={handleSubmitOrder}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Оформить заказ
                </Button>
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  Нажимая кнопку "Оформить заказ", вы соглашаетесь с условиями аренды и политикой конфиденциальности.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
