import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/apiService';

interface VehicleItem {
  id: string;
  name: string;
  type: 'auto' | 'moto';
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  mileage: number;
  fuelType: string;
  insurance: {
    company: string;
    policyNumber: string;
    expiryDate: string;
    annualCost: number;
  };
  registration: {
    expiryDate: string;
    annualCost: number;
  };
  inspection: {
    lastDate: string;
    nextDate: string;
    valid: boolean;
  };
  documents?: string[];
  notes?: string;
}

interface VehicleEditModalProps {
  vehicle: VehicleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVehicle: VehicleItem) => void;
}

const VehicleEditModal = ({ vehicle, isOpen, onClose, onSave }: VehicleEditModalProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<VehicleItem | null>(null);

  useEffect(() => {
    if (vehicle) {
      setFormData(JSON.parse(JSON.stringify(vehicle))); // Deep copy
    }
  }, [vehicle]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'insurance' | 'registration' | 'inspection') => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const updatedVehicle = await apiService.updateVeicolo(formData.id, formData);
      onSave(updatedVehicle);
      onClose();
    } catch (error) {
      console.error('Errore aggiornamento veicolo:', error);
      // Qui potresti mostrare un messaggio di errore all'utente
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">Modifica Veicolo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campi del form qui... Aggiungeremo i campi in un secondo momento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome Veicolo" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="Targa" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Modello" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Anno" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} placeholder="Data Acquisto" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} placeholder="Prezzo Acquisto" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="number" name="currentValue" value={formData.currentValue} onChange={handleChange} placeholder="Valore Corrente" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="Chilometraggio" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="p-2 rounded bg-input-light dark:bg-input-dark">
              <option value="benzina">Benzina</option>
              <option value="diesel">Diesel</option>
              <option value="ibrida">Ibrida</option>
              <option value="elettrica">Elettrica</option>
              <option value="gpl">GPL</option>
              <option value="metano">Metano</option>
            </select>
          </div>

          <h3 class="text-lg font-semibold mt-4">Assicurazione</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="company" value={formData.insurance.company} onChange={(e) => handleNestedChange(e, 'insurance')} placeholder="Compagnia" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="text" name="policyNumber" value={formData.insurance.policyNumber} onChange={(e) => handleNestedChange(e, 'insurance')} placeholder="Numero Polizza" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="date" name="expiryDate" value={formData.insurance.expiryDate} onChange={(e) => handleNestedChange(e, 'insurance')} placeholder="Data Scadenza" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="number" name="annualCost" value={formData.insurance.annualCost} onChange={(e) => handleNestedChange(e, 'insurance')} placeholder="Costo Annuale" className="p-2 rounded bg-input-light dark:bg-input-dark" />
          </div>

          <h3 class="text-lg font-semibold mt-4">Revisione</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="lastDate" value={formData.inspection.lastDate} onChange={(e) => handleNestedChange(e, 'inspection')} placeholder="Ultima Revisione" className="p-2 rounded bg-input-light dark:bg-input-dark" />
            <input type="date" name="nextDate" value={formData.inspection.nextDate} onChange={(e) => handleNestedChange(e, 'inspection')} placeholder="Prossima Revisione" className="p-2 rounded bg-input-light dark:bg-input-dark" />
          </div>

          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Note" className="w-full p-2 rounded bg-input-light dark:bg-input-dark"></textarea>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark">Annulla</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary-light dark:bg-primary-dark text-white">Salva Modifiche</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleEditModal;