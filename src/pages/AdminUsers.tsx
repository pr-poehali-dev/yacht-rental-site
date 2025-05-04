
import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { User } from '@/data/users';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AdminUserFilters } from '@/services/adminApi';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  UserCheck, 
  UserX, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
}

const AdminUsers = () => {
  const { toast } = useToast();
  const { 
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
  } = useAdminUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'user' | 'admin'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });

  // Обработка поиска и фильтрации
  const handleSearch = () => {
    const newFilters: AdminUserFilters = {
      ...filters,
      search: searchQuery,
      role: selectedRole === 'all' ? undefined : selectedRole
    };
    handleFilterChange(newFilters);
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    handleFilterChange({ role: 'all', search: '' });
  };

  // Открыть диалог создания пользователя
  const openCreateDialog = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'user'
    });
    setIsCreateDialogOpen(true);
  };

  // Открыть диалог редактирования пользователя
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Не показываем пароль в форме редактирования
      phone: user.phone || '',
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  // Открыть диалог удаления пользователя
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Обработка изменения формы
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка изменения роли пользователя
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as 'user' | 'admin'
    }));
  };

  // Создание нового пользователя
  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const result = await createUser(formData);
    if (result.success) {
      toast({
        title: "Успех",
        description: "Пользователь успешно создан",
      });
      setIsCreateDialogOpen(false);
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось создать пользователя",
        variant: "destructive"
      });
    }
  };

  // Обновление пользователя
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      role: formData.role
    };

    // Добавляем пароль только если он был изменен
    if (formData.password) {
      userData.password = formData.password;
    }

    const result = await updateUser(selectedUser.id, userData);
    if (result.success) {
      toast({
        title: "Успех",
        description: "Пользователь успешно обновлен",
      });
      setIsEditDialogOpen(false);
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось обновить пользователя",
        variant: "destructive"
      });
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      toast({
        title: "Успех",
        description: "Пользователь успешно удален",
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось удалить пользователя",
        variant: "destructive"
      });
    }
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-bold">Управление пользователями</CardTitle>
              <CardDescription>
                Просмотр, создание и изменение учетных записей пользователей
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить пользователя
            </Button>
          </CardHeader>
          <CardContent>
            {/* Фильтры */}
            <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск по имени или email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр по роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Роль пользователя</SelectLabel>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    <SelectItem value="user">Обычный пользователь</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={handleSearch}>
                  <Filter className="mr-2 h-4 w-4" />
                  Применить
                </Button>
                <Button variant="outline" onClick={handleResetFilters}>
                  Сбросить
                </Button>
              </div>
            </div>
            
            {/* Таблица пользователей */}
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-primary"></div>
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
                {error}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Пользователи не найдены
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || '—'}</TableCell>
                            <TableCell>
                              {user.role === 'admin' ? (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                  <UserCheck className="mr-1 h-3 w-3" />
                                  Администратор
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                  <UserX className="mr-1 h-3 w-3" />
                                  Пользователь
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(user)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Пагинация */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Показано {users.length} из {pagination.total} записей
                  </div>
                  {pagination.totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pagination.page === i + 1}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => pagination.page < pagination.totalPages && handlePageChange(pagination.page + 1)}
                            className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Диалог создания пользователя */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Создать нового пользователя</DialogTitle>
            <DialogDescription>
              Заполните форму для создания новой учетной записи
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                placeholder="Введите имя пользователя" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                placeholder="email@example.com" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                placeholder="Введите пароль" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleFormChange} 
                placeholder="+7 (XXX) XXX-XX-XX" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Роль пользователя</Label>
              <Select onValueChange={handleRoleChange} defaultValue="user">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Обычный пользователь</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleCreateUser}
              disabled={!formData.name || !formData.email || !formData.password}
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования пользователя */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>
              Измените данные выбранного пользователя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Имя *</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                placeholder="Введите имя пользователя" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input 
                id="edit-email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                placeholder="email@example.com" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Пароль (оставьте пустым, чтобы не менять)</Label>
              <Input 
                id="edit-password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                placeholder="Введите новый пароль" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Телефон</Label>
              <Input 
                id="edit-phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleFormChange} 
                placeholder="+7 (XXX) XXX-XX-XX" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Роль пользователя</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Обычный пользователь</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={!formData.name || !formData.email}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления пользователя */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить пользователя</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого пользователя? Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="rounded-md bg-gray-50 p-4">
                <p><strong>Имя:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Роль:</strong> {selectedUser.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
