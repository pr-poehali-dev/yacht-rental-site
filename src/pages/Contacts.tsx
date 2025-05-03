
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contacts = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Успешное сообщение
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
        variant: "default",
      });
      
      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Пожалуйста, попробуйте еще раз",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Свяжитесь с нами</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Наша команда всегда готова ответить на ваши вопросы и помочь с выбором идеальной яхты для вашего отдыха
            </p>
          </div>
        </div>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <div className="lg:w-2/5">
                <h2 className="text-2xl font-bold mb-6 text-blue-900">Контактная информация</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <MapPin className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                          <p className="text-gray-600">г. Севастополь, ул. Морская, 24</p>
                          <p className="text-gray-600">Крым, Россия, 299011</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Phone className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                          <p className="text-gray-600">+7 (978) 123-45-67</p>
                          <p className="text-gray-600">+7 (978) 765-43-21</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Email</h3>
                          <p className="text-gray-600">info@moreyacht.ru</p>
                          <p className="text-gray-600">booking@moreyacht.ru</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Время работы</h3>
                          <p className="text-gray-600">Пн-Пт: 9:00 - 20:00</p>
                          <p className="text-gray-600">Сб-Вс: 10:00 - 18:00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">Присоединяйтесь к нам</h3>
                  <div className="flex gap-4">
                    <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:w-3/5">
                <h2 className="text-2xl font-bold mb-6 text-blue-900">Напишите нам</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">Имя</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Введите ваше имя" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Введите ваш email" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="Введите ваш телефон" 
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Сообщение</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          placeholder="Введите ваше сообщение" 
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto" 
                        disabled={loading}
                      >
                        {loading ? "Отправка..." : "Отправить сообщение"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Advantages */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Быстрый ответ</h4>
                      <p className="text-sm text-gray-600">Мы отвечаем на запросы в течение 2 часов</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Индивидуальный подход</h4>
                      <p className="text-sm text-gray-600">Подберем оптимальный вариант под ваши требования</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Гибкие условия</h4>
                      <p className="text-sm text-gray-600">Учитываем особые пожелания и предпочтения</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Поддержка 24/7</h4>
                      <p className="text-sm text-gray-600">Оперативная помощь на всех этапах аренды</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Мы на карте</h2>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2839.1590300901735!2d33.5189697!3d44.6166595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDM3JzAwLjAiTiAzM8KwMzEnMDguNCJF!5e0!3m2!1sru!2sru!4v1623147988017!5m2!1sru!2sru" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                aria-hidden="false"
                title="Карта расположения компании МореЯхт"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
