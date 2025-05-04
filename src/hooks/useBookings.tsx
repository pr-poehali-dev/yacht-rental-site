
import { useState, useEffect } from 'react';
import { bookingApi, Booking } from '@/services/api';

interface UseBookingsOptions {
  yachtId?: string;
  userId?: string;
  status?: Booking['status'];
}

export function useBookings(options?: UseBookingsOptions) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await bookingApi.getAll();
        
        if (response.success && response.data) {
          let filteredBookings = [...response.data];
          
          // Фильтрация по параметрам, если они указаны
          if (options) {
            filteredBookings = filteredBookings.filter(booking => {
              if (options.yachtId && booking.yachtId !== options.yachtId) return false;
              if (options.userId && booking.userId !== options.userId) return false;
              if (options.status && booking.status !== options.status) return false;
              return true;
            });
          }
          
          setBookings(filteredBookings);
        } else {
          setError('Не удалось загрузить данные о бронированиях');
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке бронирований');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [options?.yachtId, options?.userId, options?.status]);
  
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingApi.create(bookingData);
      
      if (response.success && response.data) {
        setBookings(prev => [...prev, response.data]);
        return { success: true, booking: response.data };
      } else {
        setError(response.error || 'Не удалось создать бронирование');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    setLoading(true);
    
    try {
      const response = await bookingApi.updateStatus(bookingId, status);
      
      if (response.success && response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    bookings, 
    loading, 
    error, 
    createBooking,
    updateBookingStatus
  };
}
