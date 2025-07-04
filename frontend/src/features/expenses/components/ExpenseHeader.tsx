import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ExpenseHeaderProps {
  onAddExpense: () => void;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ onAddExpense, totalAmount, formatCurrency }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t('expenses.title')}</h1>
      <div>
        <span className="text-lg font-semibold mr-4">{t('expenses.total')}: {formatCurrency(totalAmount)}</span>
        <Button onClick={onAddExpense}>
          <Plus className="mr-2 h-4 w-4" />
          {t('expenses.addNew')}
        </Button>
      </div>
    </div>
  );
};