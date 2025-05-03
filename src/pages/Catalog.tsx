
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachtCard from '@/components/YachtCard';
import YachtFilter from '@/components/YachtFilter';
import { yachts } from '@/data/yachts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: null as string | null,
    capacity: null as number | null,
    maxPrice: null as number | null,
    location: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [sortBy, setSortBy] = useState<string>('default');

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

  // Сортировка яхт
  const sortedYachts = useMemo(() => {
    let sorted = [...filteredYachts];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'capacity-desc':
        sorted.sort((a, b) => b.capacity - a.capacity);
        break;
      case 'newest':
        sorted.sort((a, b) => b.year - a.year);
        break;
      default:
        // По умолчанию сортировка не применяется
        break;
    }
    
    return sorted;
  }, [filteredYachts, sortBy]);

  // Пагинация
  const indexOfLastYacht = currentPage * itemsPerPage;
  const indexOfFirstYacht = indexOfLastYacht - itemsPerPage;
  const currentYachts = sortedYachts.slice(indexOfFirstYacht, indexOfLastYacht);
  const totalPages = Math.ceil(sortedYachts.length / itemsPerPage);

  // Изменение страницы
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Генерация номеров страниц для пагинации
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении количества элементов
  };

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
              <div className="mb-6 flex flex-col sm:flex-row gap-2">
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
                  className="sm:ml-2"
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Очистить
                </Button>
              </div>

              {/* Sort and Results Count */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-gray-600">
                  Найдено яхт: <span className="font-semibold">{filteredYachts.length}</span>
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Сортировать:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="По умолчанию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                      <SelectItem value="price-desc">Сначала дороже</SelectItem>
                      <SelectItem value="name-asc">По названию</SelectItem>
                      <SelectItem value="capacity-desc">По вместимости</SelectItem>
                      <SelectItem value="newest">Сначала новее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Yacht Grid */}
              {filteredYachts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentYachts.map((yacht) => (
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
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                        <span className="text-sm text-gray-600">Яхт на странице:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                          <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="9" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {getPageNumbers().map(number => (
                            <PaginationItem key={number}>
                              <PaginationLink 
                                isActive={currentPage === number}
                                onClick={() => paginate(number)}
                              >
                                {number}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
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
