
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Anchor, Award, Shield, Boat, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-blue-900 text-white">
          <div 
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=1200')",
            }}
          ></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">О компании МореЯхт</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Мы предлагаем лучшие яхты и катера для незабываемого отдыха на море уже более 10 лет
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-blue-900 mb-6">Наша история</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Компания МореЯхт была основана в 2014 году группой энтузиастов, объединенных страстью к морю и парусному спорту. Начав с небольшого флота из трех яхт, мы постепенно расширялись, добавляя новые суда и совершенствуя сервис.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  За 10 лет работы мы стали одним из лидеров рынка аренды яхт на Черноморском побережье. Наша миссия — делать морской отдых доступным и комфортным для каждого, кто мечтает почувствовать свободу морских путешествий.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Сегодня наш флот насчитывает более 20 современных яхт различных типов и размеров, а команда состоит из опытных капитанов и специалистов, влюбленных в море и свою работу.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1527431293370-0cd7c7e3bb9c?auto=format&fit=crop&q=80&w=700" 
                  alt="История МореЯхт" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Наши ценности</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900">Безопасность</h3>
                <p className="text-gray-700">
                  Безопасность наших клиентов — наш главный приоритет. Все суда регулярно проходят техническую проверку и обслуживание.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900">Качество</h3>
                <p className="text-gray-700">
                  Мы предлагаем только современные яхты в отличном состоянии. Комфорт и высокий уровень сервиса — наша визитная карточка.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900">Доступность</h3>
                <p className="text-gray-700">
                  Мы стремимся сделать отдых на яхте доступным для каждого. Разнообразие флота позволяет выбрать судно под любой бюджет.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">Наша команда</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Опытные профессионалы, объединенные страстью к морю и парусному спорту
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: 'Александр Морев',
                  position: 'Основатель и CEO',
                  image: 'https://randomuser.me/api/portraits/men/32.jpg',
                  bio: 'Профессиональный яхтсмен с 20-летним опытом. Основал компанию в 2014 году.'
                },
                {
                  name: 'Елена Волкова',
                  position: 'Менеджер по бронированию',
                  image: 'https://randomuser.me/api/portraits/women/44.jpg',
                  bio: 'Отвечает за комфорт клиентов и идеальную организацию отдыха на воде.'
                },
                {
                  name: 'Дмитрий Соколов',
                  position: 'Главный капитан',
                  image: 'https://randomuser.me/api/portraits/men/67.jpg',
                  bio: 'Отвечает за техническое состояние флота и подготовку экипажей.'
                },
                {
                  name: 'Мария Лебедева',
                  position: 'Сервис-менеджер',
                  image: 'https://randomuser.me/api/portraits/women/17.jpg',
                  bio: 'Следит за качеством сервиса и обратной связью от клиентов.'
                }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 mb-3">{member.position}</p>
                    <p className="text-gray-700">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-blue-200">Лет опыта</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">20+</div>
                <div className="text-blue-200">Яхт во флоте</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1500+</div>
                <div className="text-blue-200">Довольных клиентов</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-blue-200">Города присутствия</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Locations */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Наши локации</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  city: 'Севастополь',
                  image: 'https://images.unsplash.com/photo-1583087253216-e2a2ed82d229?auto=format&fit=crop&q=80&w=500',
                  address: 'Севастопольская бухта, причал №3',
                  phone: '+7 (978) 123-45-67'
                },
                {
                  city: 'Ялта',
                  image: 'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?auto=format&fit=crop&q=80&w=500',
                  address: 'Ялтинский порт, причал №5',
                  phone: '+7 (978) 765-43-21'
                },
                {
                  city: 'Сочи',
                  image: 'https://images.unsplash.com/photo-1605275153047-7a4d7391997c?auto=format&fit=crop&q=80&w=500',
                  address: 'Сочинский морской порт, причал №2',
                  phone: '+7 (918) 987-65-43'
                }
              ].map((location, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={location.image} 
                    alt={`МореЯхт - ${location.city}`} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">{location.city}</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Адрес:</strong> {location.address}</p>
                      <p><strong>Телефон:</strong> {location.phone}</p>
                      <p><strong>Часы работы:</strong> 09:00 - 20:00, ежедневно</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
