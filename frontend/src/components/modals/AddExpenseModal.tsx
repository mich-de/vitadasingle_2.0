import React from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import type { Expense } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (expense: Expense) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { post } = useApi();
  const { success, error } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const response = await post<{ message: string; expense: Expense }>('/expenses', {
        amount: parseFloat(data.amount),
        description: data.description || null,
        category: data.category,
        paymentMethod: data.paymentMethod,
        date: data.date
      });

      success(response.message || 'Spesa creata con successo!');
      onSuccess?.(response.expense);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la creazione della spesa';
      error(errorMessage);
      throw err; // Re-throw to let form handle it
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aggiungi Nuova Spesa"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Aggiungi una nuova spesa
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Compila i campi per registrare la spesa nel tuo budget
            </p>
          </div>
        </div>

        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};