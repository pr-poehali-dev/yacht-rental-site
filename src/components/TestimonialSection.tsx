
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

const TestimonialSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Александр Петров',
      text: 'Отличный сервис! Яхта была в идеальном состоянии, команда очень профессиональная. Обязательно воспользуюсь их услугами снова.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Елена Смирнова',
      text: 'Провели незабываемый день с семьей на яхте "Синяя птица". Дети в восторге! Капитан показал нам красивейшие бухты и места для купания.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Дмитрий Соколов',
      text: 'Брал в аренду катамаран на неделю. Все прошло отлично, яхта в прекрасном состоянии, сервис на высоте. Рекомендую!',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg'
    }
  ];

  // Функция для отображения звезд рейтинга
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-blue-900">Отзывы клиентов</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Что говорят клиенты о нашем сервисе аренды яхт
        </p>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/1">
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">{testimonial.name}</h3>
                      <div className="flex mt-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic flex-grow">{testimonial.text}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 space-x-4">
            <CarouselPrevious className="static transform-none m-0" />
            <CarouselNext className="static transform-none m-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
