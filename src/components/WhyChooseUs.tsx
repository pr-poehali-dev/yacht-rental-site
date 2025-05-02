
import { Anchor, Award, Clock, Shield } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Anchor className="h-10 w-10 text-blue-600" />,
      title: 'Современный флот',
      description: 'Наши яхты оснащены самым современным оборудованием для комфортного и безопасного плавания.'
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: 'Опытная команда',
      description: 'Наши капитаны и экипаж имеют многолетний опыт и все необходимые сертификаты.'
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: 'Гибкие условия',
      description: 'Аренда от нескольких часов до нескольких недель. Индивидуальный подход к каждому клиенту.'
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-600" />,
      title: 'Полная безопасность',
      description: 'Все наши суда проходят регулярную техническую проверку и соответствуют стандартам безопасности.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-blue-900">Почему выбирают нас</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          МореЯхт предлагает лучший сервис аренды яхт на всём Черноморском побережье
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-6 text-center transition-transform hover:translate-y-[-5px]">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
