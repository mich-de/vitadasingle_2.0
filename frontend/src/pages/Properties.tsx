import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProperties } from '../hooks/useProperties';
import PropertyFormModal from '../components/modals/PropertyFormModal';
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '../types/entities/property';

const Properties = () => {
  const { t } = useLanguage();
  const { 
    properties, 
    loading, 
    error, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    fetchProperties 
  } = useProperties();
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa proprietà?')) return;
    
    await deleteProperty(id);

    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  };

  const handleAddProperty = () => {
    setIsEditing(false);
    setCurrentProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setIsEditing(true);
    setCurrentProperty(property);
    setIsModalOpen(true);
  };

  const handleSaveProperty = async (propertyData: CreatePropertyInput | UpdatePropertyInput) => {
    try {
      if (isEditing && currentProperty) {
        const updatedProperty = await updateProperty(currentProperty.id, propertyData as UpdatePropertyInput);
        
        // Update selected property if it's the one being edited
        if (selectedProperty && selectedProperty.id === currentProperty.id) {
          setSelectedProperty(updatedProperty);
        }
      } else {
        await addProperty(propertyData as CreatePropertyInput);
      }
      
      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving property:', error);
      // The hook will set the error state, but you might want a local error for the modal
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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
    }).format(amount || 0);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento proprietà dal database JSON...
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
          onClick={fetchProperties}
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
            {t('properties.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            🏠 Dati caricati da: <code>/data/proprieta.json</code>
          </p>
        </div>
        <button 
          onClick={handleAddProperty}
          className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90"
        >
          {t('properties.addNew')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark">
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                Le mie proprietà ({properties.length})
              </h2>
            </div>
            
            {properties.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Nessuna proprietà trovata nel database JSON.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Proprietà
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Dimensione
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Valore attuale
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {properties.map((property) => (
                      <tr 
                        key={property.id} 
                        onClick={() => handlePropertySelect(property)}
                        className="cursor-pointer hover:bg-background-light/50 dark:hover:bg-background-dark/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{property.name}</div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{property.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          {property.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          {property.size} m²
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">
                          {formatCurrency(property.currentValue || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            className="text-primary-light dark:text-primary-dark hover:underline mr-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProperty(property);
                            }}
                          >
                            Modifica
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProperty(property.id);
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
          {selectedProperty ? (
            <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark">
              <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">Dettagli proprietà</h2>
              </div>
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">{selectedProperty.name}</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{selectedProperty.address}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Tipo</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Dimensione</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{selectedProperty.size} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Data acquisto</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{formatDate(selectedProperty.purchaseDate || '')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Prezzo acquisto</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark">{formatCurrency(selectedProperty.purchasePrice || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Valore attuale</p>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatCurrency(selectedProperty.currentValue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Variazione valore</p>
                    <p className={`font-medium ${(selectedProperty.currentValue || 0) > (selectedProperty.purchasePrice || 0) ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency((selectedProperty.currentValue || 0) - (selectedProperty.purchasePrice || 0))}
                      &nbsp;({Math.round(((selectedProperty.currentValue || 0) - (selectedProperty.purchasePrice || 0)) / (selectedProperty.purchasePrice || 1) * 100)}%)
                    </p>
                  </div>
                </div>

                {(selectedProperty as any).expenses && (
                  <div className="mt-4">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Spese annuali</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(selectedProperty as any).expenses.imu && (
                        <div>IMU: {formatCurrency((selectedProperty as any).expenses.imu)}</div>
                      )}
                      {(selectedProperty as any).expenses.tari && (
                        <div>TARI: {formatCurrency((selectedProperty as any).expenses.tari)}</div>
                      )}
                      {(selectedProperty as any).expenses.condominio && (
                        <div>Condominio: {formatCurrency((selectedProperty as any).expenses.condominio)}</div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Note</p>
                  <p className="mt-1 text-text-primary-light dark:text-text-primary-dark">{selectedProperty.notes}</p>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={() => handleEditProperty(selectedProperty)}
                    className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90"
                  >
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
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Seleziona una proprietà dalla lista per visualizzarne i dettagli</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Form Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProperty}
        property={currentProperty as Property}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Properties;