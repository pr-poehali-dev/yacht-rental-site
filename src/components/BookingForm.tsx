
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Yacht } from '@/data/yachts';
import { bookingApi, BookingService } from '@/services/api';

// Моковые дополнительные услуги (в реальном приложении они будут загружаться с API)
const mockAdditionalServices: BookingService[] = [
  { id: '1', name: 'Услуги капитана', price: 5000, description: 'Профессиональный капитан на весь период аренды' },
  { id: '2', name: 'Питание на борту', price: 3000, description: 'Трехразовое питание для всех гостей' },
  { id: '3', name: 'Трансфер до яхты', price: 2000, description: 'Комфортная доставка от вашего отеля до места стоянки яхты' },
  { id: '4', name: 'Полотенца и постельное белье', price: 1000, description: 'Комплект для каждого гостя' },
  { id: '5', name: 'Рыболовное снаряжение', price: 2500, description: 'Удочки, снасти и приманки для морской рыбалки' },
];

interface BookingFormProps {
  yacht: Yacht;
}

const BookingForm = ({ yacht }: BookingFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Расчет общей стоимости
  const totalDays = startDate && endDate 
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const basePrice = yacht.pricePerDay * totalDays;
  
  const additionalServicesPrice = additionalServices.reduce((total, serviceId) => {
    const service = mockAdditionalServices.find(s => s.id === serviceId);
    return total + (service ? service.price : 0);
  }, 0);
  
  const totalPrice = basePrice + additionalServicesPrice;

  // Загрузка доступных дат с API (в данном случае имитация)
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь будет запрос к API
        // const currentMonth = new Date().getMonth() + 1;
        // const currentYear = new Date().getFullYear();
        // const response = await bookingApi.getAvailableDates(yacht.id, currentMonth, currentYear);
        // if (response.success) {
        //   setAvailableDates(response.data);
        // }
        
        // Имитация запроса
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Создаем моковые доступные даты (все даты на 2 месяца вперед, кроме некоторых)
        const today = new Date();
        const futureDates: string[] = [];
        
        for (let i = 0; i < 60; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          
          // Исключаем некоторые даты (для имитации уже забронированных)
          if (i % 7 !== 3 && i % 11 !== 5) {
            futureDates.push(format(date, 'yyyy-MM-dd'));
          }
        }
        
        setAvailableDates(futureDates);
      } catch (error) {
        console.error('Ошибка при загрузке доступных дат:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableDates();
  }, [yacht.id]);

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      navigate(`/login?redirect=/yacht/${yacht.id}`);
      return;
    }
    
    if (!startDate || !endDate) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Создание объекта бронирования
      const bookingData = {
        yachtId: yacht.id,
        userId: user.id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        totalPrice,
        status: 'pending' as const,
        additionalServices: additionalServices.map(id => {
          const service = mockAdditionalServices.find(s => s.id === id);
          return service || { id, name: 'Неизвестная услуга', price: 0 };
        }),
        specialRequests: specialRequests || undefined
      };
      
      // В реальном приложении здесь будет запрос к API
      // const response = await bookingApi.create(bookingData);
      // if (response.success) {
      //   setSuccess(true);
      // }
      
      // Имитация запроса
      console.log('Отправка данных бронирования:', bookingData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Прокрутка вверх, чтобы показать сообщение об успехе
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Сброс формы после успешного бронирования
      setTimeout(() => {
        setStartDate(undefined);
        setEndDate(undefined);
        setGuestCount(2);
        setAdditionalServices([]);
        setSpecialRequests('');
        setSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
    } finally {
      setLoading(false);
    }
  };

  // Проверка, доступна ли дата для выбора
  const isDateAvailable = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return availableDates.includes(dateString);
  };

  // Обработчик изменения чекбоксов дополнительных услуг
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setAdditionalServices(prev => [...prev, serviceId]);
    } else {
      setAdditionalServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Бронирование яхты</CardTitle>
        <CardDescription>
          Заполните форму, чтобы забронировать яхту на выбранные даты
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Бронирование успешно отправлено! Мы свяжемся с вами для подтверждения.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Дата начала аренды</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, 'd MMMM yyyy', { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => 
                          date < new Date() || 
                          !isDateAvailable(date) || 
                          (endDate ? date > endDate : false)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">Дата окончания аренды</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!startDate || loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, 'd MMMM yyyy', { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => 
                          !startDate || 
                          date < startDate || 
                          !isDateAvailable(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guests">Количество гостей</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={yacht.capacity}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">Максимальная вместимость: {yacht.capacity} человек</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Дополнительные услуги</h3>
              <div className="grid gap-3">
                {mockAdditionalServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 rounded-md border p-3">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={additionalServices.includes(service.id)}
                      onCheckedChange={(checked) => handleServiceChange(service.id, checked === true)}
                      disabled={loading}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`service-${service.id}`}
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service.name} - {service.price.toLocaleString()} ₽
                      </Label>
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="special-requests">Особые пожелания</Label>
              <Textarea
                id="special-requests"
                placeholder="Укажите любые особые пожелания или требования..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Расчет стоимости</h3>
              <div className="space-y-2 rounded-md border p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>Базовая стоимость аренды</span>
                  <span>{yacht.pricePerDay.toLocaleString()} ₽ × {totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дня' : 'дней'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Стоимость аренды</span>
                  <span className="font-medium">{basePrice.toLocaleString()} ₽</span>
                </div>
                {additionalServicesPrice > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Дополнительные услуги</span>
                    <span>{additionalServicesPrice.toLocaleString()} ₽</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Итоговая стоимость</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                
                <div className="mt-4 flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Бронирование считается подтвержденным после внесения предоплаты в размере 20% от стоимости аренды. 
                    Полная оплата производится за 3 дня до начала аренды.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <CardFooter className="flex justify-end p-0 pt-6">
            <Button 
              type="submit" 
              className="w-full sm:w-auto" 
              disabled={!startDate || !endDate || loading || guestCount < 1 || guestCount > yacht.capacity}
            >
              {loading ? "Отправка..." : "Забронировать"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
