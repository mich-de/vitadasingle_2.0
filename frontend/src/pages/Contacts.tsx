import { useState, useEffect } from 'react';
import { Plus, Search, User, Users, AlertTriangle, Trash2, Edit, MoreVertical, Phone, Mail, MapPin, Save, X, Star } from 'lucide-react';
import type { Contact, ContactType } from '../types/entities/contact';
import { apiService } from '../services/apiService';
import ContactFormModal from '../components/modals/ContactFormModal';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Legge OBBLIGATORIAMENTE dal JSON tramite API
      const data = await apiService.getContatti();
      setContacts(data);
      
    } catch (error) {
      console.error('Errore caricamento contatti:', error);
      setError('Impossibile caricare i contatti dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (newContact: Contact) => {
    try {
      const createdContact = await apiService.createContatto(newContact);
      setContacts([...contacts, createdContact]);
    } catch (error) {
      console.error('Errore creazione contatto:', error);
      setError('Impossibile creare il contatto');
    }
  };

  const updateContact = async (id: string, updatedContact: Contact) => {
    try {
      await apiService.updateContatto(id, updatedContact);
      setContacts(contacts.map(c => (c.id === id ? updatedContact : c)));
    } catch (error) {
      console.error('Errore aggiornamento contatto:', error);
      setError('Impossibile aggiornare il contatto');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo contatto?')) return;
    
    try {
      // Elimina dal JSON tramite API
      await apiService.deleteContatto(id);
      
      // Aggiorna lo stato locale
      setContacts(contacts.filter(c => c.id !== id));
      
      // Deseleziona se era selezionato
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Errore eliminazione contatto:', error);
      setError('Impossibile eliminare il contatto');
    }
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (isEditing && selectedContact) {
      updateContact(selectedContact.id, { ...contact, id: selectedContact.id });
    } else {
      createContact(contact);
    }
    setIsModalOpen(false);
  };

  const getTypeLabel = (type: ContactType) => {
    const types = {
      medico: 'Medico',
      avvocato: 'Avvocato',
      commercialista: 'Commercialista',
      assicurazione: 'Assicurazione',
      tecnico: 'Tecnico',
      emergenza: 'Emergenza',
      altro: 'Altro'
    };
    return types[type] || type;
  };

  const getTypeColor = (type: ContactType) => {
    switch (type) {
      case 'medico': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'avvocato': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'commercialista': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'assicurazione': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'tecnico': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'emergenza': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'altro': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type: ContactType) => {
    switch (type) {
      case 'medico': return <User className="text-green-500" size={20} />;
      case 'avvocato': return <Users className="text-purple-500" size={20} />;
      case 'commercialista': return <User className="text-blue-500" size={20} />;
      case 'assicurazione': return <User className="text-orange-500" size={20} />;
      case 'tecnico': return <User className="text-yellow-500" size={20} />;
      case 'emergenza': return <AlertTriangle className="text-red-500" size={20} />;
      default: return <User className="text-gray-500" size={20} />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.notes && contact.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    // Emergenze sempre in cima
    if (a.emergency && !b.emergency) return -1;
    if (!a.emergency && b.emergency) return 1;
    return a.name.localeCompare(b.name);
  });

  const emergencyContacts = contacts.filter(c => c.emergency);
  const regularContacts = contacts.filter(c => !c.emergency);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento contatti dal database JSON...
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
          onClick={fetchContacts}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Contatti
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              📞 Dati caricati da: <code>/data/contatti.json</code>
            </p>
          </div>
          <button 
            onClick={handleAddContact}
            className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={16} />
            Aggiungi contatto
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              Totale contatti
            </h3>
            <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
              {contacts.length}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              Emergenze
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {emergencyContacts.length}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              Professionisti
            </h3>
            <p className="text-2xl font-bold text-blue-500">
              {regularContacts.length}
            </p>
          </div>
        </div>

        {/* Filtri */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={16} />
            <input
              type="text"
              placeholder="Cerca contatti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark"
          >
            <option value="all">Tutti i tipi</option>
            <option value="medico">Medici</option>
            <option value="avvocato">Avvocati</option>
            <option value="commercialista">Commercialisti</option>
            <option value="assicurazione">Assicurazioni</option>
            <option value="tecnico">Tecnici</option>
            <option value="emergenza">Emergenze</option>
            <option value="altro">Altri</option>
          </select>
        </div>

        {/* Lista contatti */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Contatti ({filteredContacts.length})
            </h2>
          </div>
          
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <User size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                Nessun contatto trovato
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                {searchTerm || typeFilter !== 'all' ? 'Prova a modificare i filtri di ricerca.' : 'Aggiungi il tuo primo contatto.'}
              </p>
              {!searchTerm && typeFilter === 'all' && (
                <button 
                  onClick={handleAddContact}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90">
                  <Plus size={16} />
                  Aggiungi contatto
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border-light/30 dark:divide-border-dark/30">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(contact.type)}`}>
                        {getTypeIcon(contact.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                            {contact.name}
                          </h3>
                          {contact.emergency && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                              Emergenza
                            </span>
                          )}
                          {contact.favorite && (
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(contact.type)}`}>
                            {getTypeLabel(contact.type)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditContact(contact)}
                        className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors"
                      >
                        <Edit size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                      </button>
                      <button 
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Dettagli aggiuntivi */}
                  <div className="mt-2 pl-13 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{contact.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {contact.notes && (
                    <p className="mt-2 pl-13 text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                      {contact.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contact={selectedContact || undefined}
        isEditing={isEditing}
      />
    </>
  );
};

export default Contacts;
