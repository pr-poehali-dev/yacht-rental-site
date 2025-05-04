
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  CustomReport, 
  ReportSchedule, 
  ReportDelivery 
} from '@/services/adminApi';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Clock, Mail, Plus, Save, Trash2, Users } from 'lucide-react';
import { scheduleOptions, deliveryOptions } from '@/hooks/useAdminAnalytics';

interface ReportSchedulerProps {
  report: CustomReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (
    reportId: string, 
    schedule: {
      frequency: ReportSchedule;
      deliveryMethod: ReportDelivery;
      recipients?: string[];
    }
  ) => Promise<{ success: boolean; report?: CustomReport; error?: string }>;
}

const ReportScheduler = ({ 
  report, 
  open, 
  onOpenChange, 
  onSchedule 
}: ReportSchedulerProps) => {
  const { toast } = useToast();
  const [frequency, setFrequency] = useState<ReportSchedule>(report.schedule || 'monthly');
  const [deliveryMethod, setDeliveryMethod] = useState<ReportDelivery>(report.deliveryMethod || 'email');
  const [recipients, setRecipients] = useState<string[]>(report.recipients || []);
  const [newRecipient, setNewRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Предварительный расчет даты следующего запуска
  const getNextRunDate = (frequency: ReportSchedule): Date => {
    const today = new Date();
    
    switch (frequency) {
      case 'daily':
        return addDays(today, 1);
      case 'weekly':
        return addWeeks(today, 1);
      case 'monthly':
        return addMonths(today, 1);
      case 'quarterly':
        return addMonths(today, 3);
      default:
        return addMonths(today, 1);
    }
  };
  
  // Форматирование даты следующего запуска для отображения
  const formatNextRunDate = (frequency: ReportSchedule): string => {
    const nextDate = getNextRunDate(frequency);
    return format(nextDate, 'dd MMMM yyyy', { locale: ru });
  };
  
  // Добавление email получателя
  const handleAddRecipient = () => {
    if (!newRecipient.trim()) return;
    
    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient)) {
      toast({
        title: "Некорректный email",
        description: "Пожалуйста, введите корректный адрес электронной почты",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };
  
  // Удаление email получателя
  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };
  
  // Сохранение расписания отчета
  const handleSaveSchedule = async () => {
    if (deliveryMethod === 'email' && recipients.length === 0) {
      toast({
        title: "Необходимы получатели",
        description: "Добавьте хотя бы один email для отправки отчета",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await onSchedule(report.id, {
        frequency,
        deliveryMethod,
        recipients: deliveryMethod === 'email' ? recipients : undefined
      });
      
      if (result.success) {
        toast({
          title: "Расписание настроено",
          description: `Отчет будет запускаться ${formatFrequency(frequency).toLowerCase()}`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось настроить расписание",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при настройке расписания",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Форматирование частоты для отображения
  const formatFrequency = (frequency: ReportSchedule): string => {
    const option = scheduleOptions.find(o => o.value === frequency);
    return option ? option.label : 'Ежемесячно';
  };
  
  // Форматирование способа доставки для отображения
  const formatDeliveryMethod = (method: ReportDelivery): string => {
    const option = deliveryOptions.find(o => o.value === method);
    return option ? option.label : 'По электронной почте';
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Настройка расписания отчета</DialogTitle>
          <DialogDescription>
            Настройте периодичность и способ получения отчета "{report.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Частота выполнения</Label>
            <Select value={frequency} onValueChange={(val) => setFrequency(val as ReportSchedule)}>
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Следующий запуск: {formatNextRunDate(frequency)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delivery-method">Способ получения</Label>
            <Select value={deliveryMethod} onValueChange={(val) => setDeliveryMethod(val as ReportDelivery)}>
              <SelectTrigger id="delivery-method" className="w-full">
                <SelectValue placeholder="Выберите способ" />
              </SelectTrigger>
              <SelectContent>
                {deliveryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {deliveryMethod === 'email' && (
            <div className="space-y-3">
              <Label>Получатели отчета</Label>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Введите email" 
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleAddRecipient}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {recipients.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipients.map(email => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1 py-1">
                      <Mail className="w-3 h-3" />
                      <span>{email}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRecipient(email)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Добавьте получателей для отправки отчета по email
                </p>
              )}
            </div>
          )}
          
          <div className="bg-muted/50 rounded-lg p-3 mt-2">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Сводка настроек
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="text-muted-foreground">Отчет:</span> {report.name}
              </li>
              <li>
                <span className="text-muted-foreground">Частота:</span> {formatFrequency(frequency)}
              </li>
              <li>
                <span className="text-muted-foreground">Способ получения:</span> {formatDeliveryMethod(deliveryMethod)}
              </li>
              {deliveryMethod === 'email' && (
                <li>
                  <span className="text-muted-foreground">Получатели:</span> {recipients.length > 0 
                    ? `${recipients.length} адресов` 
                    : 'Не указаны'}
                </li>
              )}
              <li>
                <span className="text-muted-foreground">Следующий запуск:</span> {formatNextRunDate(frequency)}
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button 
            type="submit"
            onClick={handleSaveSchedule}
            disabled={loading || (deliveryMethod === 'email' && recipients.length === 0)}
          >
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить расписание
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportScheduler;
