
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { X, FilterIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface FilterProps {
  onFilter: (filters: {
    type: string | null;
    capacity: number | null;
    maxPrice: number | null;
    location: string | null;
  }) => void;
  locations: string[];
  yachtTypes: string[];
}

const YachtFilter = ({ onFilter, locations, yachtTypes }: FilterProps) => {
  const [type, setType] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([65000]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    setMaxPrice(priceRange[0]);
  }, [priceRange]);

  const applyFilters = () => {
    onFilter({ type, capacity, maxPrice, location });
    setIsFilterVisible(false);
  };

  const resetFilters = () => {
    setType(null);
    setCapacity(null);
    setMaxPrice(null);
    setLocation(null);
    setPriceRange([65000]);
    onFilter({ type: null, capacity: null, maxPrice: null, location: null });
  };

  const DesktopFilter = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900">Фильтры</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500">
          <X className="h-4 w-4 mr-1" /> Сбросить
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="type">Тип яхты</Label>
          <Select
            value={type || ""}
            onValueChange={(value) => setType(value || null)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все типы</SelectItem>
              {yachtTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="capacity">Минимальная вместимость</Label>
          <Select
            value={capacity?.toString() || ""}
            onValueChange={(value) => setCapacity(value ? parseInt(value) : null)}
          >
            <SelectTrigger id="capacity">
              <SelectValue placeholder="Любая" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая</SelectItem>
              {[2, 4, 6, 8, 10, 12].map(cap => (
                <SelectItem key={cap} value={cap.toString()}>{cap} человек</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="location">Расположение</Label>
          <Select
            value={location || ""}
            onValueChange={(value) => setLocation(value || null)}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Любое" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любое</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="price">Максимальная цена</Label>
            <span className="text-sm text-gray-500">{maxPrice?.toLocaleString() || '65 000'} ₽/день</span>
          </div>
          <Slider
            id="price"
            defaultValue={[65000]}
            max={65000}
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-4"
          />
        </div>
        
        <Button className="w-full" onClick={applyFilters}>
          Применить фильтры
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block">
        <DesktopFilter />
      </div>
      
      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mb-4 w-full" variant="outline">
              <FilterIcon className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <DesktopFilter />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default YachtFilter;
