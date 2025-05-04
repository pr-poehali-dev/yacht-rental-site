
import { useState, useEffect } from 'react';
import { Yacht } from '@/data/yachts';
import { yachtApi } from '@/services/api';

// Типы для фильтров и сортировки
export interface YachtFilters {
  priceMin?: number;
  priceMax?: number;
  capacity?: number;
  length?: number;
  year?: number;
  category?: string[];
}

export interface YachtSortOptions {
  field: 'price' | 'year' | 'length' | 'name';
  direction: 'asc' | 'desc';
}

export function useYachts(filters?: YachtFilters, sort?: YachtSortOptions) {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchYachts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await yachtApi.getAll();
        
        if (response.success && response.data) {
          let filteredYachts = [...response.data];
          
          // Применение фильтров
          if (filters) {
            filteredYachts = filteredYachts.filter(yacht => {
              if (filters.priceMin && yacht.pricePerDay < filters.priceMin) return false;
              if (filters.priceMax && yacht.pricePerDay > filters.priceMax) return false;
              if (filters.capacity && yacht.capacity < filters.capacity) return false;
              if (filters.length && yacht.length < filters.length) return false;
              if (filters.year && yacht.year < filters.year) return false;
              if (filters.category && filters.category.length > 0 && !filters.category.includes(yacht.category)) return false;
              return true;
            });
          }
          
          // Применение сортировки
          if (sort) {
            filteredYachts.sort((a, b) => {
              const valueA = a[sort.field];
              const valueB = b[sort.field];
              
              if (sort.direction === 'asc') {
                return typeof valueA === 'string' 
                  ? valueA.localeCompare(valueB as string) 
                  : (valueA as number) - (valueB as number);
              } else {
                return typeof valueA === 'string' 
                  ? valueB.localeCompare(valueA as string) 
                  : (valueB as number) - (valueA as number);
              }
            });
          }
          
          setYachts(filteredYachts);
        } else {
          setError('Не удалось загрузить данные о яхтах');
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке яхт');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchYachts();
  }, [filters, sort]);
  
  return { yachts, loading, error };
}
