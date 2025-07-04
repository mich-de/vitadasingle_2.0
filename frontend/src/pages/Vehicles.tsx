import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, getDaysRemaining, getTypeLabel, getFuelTypeLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/apiService';
import VehicleFormModal from '../components/modals/VehicleFormModal';
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle as VehicleItem } from '../types/entities/vehicle';

const Vehicles = () => {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | undefined>(undefined);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getVeicoli();
      setVehicles(data);
      
    } catch (error) {
      console.error('Errore caricamento veicoli:', error);
      setError('Impossibile caricare i veicoli dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedVehicle(undefined);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEdit = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo veicolo?')) {
      try {
        await apiService.deleteVeicolo(id);
        fetchVehicles();
      } catch (error) {
        console.error('Failed to delete vehicle', error);
        setError('Errore durante l\'eliminazione del veicolo');
      }
    }
  };

  const handleSave = async (data: CreateVehicleInput | UpdateVehicleInput) => {
    try {
      if (isEditing && selectedVehicle) {
        await apiService.updateVeicolo(selectedVehicle.id, data as UpdateVehicleInput);
      } else {
        await apiService.createVeicolo(data as CreateVehicleInput);
      }
      fetchVehicles();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Failed to save vehicle', error);
      setError('Errore durante il salvataggio del veicolo');
    }
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
        <button onClick={handleAddNew} className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90">
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
                        Stato
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Valore Attuale
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Azione
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                    {vehicles.map(vehicle => (
                      <tr key={vehicle.id} className="hover:bg-background-light dark:hover:bg-background-dark">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {vehicle.year} - {vehicle.licensePlate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {getTypeLabel(vehicle.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {vehicle.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {formatCurrency(vehicle.currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(vehicle)} className="text-primary-light hover:text-primary-light/80 dark:text-primary-dark dark:hover:text-primary-dark/80 mr-3">
                            Modifica
                          </button>
                          <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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

        {/* Vehicle Details Panel - Can be implemented later */}

      </div>

      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        vehicle={selectedVehicle}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Vehicles;