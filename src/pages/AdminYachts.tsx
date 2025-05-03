
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  FileText, 
  Grid, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Yacht, yachts as yachtsData } from '@/data/yachts';

const AdminYachts = () => {
  const navigate = useNavigate();
  const [yachts, setYachts] = useState<Yacht[]>([...yachtsData]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('table');
  
  // Эффект имитации загрузки данных с API
  useEffect(() => {
    const fetchYachts = async () => {
      setLoading(true);
      // Имитация API-запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      setYachts([...yachtsData]);
      setLoading(false);
    };
    
    fetchYachts();
  }, []);
  
  // Фильтрация яхт по поисковому запросу
  const filteredYachts = yachts.filter(yacht => 
    yacht.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yacht.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Функция для удаления яхты
  const handleDeleteYacht = (id: string) => {
    // В реальном приложении здесь был бы запрос к API
    setYachts(yachts.filter(yacht => yacht.id !== id));
  };
  
  // Имитация запроса к API для обновления данных
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setYachts([...yachtsData]);
    setLoading(false);
  };

  return (
    <AdminLayout title="Управление яхтами">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Яхты</CardTitle>
              <CardDescription>
                Управление каталогом яхт и их характеристиками
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Button onClick={handleRefresh} variant="outline" disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Обновить
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить яхту
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Добавление новой яхты</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о новой яхте для добавления в каталог.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-500 flex items-center mb-4">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Функция добавления яхт будет доступна после полной интеграции с API.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button">
                      Отмена
                    </Button>
                    <Button type="submit" disabled>
                      Сохранить
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Поиск яхт..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Tabs value={view} onValueChange={(val) => setView(val as 'grid' | 'table')}>
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="table" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Таблица
                    </TabsTrigger>
                    <TabsTrigger value="grid" className="flex items-center">
                      <Grid className="h-4 w-4 mr-2" />
                      Плитка
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-lg text-gray-500">Загрузка...</span>
              </div>
            ) : (
              <>
                {filteredYachts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Яхты не найдены</p>
                  </div>
                ) : (
                  <>
                    {view === 'table' ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[80px]">ID</TableHead>
                              <TableHead>Название</TableHead>
                              <TableHead>Тип</TableHead>
                              <TableHead>Длина</TableHead>
                              <TableHead>Цена/день</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredYachts.map((yacht) => (
                              <TableRow key={yacht.id}>
                                <TableCell className="font-medium">{yacht.id}</TableCell>
                                <TableCell>{yacht.name}</TableCell>
                                <TableCell>{yacht.type}</TableCell>
                                <TableCell>{yacht.length} м</TableCell>
                                <TableCell>{yacht.pricePerDay.toLocaleString()} ₽</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => navigate(`/admin/yachts/${yacht.id}`)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Удаление яхты</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Вы уверены, что хотите удалить яхту "{yacht.name}"?
                                            Это действие нельзя отменить.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDeleteYacht(yacht.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            Удалить
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredYachts.map((yacht) => (
                          <Card key={yacht.id} className="overflow-hidden">
                            <div className="h-40 relative">
                              <img 
                                src={yacht.images[0]} 
                                alt={yacht.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg">{yacht.name}</CardTitle>
                              <CardDescription>
                                {yacht.type} • {yacht.length} м • {yacht.capacity} чел.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {yacht.description}
                              </p>
                              <p className="font-semibold mt-2">
                                {yacht.pricePerDay.toLocaleString()} ₽/день
                              </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <div className="flex justify-between w-full">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/yachts/${yacht.id}`)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Удалить
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Удаление яхты</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Вы уверены, что хотите удалить яхту "{yacht.name}"?
                                        Это действие нельзя отменить.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteYacht(yacht.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Удалить
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Всего яхт: {filteredYachts.length}
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default AdminYachts;
