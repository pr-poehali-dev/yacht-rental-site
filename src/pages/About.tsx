
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Anchor, Boat, Compass, Award, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">О нашей компании</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              МореЯхт — лидер в сфере аренды премиальных яхт с многолетним опытом работы на рынке
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-blue-900">Наша история</h2>
                <p className="text-gray-700 mb-4">
                  Компания «МореЯхт» была основана в 2010 году группой энтузиастов и профессионалов в области морского дела. Мы начинали с небольшого флота из трех яхт, и за годы работы значительно расширили свои возможности.
                </p>
                <p className="text-gray-700 mb-4">
                  Сегодня мы предлагаем разнообразный выбор яхт — от компактных катеров для дневных прогулок до роскошных моторных яхт с командой для длительных морских путешествий.
                </p>
                <p className="text-gray-700">
                  Наша миссия — сделать морской отдых доступным и комфортным для каждого клиента, обеспечивая высочайший уровень сервиса и безопасности на воде.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&q=80&w=1200" 
                  alt="История компании МореЯхт" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Boat className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Современный флот</h3>
                  <CardDescription>
                    Наш флот состоит из современных яхт различных типов и размеров, оснащенных всем необходимым для комфортного отдыха.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
                  <CardDescription>
                    Все наши яхты регулярно проходят технический осмотр и соответствуют высоким стандартам безопасности на воде.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Опытная команда</h3>
                  <CardDescription>
                    Наши капитаны и члены экипажа — профессионалы с многолетним опытом работы и глубоким знанием акватории.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Compass className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Индивидуальный подход</h3>
                  <CardDescription>
                    Мы разрабатываем маршруты с учетом ваших пожеланий и предпочтений, чтобы сделать ваше путешествие незабываемым.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Качественный сервис</h3>
                  <CardDescription>
                    Мы гордимся высоким уровнем обслуживания и стремимся превзойти ожидания каждого клиента.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Anchor className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Гибкие условия</h3>
                  <CardDescription>
                    Предлагаем различные варианты аренды — от нескольких часов до нескольких недель, с командой или без.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">Наша команда</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                  alt="Александр Морозов" 
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Александр Морозов</h3>
                <p className="text-blue-600 mb-2">Основатель и CEO</p>
                <p className="text-gray-600 text-sm px-4">Опытный яхтсмен с 20-летним стажем и страстью к морским путешествиям.</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                  alt="Елена Волкова" 
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Елена Волкова</h3>
                <p className="text-blue-600 mb-2">Директор по обслуживанию клиентов</p>
                <p className="text-gray-600 text-sm px-4">Отвечает за безупречный сервис и комфорт каждого клиента.</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" 
                  alt="Дмитрий Соколов" 
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Дмитрий Соколов</h3>
                <p className="text-blue-600 mb-2">Главный капитан</p>
                <p className="text-gray-600 text-sm px-4">Отвечает за техническое состояние флота и подготовку экипажей.</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" 
                  alt="Наталья Орлова" 
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Наталья Орлова</h3>
                <p className="text-blue-600 mb-2">Финансовый директор</p>
                <p className="text-gray-600 text-sm px-4">Контролирует финансовые операции и развитие компании.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Achievements */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">Наши достижения</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-700 mb-2">12+</p>
                <p className="text-lg text-gray-700">Лет на рынке</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-700 mb-2">30+</p>
                <p className="text-lg text-gray-700">Яхт в нашем флоте</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-700 mb-2">5000+</p>
                <p className="text-lg text-gray-700">Довольных клиентов</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-700 mb-2">98%</p>
                <p className="text-lg text-gray-700">Положительных отзывов</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700">Наши партнёры</h2>
            <Separator className="mb-8" />
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
              <img src="https://via.placeholder.com/120x60?text=Partner+1" alt="Партнер 1" className="h-12" />
              <img src="https://via.placeholder.com/120x60?text=Partner+2" alt="Партнер 2" className="h-12" />
              <img src="https://via.placeholder.com/120x60?text=Partner+3" alt="Партнер 3" className="h-12" />
              <img src="https://via.placeholder.com/120x60?text=Partner+4" alt="Партнер 4" className="h-12" />
              <img src="https://via.placeholder.com/120x60?text=Partner+5" alt="Партнер 5" className="h-12" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
