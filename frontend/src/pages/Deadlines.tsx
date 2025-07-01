// src/pages/Deadlines.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type {
  Deadline,
  DeadlinePriority,
  CreateDeadlineInput,
  DeadlineFilters,
  SortField,
  SortOrder
} from '@/types';

// Componente principale
const Deadlines: React.FC = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filters, setFilters] = useState<DeadlineFilters>({});
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateDeadlineInput>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: '',
    tags: []
  });

  const fetchDeadlines = useCallback(async () => {
    try {
      const data = await apiService.getScadenze();
      setDeadlines(data);
    } catch (error) {
      console.error('Errore nel caricamento delle scadenze:', error);
    }
  }, []);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Il titolo è obbligatorio');
      return;
    }

    try {
      const newDeadlineData = {
        title: formData.title.trim(),
        description: formData.description?.trim(),
        dueDate: formData.dueDate, // Già in formato stringa ISO
        priority: formData.priority,
        category: formData.category?.trim(),
        tags: formData.tags?.filter(tag => tag.trim() !== '') || []
      };
      
      const createdDeadline = await apiService.createScadenza(newDeadlineData);
      setDeadlines(prev => [...prev, createdDeadline]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        category: '',
        tags: []
      });
      setShowForm(false);
    } catch (error) {
      console.error("Errore nella creazione della scadenza:", error);
      alert("Errore nella creazione della scadenza. Controlla la console per i dettagli.");
    }
  };

  const handleUpdateDeadline = async (id: string, updates: Partial<Deadline>) => {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const response = await apiService.updateScadenza(id, updatedData);
      setDeadlines(prev =>
        prev.map(deadline =>
          deadline.id === id ? response : deadline
        )
      );
    } catch (error) {
      console.error("Errore nell'aggiornamento della scadenza:", error);
      alert("Errore nell'aggiornamento della scadenza. Controlla la console per i dettagli.");
    }
  };

  const handleDeleteDeadline = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa scadenza?')) {
      try {
        await apiService.deleteScadenza(id);
        setDeadlines(prev => prev.filter(deadline => deadline.id !== id));
      } catch (error) {
        console.error("Errore nell'eliminazione della scadenza:", error);
        alert("Errore nell'eliminazione della scadenza. Controlla la console per i dettagli.");
      }
    }
  };

  // Toggle completamento
  const toggleCompletion = async (id: string) => {
    const deadline = deadlines.find(d => d.id === id);
    if (deadline) {
      await handleUpdateDeadline(id, { isCompleted: !deadline.isCompleted });
    }
  };

  // Stile priorità
  const getPriorityStyle = (priority: DeadlinePriority): string => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Label priorità
  const getPriorityLabel = (priority: DeadlinePriority): string => {
    switch (priority) {
      case 'low': return 'Bassa';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  // Controlla se è scaduta
  const isOverdue = (deadline: Deadline): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(deadline.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return !deadline.isCompleted && dueDate < today;
  };

  // Controlla se scade oggi
  const isDueToday = (deadline: Deadline): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(deadline.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  // Filtra e ordina deadlines
  const filteredAndSortedDeadlines = deadlines
    .filter(deadline => {
      if (filters.priority && deadline.priority !== filters.priority) return false;
      if (filters.isCompleted !== undefined && deadline.isCompleted !== filters.isCompleted) return false;
      if (filters.category && deadline.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { 
            'low': 1, 
            'medium': 2, 
            'high': 3, 
            'urgent': 4 
          };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Categorie uniche
  const uniqueCategories = Array.from(new Set(deadlines.map(d => d.category).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Gestione Scadenze</h1>
        <p className="text-gray-600">Organizza e monitora tutte le tue scadenze importanti</p>
      </div>
      
      {/* Statistiche veloci */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{deadlines.length}</div>
          <div className="text-sm text-blue-600">Totali</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{deadlines.filter(d => d.isCompleted).length}</div>
          <div className="text-sm text-green-600">Completate</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{deadlines.filter(d => isDueToday(d)).length}</div>
          <div className="text-sm text-yellow-600">Scadono oggi</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{deadlines.filter(d => isOverdue(d)).length}</div>
          <div className="text-sm text-red-600">Scadute</div>
        </div>
      </div>

      {/* Pulsante per mostrare/nascondere form */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md"
        >
          {showForm ? '❌ Chiudi Form' : '➕ Nuova Scadenza'}
        </button>
      </div>

      {/* Form per creare deadline */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">✨ Aggiungi Nuova Scadenza</h2>
          <form onSubmit={handleCreateDeadline}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📝 Titolo *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Inserisci il titolo della scadenza"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📅 Data di Scadenza *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">⚡ Priorità</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as DeadlinePriority }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">🟢 Bassa</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🟠 Alta</option>
                  <option value="urgent">🔴 Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Categoria</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="es. Lavoro, Personale, Studio..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">📄 Descrizione</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Aggiungi dettagli sulla scadenza..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                ✅ Crea Scadenza
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                ❌ Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtri */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                priority: e.target.value as DeadlinePriority || undefined 
              }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tutte</option>
              <option value="low">🟢 Bassa</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🟠 Alta</option>
              <option value="urgent">🔴 Urgente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              value={filters.isCompleted === undefined ? '' : filters.isCompleted.toString()}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                isCompleted: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tutte</option>
              <option value="false">📋 Da completare</option>
              <option value="true">✅ Completate</option>
            </select>
          </div>
          
          {uniqueCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  category: e.target.value || undefined 
                }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tutte</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordina per</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="dueDate">📅 Data scadenza</option>
              <option value="createdAt">🕐 Data creazione</option>
              <option value="priority">⚡ Priorità</option>
              <option value="title">🔤 Titolo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordine</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="asc">⬆️ Crescente</option>
              <option value="desc">⬇️ Decrescente</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <button
              onClick={() => setFilters({})}
              className="text-sm text-gray-600 hover:text-gray-800 underline px-3 py-2"
            >
              🗑️ Pulisci filtri
            </button>
          </div>
        </div>
      </div>

      {/* Lista deadline */}
      <div className="space-y-4">
        {filteredAndSortedDeadlines.map(deadline => (
          <div 
            key={deadline.id} 
            className={`border rounded-lg p-4 transition-all duration-200 ${
              deadline.isCompleted 
                ? 'bg-gray-50 border-gray-200 opacity-75' 
                : isOverdue(deadline)
                ? 'bg-red-50 border-red-200 shadow-md'
                : isDueToday(deadline)
                ? 'bg-yellow-50 border-yellow-200 shadow-md'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold text-gray-900 ${
                    deadline.isCompleted ? 'line-through' : ''
                  }`}>
                    {deadline.title}
                  </h3>
                  {isOverdue(deadline) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ⚠️ SCADUTA
                    </span>
                  )}
                  {isDueToday(deadline) && !deadline.isCompleted && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      📅 OGGI
                    </span>
                  )}
                </div>
                
                {deadline.description && (
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {deadline.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium border ${getPriorityStyle(deadline.priority)}`}>
                    {getPriorityLabel(deadline.priority)}
                  </span>
                  
                  <span className="text-gray-600 flex items-center gap-1">
                    📅 {new Date(deadline.dueDate).toLocaleDateString('it-IT')}
                  </span>
                  
                  {deadline.category && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">
                      🏷️ {deadline.category}
                    </span>
                  )}
                  
                  <span className="text-gray-400 text-xs">
                    Creata: {new Date(deadline.createdAt).toLocaleDateString('it-IT')}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleCompletion(deadline.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    deadline.isCompleted 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {deadline.isCompleted ? '🔄 Riapri' : '✅ Completa'}
                </button>
                
                <button
                  onClick={() => handleDeleteDeadline(deadline.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stato vuoto */}
      {filteredAndSortedDeadlines.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {deadlines.length === 0 ? 'Nessuna scadenza ancora' : 'Nessuna scadenza trovata'}
          </h3>
          <p className="text-gray-600 mb-4">
            {deadlines.length === 0 
              ? 'Aggiungi la tua prima scadenza per iniziare a organizzarti!' 
              : 'Prova a modificare i filtri per vedere più risultati'
            }
          </p>
          {deadlines.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              🚀 Crea la prima scadenza
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Deadlines;
