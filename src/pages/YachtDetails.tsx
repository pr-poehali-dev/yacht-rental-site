
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getYachtById } from '@/data/yachts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar as CalendarIcon, 
  ShoppingCart, 
  Ship, 
  Users, 
  ArrowLeft, 
  Bed, 
  Bath, 
  Info,
  Check,
  MapPin
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const YachtDetails = () => {
  const { id } = useParams<{ id: string }>();
  const yacht = getYachtById(id || '');
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [people, setPeople] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!yacht) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Яхта не найдена</h1>
            <p className="mb-6">К сожалению, яхта с указанным идентификатором не существует.</p>
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

  const totalDays = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  
  const totalPrice = yacht.pricePerDay * totalDays;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/catalog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться в каталог
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex flex-col lg:flex-row">
              {/* Галерея изображений */}
              <div className="w-full lg:w-3/5">
                <div className="relative h-[400px] bg-gray-100">
                  <img 
                    src={yacht.images[activeImageIndex]} 
                    alt={yacht.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-gray-50 flex space-x-2 overflow-x-auto">
                  {yacht.images.map((image, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "w-20 h-16 cursor-pointer border-2 rounded overflow-hidden",
                        index === activeImageIndex ? "border-blue-600" : "border-transparent"
                      )}
                    >
                      <img src={image} alt={`${yacht.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Информация о яхте */}
              <div className="w-full lg:w-2/5 p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">{yacht.type}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {yacht.location}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-blue-900 mb-4">{yacht.name}</h1>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Ship className="text-blue-600 mr-2 h-5 w-5" />
                    <span>Длина: {yacht.length} м</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-blue-600 mr-2 h-5 w-5" />
                    <span>Вместимость: {yacht.capacity} чел.</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="text-blue-600 mr-2 h-5 w-5" />
                    <span>Каюты: {yacht.cabins}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="text-blue-600 mr-2 h-5 w-5" />
                    <span>Санузлы: {yacht.bathrooms}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Цена аренды</h3>
                  <div className="text-3xl font-bold text-blue-600">
                    {yacht.pricePerDay.toLocaleString()} ₽
                    <span className="text-sm font-normal text-gray-600">/день</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    Забронировать
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Описание</TabsTrigger>
                  <TabsTrigger value="features">Особенности</TabsTrigger>
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">{yacht.description}</p>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Info className="mr-2 h-5 w-5 text-blue-600" />
                        Технические характеристики
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Тип</span>
                          <span className="font-medium">{yacht.type}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Длина</span>
                          <span className="font-medium">{yacht.length} м</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Вместимость</span>
                          <span className="font-medium">{yacht.capacity} чел.</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Каюты</span>
                          <span className="font-medium">{yacht.cabins}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Санузлы</span>
                          <span className="font-medium">{yacht.bathrooms}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Год постройки</span>
                          <span className="font-medium">{yacht.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="features" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-lg font-semibold mb-4">Особенности и оснащение</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {yacht.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-2 mt-1 flex-shrink-0">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-lg font-semibold mb-4">Отзывы</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Пока нет отзывов о данной яхте.</p>
                    <Button variant="outline">Оставить отзыв</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Забронировать</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dates">Даты аренды</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, 'PP', { locale: ru })
                            ) : (
                              <span>Дата начала</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={!startDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, 'PP', { locale: ru })
                            ) : (
                              <span>Дата окончания</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) => 
                              date < new Date() || 
                              (startDate ? date <= startDate : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="people">Количество человек</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        id="people"
                        type="number"
                        value={people}
                        onChange={(e) => setPeople(Math.min(yacht.capacity, Math.max(1, parseInt(e.target.value) || 1)))}
                        min={1}
                        max={yacht.capacity}
                        className="w-24"
                      />
                      <span className="ml-3 text-sm text-gray-500">
                        Максимум: {yacht.capacity} чел.
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Цена за день</span>
                      <span>{yacht.pricePerDay.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Кол-во дней</span>
                      <span>{totalDays}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Итого</span>
                      <span>{totalPrice.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">Забронировать</Button>
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

export default YachtDetails;
