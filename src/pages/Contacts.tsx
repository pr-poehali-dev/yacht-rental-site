
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contacts = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
        duration: 5000
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Контакты</h1>
            <p className="text-blue-100 max-w-2xl">
              Свяжитесь с нами, чтобы забронировать яхту или получить дополнительную информацию о наших услугах
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">Наши контакты</h2>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Телефон</h3>
                      <p className="text-gray-600">+7 (123) 456-78-90</p>
                      <p className="text-gray-600">+7 (987) 654-32-10</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600">info@moreyacht.ru</p>
                      <p className="text-gray-600">booking@moreyacht.ru</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Главный офис</h3>
                      <p className="text-gray-600">г. Севастополь, ул. Морская, 123</p>
                      <p className="text-gray-600">Севастопольская бухта, причал №3</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Часы работы</h3>
                      <p className="text-gray-600">Пн-Пт: 9:00 - 20:00</p>
                      <p className="text-gray-600">Сб-Вс: 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-blue-900 mt-8 mb-4">Филиалы</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">Ялта</h4>
                    <p className="text-gray-600 mb-1">Ялтинский порт, причал №5</p>
                    <p className="text-gray-600">+7 (978) 765-43-21</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">Сочи</h4>
                    <p className="text-gray-600 mb-1">Сочинский морской порт, причал №2</p>
                    <p className="text-gray-600">+7 (918) 987-65-43</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:w-2/3">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">Напишите нам</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Ваше имя *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Иван Иванов"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="example@mail.ru"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Сообщение *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Расскажите, что вас интересует..."
                        rows={5}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Отправка..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Отправить сообщение
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-8">Как нас найти</h2>
            
            <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px] relative">
              {/* Здесь будет карта. В демо-версии используем заглушку */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Здесь будет интерактивная карта с нашими локациями</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-gray-600">
              <p>Для навигатора: г. Севастополь, ул. Морская, 123</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
