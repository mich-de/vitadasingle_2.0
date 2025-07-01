import React from 'react';
import { DollarSign, FileText, Calendar, CreditCard } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button } from '../ui';
import type { ExpenseCategory, PaymentMethod, FormOption } from '../../types';

interface ExpenseFormData {
  amount: string;
  description: string;
  category: ExpenseCategory | '';
  paymentMethod: PaymentMethod;
  date: string;
}

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const categoryOptions: FormOption[] = [
  { value: 'food', label: 'Alimentari' },
  { value: 'transport', label: 'Trasporti' },
  { value: 'utilities', label: 'Utenze' },
  { value: 'entertainment', label: 'Intrattenimento' },
  { value: 'health', label: 'Salute' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Formazione' },
  { value: 'other', label: 'Altro' }
];

const paymentMethodOptions: FormOption[] = [
  { value: 'card', label: 'Carta di Credito' },
  { value: 'cash', label: 'Contanti' },
  { value: 'transfer', label: 'Bonifico' },
  { value: 'check', label: 'Assegno' }
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const form = useForm<ExpenseFormData>({
    initialValues: {
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      paymentMethod: initialData?.paymentMethod || 'card',
      date: initialData?.date || new Date().toISOString().split('T')[0]
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ExpenseFormData, string>> = {};
      
      if (!values.amount.trim()) {
        errors.amount = 'Importo obbligatorio';
      } else {
        const amount = parseFloat(values.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.amount = 'Importo deve essere un numero maggiore di 0';
        } else if (amount > 999999) {
          errors.amount = 'Importo troppo elevato';
        }
      }
      
      if (!values.category) {
        errors.category = 'Categoria obbligatoria';
      }
      
      if (!values.date) {
        errors.date = 'Data obbligatoria';
      } else {
        const selectedDate = new Date(values.date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (selectedDate > today) {
          errors.date = 'La data non può essere nel futuro';
        } else if (selectedDate < oneYearAgo) {
          errors.date = 'La data non può essere più di un anno fa';
        }
      }
      
      if (values.description && values.description.length > 500) {
        errors.description = 'Descrizione troppo lunga (max 500 caratteri)';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      // Convert amount to number for submission
      const submissionData = {
        ...values,
        amount: parseFloat(values.amount).toFixed(2)
      };
      await onSubmit(submissionData);
    }
  });

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    
    // Ensure only one decimal point
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    form.setValue('amount', formatted);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        {/* Amount and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Importo"
              type="text"
              icon={DollarSign}
              placeholder="0.00"
              required
              value={form.values.amount}
              onChange={handleAmountChange}
              onBlur={() => form.setFieldTouched('amount')}
              error={form.touched.amount ? form.errors.amount : undefined}
              helperText="Inserisci l'importo in euro"
            />
          </div>
          
          <div>
            <Select
              label="Categoria"
              options={categoryOptions}
              placeholder="Seleziona categoria"
              required
              {...form.getFieldProps('category')}
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <Input
            label="Descrizione"
            type="text"
            icon={FileText}
            placeholder="Descrizione della spesa (opzionale)"
            {...form.getFieldProps('description')}
            helperText={`${form.values.description.length}/500 caratteri`}
          />
        </div>
        
        {/* Payment Method and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Metodo di Pagamento"
              options={paymentMethodOptions}
              icon={CreditCard}
              {...form.getFieldProps('paymentMethod')}
            />
          </div>
          
          <div>
            <Input
              label="Data"
              type="date"
              icon={Calendar}
              required
              {...form.getFieldProps('date')}
            />
          </div>
        </div>
        
        {/* Summary if editing */}
        {isEdit && form.values.amount && (
          <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
            <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Riepilogo Modifica
            </h4>
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
              <p>Importo: €{parseFloat(form.values.amount || '0').toFixed(2)}</p>
              <p>Categoria: {categoryOptions.find(c => c.value === form.values.category)?.label || 'Non specificata'}</p>
              <p>Data: {form.values.date ? new Date(form.values.date).toLocaleDateString('it-IT') : 'Non specificata'}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.isSubmitting}
            >
              Annulla
            </Button>
          )}
          
          <Button
            type="submit"
            loading={form.isSubmitting}
            disabled={form.isSubmitting || !form.isValid}
          >
            {isEdit ? 'Aggiorna Spesa' : 'Crea Spesa'}
          </Button>
        </div>
      </form>
      
      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400">
            Debug Info (only in development)
          </summary>
          <div className="mt-2 text-xs">
            <p><strong>Values:</strong> {JSON.stringify(form.values, null, 2)}</p>
            <p><strong>Errors:</strong> {JSON.stringify(form.errors, null, 2)}</p>
            <p><strong>Touched:</strong> {JSON.stringify(form.touched, null, 2)}</p>
            <p><strong>Is Valid:</strong> {form.isValid.toString()}</p>
          </div>
        </details>
      )}
    </div>
  );
};