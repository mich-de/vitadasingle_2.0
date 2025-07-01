import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/apiService';
import VehicleEditModal from '../components/VehicleEditModal';
import VehicleDocumentsModal from '../components/VehicleDocumentsModal';

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

const Vehicles = () => {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Legge OBBLIGATORIAMENTE dal JSON tramite API
      const data = await apiService.getVeicoli();
      setVehicles(data);
      
    } catch (error) {
      console.error('Errore caricamento veicoli:', error);
      setError('Impossibile caricare i veicoli dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo veicolo?')) return;
    
    try {
      // Elimina dal JSON tramite API
      await apiService.deleteVeicolo(id);
      
      // Aggiorna lo stato locale
      setVehicles(vehicles.filter(v => v.id !== id));
      
      // Deseleziona se era selezionato
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
      }
    } catch (error) {
      console.error('Errore eliminazione veicolo:', error);
      setError('Impossibile eliminare il veicolo');
    }
  };

  const handleSaveVehicle = (updatedVehicle: VehicleItem) => {
    setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    if (selectedVehicle?.id === updatedVehicle.id) {
      setSelectedVehicle(updatedVehicle);
    }
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

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getTypeLabel = (type: string) => {
    return type === 'auto' ? 'Auto' : type === 'moto' ? 'Moto' : type;
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const types = {
      benzina: 'Benzina',
      diesel: 'Diesel',
      ibrida: 'Ibrida',
      elettrica: 'Elettrica',
      gpl: 'GPL',
      metano: 'Metano'
    };
    return types[fuelType as keyof typeof types] || fuelType;
  };

  const handleVehicleSelect = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
  };

  const handleEditClick = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDocumentsClick = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setIsDocumentsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento veicoli dal database JSON...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">Errore: </strong>
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchVehicles}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('vehicles.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            🚗 Dati caricati da: <code>/data/veicoli.json</code>
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90">
          {t('vehicles.addNew')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark">
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                I miei veicoli ({vehicles.length})
              </h2>
            </div>
            
            {vehicles.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Nessun veicolo trovato nel database JSON.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Veicolo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Targa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Scadenza Assicurazione
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Azione
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                    {vehicles.map(vehicle => (
                      <tr key={vehicle.id} onClick={() => handleVehicleSelect(vehicle)} className="hover:bg-background-light dark:hover:bg-background-dark cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{vehicle.name}</div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.mileage?.toLocaleString()} km
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          <span className={`px-2 py-1 rounded-full text-xs ${vehicle.type === 'auto' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {getTypeLabel(vehicle.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-primary-light dark:text-text-primary-dark">
                          {vehicle.licensePlate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getDaysRemaining(vehicle.insurance.expiryDate) <= 30 ? 'bg-red-500' : getDaysRemaining(vehicle.insurance.expiryDate) <= 90 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                            <div>
                              <div className="text-text-primary-light dark:text-text-primary-dark">{formatDate(vehicle.insurance.expiryDate)}</div>
                              <div className={`text-xs ${getDaysRemaining(vehicle.insurance.expiryDate) <= 30 ? 'text-red-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                                {getDaysRemaining(vehicle.insurance.expiryDate)} giorni
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-primary-light dark:text-primary-dark hover:underline mr-3">Modifica</button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteVehicle(vehicle.id);
                            }}
                            className="text-red-600 dark:text-red-400 hover:underline">
                            Elimina
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedVehicle ? (
            <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark">
              <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">Dettagli veicolo</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${selectedVehicle.type === 'auto' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {getTypeLabel(selectedVehicle.type)}
                  </span>
                  <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">{selectedVehicle.name}</h3>
                </div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Targa</p>
                    <p className="font-mono text-text-primary-light dark:text-text-primary-dark">{selectedVehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Carburante</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{getFuelTypeLabel(selectedVehicle.fuelType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Chilometraggio</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{selectedVehicle.mileage?.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Data acquisto</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{formatDate(selectedVehicle.purchaseDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Prezzo acquisto</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{formatCurrency(selectedVehicle.purchasePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Valore attuale</p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatCurrency(selectedVehicle.currentValue)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Deprezzamento</p>
                  <p className="text-red-500 font-medium">
                    {formatCurrency(selectedVehicle.currentValue - selectedVehicle.purchasePrice)}
                    &nbsp;({Math.round((selectedVehicle.currentValue - selectedVehicle.purchasePrice) / selectedVehicle.purchasePrice * 100)}%)
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">Scadenze importanti</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-md bg-background-light dark:bg-background-dark">
                      <div>
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Assicurazione</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {selectedVehicle.insurance.company} - {selectedVehicle.insurance.policyNumber}
                        </p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          Costo annuale: {formatCurrency(selectedVehicle.insurance.annualCost)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatDate(selectedVehicle.insurance.expiryDate)}</p>
                        <p className={`text-sm ${getDaysRemaining(selectedVehicle.insurance.expiryDate) <= 30 ? 'text-red-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                          {getDaysRemaining(selectedVehicle.insurance.expiryDate)} giorni rimanenti
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-md bg-background-light dark:bg-background-dark">
                      <div>
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Bollo auto</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Costo annuale: {formatCurrency(selectedVehicle.registration.annualCost)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatDate(selectedVehicle.registration.expiryDate)}</p>
                        <p className={`text-sm ${getDaysRemaining(selectedVehicle.registration.expiryDate) <= 30 ? 'text-red-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                          {getDaysRemaining(selectedVehicle.registration.expiryDate)} giorni rimanenti
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-md bg-background-light dark:bg-background-dark">
                      <div>
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Revisione</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Ultima: {formatDate(selectedVehicle.inspection.lastDate)}
                        </p>
                        <p className={`text-xs ${selectedVehicle.inspection.valid ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedVehicle.inspection.valid ? '✅ Valida' : '❌ Scaduta'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatDate(selectedVehicle.inspection.nextDate)}</p>
                        <p className={`text-sm ${getDaysRemaining(selectedVehicle.inspection.nextDate) <= 30 ? 'text-red-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                          {getDaysRemaining(selectedVehicle.inspection.nextDate)} giorni rimanenti
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVehicle.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Note</p>
                    <p className="mt-1 text-text-primary-light dark:text-text-primary-dark">{selectedVehicle.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <button className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90">
                    Modifica
                  </button>
                  <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-md hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition duration-200 text-text-primary-light dark:text-text-primary-dark">
                    Visualizza documenti
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark h-full flex items-center justify-center p-6 text-center">
              <div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Seleziona un veicolo dalla lista per visualizzarne i dettagli
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <VehicleEditModal
        vehicle={selectedVehicle}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveVehicle}
      />

      <VehicleDocumentsModal
        vehicle={selectedVehicle}
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
      />
    </div>
  );
};

export default Vehicles;