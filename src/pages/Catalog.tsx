
import React, { useState } from 'react';
import { YachtCard } from '@/components/YachtCard';
import { YachtFilter } from '@/components/YachtFilter';
import { useYachts, YachtFilters, YachtSortOptions } from '@/hooks/useYachts';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function Catalog() {
  const [filters, setFilters] = useState<YachtFilters>({});
  const [sortOption, setSortOption] = useState<YachtSortOptions>({ field: 'price', direction: 'asc' });
  const { yachts, loading, error } = useYachts(filters, sortOption);

  const handleFilterChange = (newFilters: YachtFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [YachtSortOptions['field'], YachtSortOptions['direction']];
    setSortOption({ field, direction });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Боковая панель с фильтрами */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4">Фильтры</h2>
            <YachtFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Основная область контента */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Каталог яхт</h1>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Сортировать по:</span>
              <Select defaultValue="price-asc" onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="year-desc">Новые модели</SelectItem>
                  <SelectItem value="length-desc">По длине</SelectItem>
                  <SelectItem value="name-asc">По названию: А-Я</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="mb-6" />

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
              <p className="flex items-center">
                <Icon name="AlertOctagon" className="mr-2" />
                {error}
              </p>
              <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          )}

          {!loading && !error && yachts.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-8 rounded-lg text-center">
              <Icon name="SearchX" size={48} className="mx-auto mb-3 opacity-60" />
              <h3 className="text-xl font-semibold mb-2">Яхт не найдено</h3>
              <p>Попробуйте изменить параметры фильтрации или сбросить фильтры</p>
              <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                Сбросить все фильтры
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
