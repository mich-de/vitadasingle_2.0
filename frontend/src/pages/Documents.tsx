import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText, 
  Upload, 
  Search, 
  Download, 
  Share, 
  Edit3, 
  FolderOpen,
  HardDrive,
  MoreVertical,
  Filter,
  Trash2,
  File as FileIcon, 
  Image, 
  FileSpreadsheet
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'jpg' | 'png' | 'txt' | 'other';
  size: number; // in bytes
  category: 'personal' | 'financial' | 'legal' | 'medical' | 'contracts' | 'taxes' | 'insurance' | 'other';
  dateModified: string;
  dateCreated: string;
  tags?: string[];
  shared?: boolean;
  file?: string;
}

const Documents = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Legge OBBLIGATORIAMENTE dal JSON tramite API
      const data = await apiService.getDocumenti();
      setDocuments(data);
      
    } catch (error) {
      console.error('Errore caricamento documenti:', error);
      setError('Impossibile caricare i documenti dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo documento?')) return;
    
    try {
      // Elimina dal JSON tramite API
      await apiService.deleteDocumento(id);
      
      // Aggiorna lo stato locale
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
      console.error('Errore eliminazione documento:', error);
      setError('Impossibile eliminare il documento');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText size={20} className="text-red-500" />;
      case 'xlsx':
        return <FileSpreadsheet size={20} className="text-green-500" />;
      case 'jpg':
      case 'png':
        return <Image size={20} className="text-blue-500" />;
      case 'txt':
        return <FileIcon size={20} className="text-gray-500" />;
      default:
        return <FileIcon size={20} className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'financial': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'legal': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'medical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'contracts': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'taxes': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'insurance': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30';
      case 'other': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      personal: 'Personali',
      financial: 'Finanziari',
      legal: 'Legali',
      medical: 'Medici',
      contracts: 'Contratti',
      taxes: 'Tasse',
      insurance: 'Assicurazioni',
      other: 'Altri'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
      }
    });

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const storageLimit = 5 * 1024 * 1024 * 1024; // 5GB limit
  const usagePercentage = (totalSize / storageLimit) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento documenti dal database JSON...
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
          onClick={fetchDocuments}
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
            {t('documents.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            📄 Dati caricati da: <code>/data/documenti.json</code>
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
          <Upload size={16} />
          Carica documento
        </button>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
            Utilizzo storage
          </h3>
          <HardDrive className="text-text-secondary-light dark:text-text-secondary-dark" size={20} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Storage utilizzato
            </p>
            <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {formatFileSize(totalSize)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Storage totale
            </p>
            <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {formatFileSize(storageLimit)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Storage libero
            </p>
            <p className="text-xl font-bold text-green-500">
              {formatFileSize(storageLimit - totalSize)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-2">
            <div 
              className="bg-primary-light dark:bg-primary-dark h-2 rounded-full" 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Utilizzato: {usagePercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={16} />
          <input
            type="text"
            placeholder="Cerca documenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark"
        >
          <option value="all">Tutte le categorie</option>
          <option value="personal">Personali</option>
          <option value="financial">Finanziari</option>
          <option value="legal">Legali</option>
          <option value="medical">Medici</option>
          <option value="contracts">Contratti</option>
          <option value="taxes">Tasse</option>
          <option value="insurance">Assicurazioni</option>
          <option value="other">Altri</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
          className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark"
        >
          <option value="date">Ordina per data</option>
          <option value="name">Ordina per nome</option>
          <option value="size">Ordina per dimensione</option>
        </select>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Documenti recenti ({filteredDocuments.length})
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded">
                <Filter size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
              <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded">
                <FolderOpen size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
            </div>
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Nessun documento trovato
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {searchTerm || categoryFilter !== 'all' ? 'Prova filtri diversi.' : 'Carica il tuo primo documento.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-light/30 dark:divide-border-dark/30">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="p-4 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(document.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                        {document.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <span>{formatFileSize(document.size)}</span>
                        <span>{formatDate(document.dateModified)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(document.category)}`}>
                          {getCategoryLabel(document.category)}
                        </span>
                        {document.shared && (
                          <span className="text-blue-500 text-xs">🔗 Condiviso</span>
                        )}
                      </div>
                      {document.tags && (
                        <div className="flex gap-1 mt-1">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 bg-background-light dark:bg-background-dark text-xs rounded border border-border-light dark:border-border-dark"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors">
                      <Download size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                    <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors">
                      <Share size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                    <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors">
                      <Edit3 size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                    <button 
                      onClick={() => deleteDocument(document.id)}
                      className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors">
                      <MoreVertical size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
