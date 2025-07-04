import React from 'react';
import type { Expense } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getCategoryLabel: (category: string) => string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete, formatCurrency, formatDate, getCategoryLabel }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {expenses.map(expense => (
        <div key={expense.id} className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{expense.description || formatCurrency(expense.amount)}</h3>
            <p className="text-sm text-gray-500">{getCategoryLabel(expense.category)}</p>
            <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
          </div>
          <div className="text-right">
            <p className={`font-bold text-xl ${expense.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(expense.amount)}
            </p>
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(expense)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};