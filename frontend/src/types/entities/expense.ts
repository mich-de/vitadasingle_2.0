// src/types/entities/expense.ts

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description?: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'utilities' 
  | 'entertainment' 
  | 'health' 
  | 'shopping' 
  | 'education' 
  | 'other';

export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'check';

export interface CreateExpenseInput {
  amount: number;
  description?: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  receiptUrl?: string;
}

export interface UpdateExpenseInput {
  amount?: number;
  description?: string;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  date?: string;
  receiptUrl?: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
}
