
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CalendarIcon, Users, Ruler, Anchor, ShieldCheck, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { getYachtById } from '@/data/yachts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const YachtDetail = () => {
  const { id } = useParams();
  const yacht = getYachtById(id || '');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [days, setDays] = useState(1);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  if (!yacht) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Яхта не найдена</h1>
            <p className="text-gray-600 mb-8">К сожалению, запрашиваемая яхта не существует или была удалена.</p>
            <Link to="/catalog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться в каталог
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsBookingConfirmed(true);
    // Здесь будет логика добавления в корзину
    setTimeout(() => {
      setIsBookingConfirmed(false);
    }, 3000);
  };

  const totalPrice = yacht.pricePerDay * days;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-blue-600">Главная</Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/catalog" className="text-gray-500 hover:text-blue-600">Каталог</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800">{yacht.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Images */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">{yacht.name}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {yacht.type}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Ruler className="inline-block h-4 w-4 mr-1" /> {yacht.length} м
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Users className="inline-block h-4 w-4 mr-1" /> до {yacht.capacity} чел.
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Anchor className="inline-block h-4 w-4 mr-1" /> {yacht.location}
                </span>
              </div>

              {/* Image Carousel */}
              <Carousel className="w-full mb-6">
                <CarouselContent>
                  {yacht.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                        <img 
                          src={image} 
                          alt={`${yacht.name} - изображение ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4 gap-2">
                  <CarouselPrevious className="static transform-none m-0" />
                  <CarouselNext className="static transform-none m-0" />
                </div>
              </Carousel>

              {/* Yacht Info Tabs */}
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Описание</TabsTrigger>
                  <TabsTrigger value="features">Характеристики</TabsTrigger>
                  <TabsTrigger value="conditions">Условия аренды</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">О яхте</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {yacht.description}
                  </p>
                </TabsContent>
                <TabsContent value="features" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Характеристики и оснащение</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Основные параметры</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <span className="w-32">Тип:</span>
                          <span className="font-medium">{yacht.type}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32">Длина:</span>
                          <span className="font-medium">{yacht.length} м</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32">Вместимость:</span>
                          <span className="font-medium">до {yacht.capacity} человек</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32">Каюты:</span>
                          <span className="font-medium">{yacht.cabins}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32">Санузлы:</span>
                          <span className="font-medium">{yacht.bathrooms}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32">Год постройки:</span>
                          <span className="font-medium">{yacht.year}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Оборудование и удобства</h4>
                      <ul className="space-y-1 text-gray-700">
                        {yacht.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="conditions" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Условия аренды</h3>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Стоимость аренды</h4>
                      <p>Базовая стоимость аренды: <span className="font-semibold">{yacht.pricePerDay.toLocaleString()} ₽ в день</span></p>
                      <p className="text-sm text-gray-500 mt-1">В стоимость включено: страховка судна, базовая уборка</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Требования к арендатору</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Возраст не менее 25 лет</li>
                        <li>Действующий паспорт</li>
                        {yacht.type === "Парусная яхта" && (
                          <li>Опыт управления парусным судном или наличие сертификата</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Важная информация</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Минимальный срок аренды: 1 день</li>
                        <li>Залог: {(yacht.pricePerDay * 2).toLocaleString()} ₽</li>
                        <li>Возврат яхты: в чистом виде, с полным баком</li>
                        <li>Отмена бронирования: бесплатно за 7 дней до начала аренды</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg text-blue-800">
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span>Все яхты застрахованы и регулярно проходят техническое обслуживание</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="text-2xl font-bold text-blue-900 mb-1">
                  {yacht.pricePerDay.toLocaleString()} ₽
                  <span className="text-sm font-normal text-gray-500">/день</span>
                </div>
                <p className="text-green-600 text-sm mb-6">Доступно для бронирования</p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="block mb-2">Дата начала аренды</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="days" className="block mb-2">Количество дней</Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div className="border-t border-b py-4 my-4">
                    <div className="flex justify-between mb-2">
                      <span>Стоимость аренды:</span>
                      <span>{yacht.pricePerDay.toLocaleString()} ₽ × {days} дн.</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Итого:</span>
                      <span>{totalPrice.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleAddToCart}
                    disabled={!selectedDate || isBookingConfirmed}
                  >
                    {isBookingConfirmed ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Добавлено в корзину
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Добавить в корзину
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Бесплатная отмена за 7 дней до начала
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YachtDetail;
