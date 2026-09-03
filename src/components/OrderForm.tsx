import { useState } from 'react';
import { Send, Loader2, ShieldCheck, Home, User, Phone, Clock, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCheckoutFields, CheckoutField } from '@/hooks/useCheckoutFields';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  Phone,
  Clock,
  HelpCircle,
  MessageSquare,
};

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderForm({ open, onOpenChange }: OrderFormProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { language } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const isMobile = useIsMobile();
  const { fields: checkoutFields, loading: fieldsLoading } = useCheckoutFields();

  const t = {
    uz: {
      title: 'Buyurtma berish',
      description: 'Ma\'lumotlaringizni kiriting, biz siz bilan bog\'lanamiz',
      submit: 'Buyurtma yuborish',
      success: 'Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.',
      error: 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.',
      total: 'Jami',
      more: 'ta mahsulot',
      safe: 'Ma\'lumotlaringiz xavfsiz saqlanadi',
    },
    ru: {
      title: 'Оформить заказ',
      description: 'Введите ваши данные, мы свяжемся с вами',
      submit: 'Отправить заказ',
      success: 'Ваш заказ принят! Мы скоро свяжемся с вами.',
      error: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
      total: 'Итого',
      more: 'товаров',
      safe: 'Ваши данные в безопасности',
    },
  };

  const text = t[language];

  const getFieldLabel = (field: CheckoutField) => (language === 'uz' ? field.label_uz : field.label_ru);

  const getOptionLabel = (field: CheckoutField, value: string) => {
    const option = field.options.find(o => o.value === value);
    if (!option) return value;
    return language === 'uz' ? option.label_uz : option.label_ru;
  };

  const handlePhoneChange = (fieldId: string, value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (!cleaned.startsWith('998')) cleaned = '998' + cleaned;
    cleaned = cleaned.slice(0, 12);

    let formatted = '+998';
    if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 5);
    if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 8);
    if (cleaned.length > 8) formatted += ' ' + cleaned.slice(8, 10);
    if (cleaned.length > 10) formatted += ' ' + cleaned.slice(10, 12);

    setFieldValues(prev => ({ ...prev, [fieldId]: formatted }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    checkoutFields.forEach(field => {
      const value = fieldValues[field.id]?.trim() || '';

      if (field.is_required && !value) {
        newErrors[field.id] =
          field.field_type === 'radio'
            ? language === 'uz' ? 'Tanlash shart' : 'Выберите вариант'
            : language === 'uz' ? 'To\'ldirish shart' : 'Обязательное поле';
      }

      if (field.field_type === 'phone' && value) {
        const cleanedPhone = value.replace(/\s/g, '');
        if (!/^\+998\d{9}$/.test(cleanedPhone)) {
          newErrors[field.id] = language === 'uz' ? 'Noto\'g\'ri telefon formati' : 'Неверный формат телефона';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (items.length === 0) {
      toast({
        title: language === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста',
        description: language === 'uz' ? 'Iltimos, mahsulot qo\'shing' : 'Пожалуйста, добавьте товар',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const nameField = checkoutFields.find(f => f.field_type === 'text');
      const phoneField = checkoutFields.find(f => f.field_type === 'phone');

      const customerName = nameField ? (fieldValues[nameField.id] || '').trim() : '';
      const customerPhone = phoneField ? (fieldValues[phoneField.id] || '').replace(/\s/g, '') : '';

      if (!customerName) {
        throw new Error(language === 'uz' ? 'Ismingizni kiriting' : 'Введите имя');
      }
      if (!customerPhone || customerPhone.length < 13) {
        throw new Error(language === 'uz' ? 'Telefon raqamni to\'liq kiriting' : 'Введите полный номер телефона');
      }

      const messageFields = checkoutFields
        .filter(f => f.id !== nameField?.id && f.id !== phoneField?.id && fieldValues[f.id])
        .map(field => {
          const label = getFieldLabel(field);
          const value = field.field_type === 'radio'
            ? getOptionLabel(field, fieldValues[field.id])
            : fieldValues[field.id];
          return `${label}: ${value}`;
        });

      const customerMessage = messageFields.length > 0 ? messageFields.join('\n') : undefined;

      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        selected_options: {
          size: item.selectedSize,
          color: item.selectedColor,
        },
      }));

      const { data: orderResult, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_message: customerMessage,
          items: orderItems,
        },
      });

      if (orderError) {
        let errorMessage = language === 'uz' ? 'Buyurtma yaratishda xatolik' : 'Ошибка при создании заказа';
        try {
          if ((orderError as any).context?.body) {
            const body = await new Response((orderError as any).context.body).json();
            if (body?.error) errorMessage = body.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      if (orderResult && !orderResult.success) {
        throw new Error(orderResult.error || 'Buyurtma yaratishda xatolik');
      }

      toast({
        title: language === 'uz' ? 'Muvaffaqiyat!' : 'Успешно!',
        description: text.success,
      });

      clearCart();
      onOpenChange(false);
      setFieldValues({});
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: error.message || text.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const summary = (
    <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-2">
      {items.slice(0, 3).map(item => (
        <div key={item.product.id} className="flex justify-between gap-3 text-sm">
          <span className="text-muted-foreground line-clamp-1">
            {language === 'uz' ? item.product.name_uz : item.product.name_ru} × {item.quantity}
          </span>
          <span className="whitespace-nowrap tabular-nums">{formatPrice(item.product.price * item.quantity)}</span>
        </div>
      ))}
      {items.length > 3 && (
        <p className="text-xs text-muted-foreground">+{items.length - 3} {text.more}</p>
      )}
      <div className="border-t border-border pt-2 flex justify-between items-baseline">
        <span className="text-sm font-medium">{text.total}</span>
        <span className="font-serif text-lg font-bold tabular-nums">{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );

  const renderField = (field: CheckoutField) => {
    const IconComponent = field.icon ? iconMap[field.icon] : null;
    const label = getFieldLabel(field);
    const value = fieldValues[field.id] || '';
    const error = errors[field.id];

    const labelElement = (
      <Label
        htmlFor={field.id}
        className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
        {label} {field.is_required && '*'}
      </Label>
    );

    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-1.5">
            {labelElement}
            <Input
              id={field.id}
              className={`h-12 rounded-xl text-base ${error ? 'border-destructive' : ''}`}
              value={value}
              onChange={(e) => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
              placeholder={language === 'uz' ? `${label}ni kiriting` : `Введите ${label.toLowerCase()}`}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'phone':
        return (
          <div key={field.id} className="space-y-1.5">
            {labelElement}
            <Input
              id={field.id}
              type="tel"
              inputMode="tel"
              className={`h-12 rounded-xl text-base ${error ? 'border-destructive' : ''}`}
              value={value}
              onChange={(e) => handlePhoneChange(field.id, e.target.value)}
              placeholder="+998 90 123 45 67"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-1.5">
            {labelElement}
            <Textarea
              id={field.id}
              className={`rounded-xl text-base resize-none ${error ? 'border-destructive' : ''}`}
              value={value}
              onChange={(e) => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
              placeholder={language === 'uz' ? 'Sizning xabaringiz (ixtiyoriy)' : 'Ваше сообщение (необязательно)'}
              rows={3}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            {labelElement}
            <RadioGroup
              value={value}
              onValueChange={(val) => setFieldValues(prev => ({ ...prev, [field.id]: val }))}
              className="grid gap-2"
            >
              {field.options.map(option => (
                <label
                  key={option.id}
                  htmlFor={`${field.id}-${option.id}`}
                  className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                    value === option.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} />
                  <span className="text-sm">
                    {language === 'uz' ? option.label_uz : option.label_ru}
                  </span>
                </label>
              ))}
            </RadioGroup>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const fields = fieldsLoading ? (
    <div className="py-6 flex justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <div className="space-y-4">{checkoutFields.map(renderField)}</div>
  );

  const submitButton = (
    <Button type="submit" size="lg" className="w-full h-12 rounded-xl gap-2" disabled={loading || fieldsLoading}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {language === 'uz' ? 'Yuborilmoqda...' : 'Отправка...'}
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          {text.submit}
        </>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-3xl border-t max-h-[92vh] flex flex-col gap-0"
        >
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            {/* Grabber + header */}
            <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-border">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted-foreground/25" />
              <h2 className="font-serif text-xl font-bold text-center">{text.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground text-center">{text.description}</p>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">
              {summary}
              {fields}
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> {text.safe}
              </p>
            </div>

            {/* Sticky footer */}
            <div
              className="flex-shrink-0 border-t border-border bg-background px-5 pt-3"
              style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
            >
              {submitButton}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {summary}
          {fields}
          {submitButton}
        </form>
      </DialogContent>
    </Dialog>
  );
}
