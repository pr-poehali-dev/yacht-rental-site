
import { useState, useCallback, useEffect } from 'react';
import { adminUsersApi, AdminUserFilters, PaginationParams, PaginatedResponse } from '@/services/adminApi';
import { User } from '@/data/users';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<AdminUserFilters>({
    role: 'all',
    search: '',
  });

  const fetchUsers = useCallback(async (
    newFilters?: AdminUserFilters,
    newPagination?: PaginationParams
  ) => {
    setLoading(true);
    setError(null);

    try {
      const currentFilters = newFilters || filters;
      const currentPagination = {
        page: newPagination?.page || pagination.page,
        limit: newPagination?.limit || pagination.limit
      };

      const response: PaginatedResponse<User> = await adminUsersApi.getUsers(
        currentFilters,
        currentPagination
      );

      setUsers(response.data);
      setPagination({
        page: response.page,
        limit: currentPagination.limit,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить пользователей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    fetchUsers(filters, { page, limit: pagination.limit });
  };

  const handleLimitChange = (limit: number) => {
    fetchUsers(filters, { page: 1, limit });
  };

  const handleFilterChange = (newFilters: AdminUserFilters) => {
    fetchUsers(newFilters, { page: 1, limit: pagination.limit });
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newUser = await adminUsersApi.createUser(userData);
      if (newUser) {
        await fetchUsers();
        return { success: true, user: newUser };
      }
      return { success: false, error: 'Не удалось создать пользователя' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await adminUsersApi.updateUser(id, userData);
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'Не удалось обновить пользователя' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const success = await adminUsersApi.deleteUser(id);
      if (success) {
        await fetchUsers();
        return { success: true };
      }
      return { success: false, error: 'Не удалось удалить пользователя' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    createUser,
    updateUser,
    deleteUser
  };
}
