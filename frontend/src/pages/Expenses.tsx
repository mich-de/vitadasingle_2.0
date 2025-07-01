import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToastContext } from '../context/ToastContext';
import { useModal } from '../hooks/useModal';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/ui/Button';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import ExpenseStats from '../components/expenses/ExpenseStats';
import { apiService } from '../services/apiService';
import type { Expense } from '@/types';

// Interface aggiornata per i dati dal JSON
interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  paymentMethod?: string;
  recurring?: boolean;
  frequency?: string;
}

const Expenses = () => {
  const { t } = useLanguage();
  const { success, error } = useToastContext();
  
  // State
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  
  // Modals
  const addModal = useModal();
  const editModal = useModal<ExpenseItem>();
  const deleteModal = useModal<ExpenseItem>();
  
  // API (ready for future implementation)
  const { get } = useApi();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      // Legge OBBLIGATORIAMENTE dal JSON tramite API
      const data = await apiService.getSpese();
      setExpenses(data);
      
    } catch (error) {
      console.error('Errore caricamento spese:', error);
      setErrorMsg('Impossibile caricare le spese dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    addModal.openModal();
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    editModal.openModal(expense);
  };

  const handleDeleteExpense = (expense: ExpenseItem) => {
    deleteModal.openModal(expense);
  };

  const confirmDelete = async () => {
    if (!deleteModal.data) return;
    
    try {
      // Elimina dal JSON tramite API
      await apiService.deleteSpesa(deleteModal.data.id);
      
      // Remove from local state
      setExpenses(prev => prev.filter(exp => exp.id !== deleteModal.data?.id));
      
      // Clear selection if deleted expense was selected
      if (selectedExpense?.id === deleteModal.data.id) {
        setSelectedExpense(null);
      }
      
      success('Spesa eliminata con successo');
      deleteModal.closeModal();
    } catch (err) {
      error('Errore durante l\'eliminazione della spesa');
    }
  };

  const handleExpenseSuccess = (expense: Expense) => {
    // Refresh expenses list
    fetchExpenses();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      food: 'Alimentari',
      utilities: 'Utenze',
      transport: 'Trasporti',
      entertainment: 'Intrattenimento',
      health: 'Salute',
      shopping: 'Shopping',
      other: 'Altro'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      card: 'Carta',
      transfer: 'Bonifico',
      cash: 'Contanti',
      other: 'Altro'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    
    const expenseDate = new Date(expense.date);
    const currentDate = new Date();
    
    if (filter === 'month') {
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear();
    }
    
    if (filter === 'year') {
      return expenseDate.getFullYear() === currentDate.getFullYear();
    }
    
    return true;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    if (sortBy === 'category') {
      return getCategoryLabel(a.category).localeCompare(getCategoryLabel(b.category));
    }
    return 0;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento spese dal database JSON...
        </span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">Errore: </strong>
          <span>{errorMsg}</span>
        </div>
        <button 
          onClick={fetchExpenses}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('expenses.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            💰 Dati caricati da: <code>/data/spese.json</code>
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={handleAddExpense}
        >
          {t('expenses.addNew')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Totale ({filter === 'all' ? 'sempre' : 
                filter === 'month' ? 'questo mese' : 'quest\'anno'})
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Numero spese
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {filteredExpenses.length}
              </p>
            </div>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Spesa media
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {formatCurrency(filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0)}
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[ 
            { key: 'all', label: 'Tutte' },
            { key: 'month', label: 'Questo mese' },
            { key: 'year', label: 'Quest\'anno' }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Ordina per
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark"
          >
            <option value="date">Data</option>
            <option value="amount">Importo</option>
            <option value="category">Categoria</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Le mie spese ({filteredExpenses.length})
                </h2>
                <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Totale: <span className="text-primary-light dark:text-primary-dark">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
            
            {sortedExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Nessuna spesa trovata
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {filter === 'all' ? 'Aggiungi la tua prima spesa.' : 'Nessuna spesa per il periodo selezionato.'}
                </p>
                <Button icon={Plus} onClick={handleAddExpense}>
                  Aggiungi spesa
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light/30 dark:divide-border-dark/30">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Spesa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Importo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light/30 dark:divide-border-dark/30">
                    {sortedExpenses.map((expense) => (
                      <tr 
                        key={expense.id} 
                        onClick={() => setSelectedExpense(expense)}
                        className="cursor-pointer hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                            {expense.title}
                          </div>
                          {expense.description && (
                            <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              {expense.description}
                            </div>
                          )}
                          {expense.recurring && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              🔄 Ricorrente ({expense.frequency})
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          {getCategoryLabel(expense.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Edit}
                              onClick={() => handleEditExpense(expense)}
                            />
                            <Button
                              size="sm"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => handleDeleteExpense(expense)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {sortedExpenses.length > 0 && (
            <div className="mt-6">
              <ExpenseStats expenses={filteredExpenses} period={filter as 'all' | 'month' | 'year'} />
            </div>
          )}
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft h-full flex items-center justify-center p-6 text-center">
          <div>
            {selectedExpense ? (
              <div className="text-left w-full">
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                  Dettagli spesa
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Titolo</p>
                    <p className="font-medium">{selectedExpense.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Importo</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedExpense.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Categoria</p>
                    <p>{getCategoryLabel(selectedExpense.category)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Data</p>
                    <p>{formatDate(selectedExpense.date)}</p>
                  </div>
                  {selectedExpense.paymentMethod && (
                    <div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Metodo pagamento</p>
                      <p>{getPaymentMethodLabel(selectedExpense.paymentMethod)}</p>
                    </div>
                  )}
                  {selectedExpense.description && (
                    <div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Descrizione</p>
                      <p>{selectedExpense.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <DollarSign size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Seleziona una spesa per visualizzarne i dettagli
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onSuccess={handleExpenseSuccess}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.data?.title}
        itemType="spesa"
        loading={false}
      />
    </div>
  );
};

export default Expenses;