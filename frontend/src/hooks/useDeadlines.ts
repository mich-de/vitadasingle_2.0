import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Deadline, CreateDeadlineInput, UpdateDeadlineInput } from "../types/entities/deadline";
import { v4 as uuidv4 } from 'uuid';

export const useDeadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeadlines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getScadenze();
      setDeadlines(data);
    } catch (error) {
      console.error('Errore caricamento scadenze:', error);
      setError('Impossibile caricare le scadenze dal database JSON');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const addDeadline = async (deadlineData: CreateDeadlineInput) => {
    try {
      const newDeadline: Deadline = {
        ...deadlineData,
        id: uuidv4(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const createdDeadline = await apiService.createScadenza(newDeadline);
      setDeadlines(prev => [...prev, createdDeadline]);
      return createdDeadline;
    } catch (error) {
      console.error('Error creating deadline:', error);
      setError('Si è verificato un errore durante la creazione della scadenza');
      throw error;
    }
  };

  const updateDeadline = async (id: string, deadlineData: UpdateDeadlineInput) => {
    try {
      const updatedDeadline = await apiService.updateScadenza(id, {
        ...deadlineData,
        updatedAt: new Date().toISOString()
      });
      setDeadlines(prev => 
        prev.map(d => d.id === id ? { ...d, ...updatedDeadline } : d)
      );
      return updatedDeadline;
    } catch (error) {
      console.error('Error updating deadline:', error);
      setError('Si è verificato un errore durante l\'aggiornamento della scadenza');
      throw error;
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      await apiService.deleteScadenza(id);
      setDeadlines(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting deadline:', error);
      setError('Impossibile eliminare la scadenza');
      throw error;
    }
  };

  return {
    deadlines,
    loading,
    error,
    fetchDeadlines,
    addDeadline,
    updateDeadline,
    deleteDeadline,
  };
};