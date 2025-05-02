
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachtCard from '@/components/YachtCard';
import YachtFilter from '@/components/YachtFilter';
import { yachts } from '@/data/yachts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: null as string | null,
    capacity: null as number | null,
    maxPrice: null as number | null,
    location: null as string | null,
  });

  // Получаем уникальные локации и типы яхт для фильтров
  const locations = useMemo(() => {
    return [...new Set(yachts.map(yacht => yacht.location))];
  }, []);

  const yachtTypes = useMemo(() => {
    return [...new Set(yachts.map(yacht => yacht.type))];
  }, []);

  // Фильтрация яхт
  const filteredYachts = useMemo(() => {
    return yachts.filter(yacht => {
      const matchesSearch = searchTerm === '' || 
        yacht.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yacht.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || yacht.type === filters.type;
      const matchesCapacity = !filters.capacity || yacht.capacity >= filters.capacity;
      const matchesPrice = !filters.maxPrice || yacht.pricePerDay <= filters.maxPrice;
      const matchesLocation = !filters.location || yacht.location === filters.location;
      
      return matchesSearch && matchesType && matchesCapacity && matchesPrice && matchesLocation;
    });
  }, [searchTerm, filters]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Каталог яхт</h1>
            <p className="text-blue-100 max-w-2xl">
              Выберите идеальную яхту для вашего морского путешествия из нашей коллекции премиальных судов
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="lg:w-1/4">
              <YachtFilter 
                onFilter={setFilters} 
                locations={locations} 
                yachtTypes={yachtTypes} 
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Search Bar */}
              <div className="mb-6 flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Поиск по названию или описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  className="ml-2"
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Очистить
                </Button>
              </div>

              {/* Results Count */}
              <div className="mb-4">
                <p className="text-gray-600">
                  Найдено яхт: <span className="font-semibold">{filteredYachts.length}</span>
                </p>
              </div>

              {/* Yacht Grid */}
              {filteredYachts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredYachts.map((yacht) => (
                    <YachtCard
                      key={yacht.id}
                      id={yacht.id}
                      name={yacht.name}
                      type={yacht.type}
                      length={yacht.length}
                      capacity={yacht.capacity}
                      pricePerDay={yacht.pricePerDay}
                      image={yacht.images[0]}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Яхты не найдены</h3>
                  <p className="text-gray-600 mb-4">
                    По вашему запросу не найдено подходящих яхт. Пожалуйста, попробуйте изменить параметры поиска.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        type: null,
                        capacity: null,
                        maxPrice: null,
                        location: null,
                      });
                    }}
                  >
                    Сбросить все фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
