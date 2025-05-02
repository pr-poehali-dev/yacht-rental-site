
import YachtCard, { YachtProps } from './YachtCard';

const FeaturedYachts = () => {
  // Примеры данных яхт
  const featuredYachts: YachtProps[] = [
    {
      id: '1',
      name: 'Синяя птица',
      type: 'Парусная яхта',
      length: 12,
      capacity: 6,
      pricePerDay: 25000,
      image: 'https://images.unsplash.com/photo-1566288623394-377af472d81b?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2',
      name: 'Морской бриз',
      type: 'Моторная яхта',
      length: 15,
      capacity: 8,
      pricePerDay: 40000,
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3',
      name: 'Ласточка',
      type: 'Катамаран',
      length: 14,
      capacity: 10,
      pricePerDay: 35000,
      image: 'https://images.unsplash.com/photo-1588401273872-959d2076283d?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-blue-900">Популярные яхты</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Выберите одну из наших лучших яхт для незабываемого морского путешествия
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredYachts.map((yacht) => (
            <YachtCard key={yacht.id} {...yacht} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedYachts;
