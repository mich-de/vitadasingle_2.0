import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Users, Euro, Clock, Phone, MapPin, TrendingUp, Percent } from 'lucide-react';
import { apiService } from '../services/apiService';

interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  source: string;
  specialRequests?: string;
}

const Bookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Errore caricamento prenotazioni:', error);
      setError('Impossibile caricare le prenotazioni dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (newBooking: Booking) => {
    try {
      const createdBooking = await apiService.createBooking(newBooking);
      setBookings([...bookings, createdBooking]);
    } catch (error) {
      console.error('Errore creazione prenotazione:', error);
      setError('Impossibile creare la prenotazione');
    }
  };

  const updateBooking = async (id: string, updatedBooking: Booking) => {
    try {
      await apiService.updateBooking(id, updatedBooking);
      setBookings(bookings.map(b => (b.id === id ? updatedBooking : b)));
    } catch (error) {
      console.error('Errore aggiornamento prenotazione:', error);
      setError('Impossibile aggiornare la prenotazione');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;
    try {
      await apiService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (error) {
      console.error('Errore eliminazione prenotazione:', error);
      setError('Impossibile eliminare la prenotazione');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const monthlyStats = {
    totalRevenue: bookings.reduce((sum, booking) => 
      booking.status === 'confirmed' ? sum + booking.totalAmount : sum, 0),
    totalBookings: bookings.filter(b => b.status === 'confirmed').length,
    occupancyRate: 75, 
    avgNightlyRate: bookings.length > 0 ? bookings.reduce((sum, booking) => sum + booking.pricePerNight, 0) / bookings.length : 0
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento prenotazioni dal database JSON...
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
          onClick={fetchBookings}
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
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('bookings.title')}
        </h1>
        <button className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
          {t('bookings.addNew')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('bookings.totalRevenue')}
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {formatCurrency(monthlyStats.totalRevenue)}
              </p>
            </div>
            <Euro className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('bookings.occupancyRate')}
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {monthlyStats.occupancyRate}%
              </p>
            </div>
            <Percent className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('bookings.avgNightlyRate')}
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {formatCurrency(monthlyStats.avgNightlyRate)}
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('bookings.totalBookings')}
              </p>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {monthlyStats.totalBookings}
              </p>
            </div>
            <Calendar className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-card-light dark:hover:bg-card-dark'
            }`}
          >
            {status === 'all' ? t('bookings.all') : t(`bookings.status.${status}`)}
          </button>
        ))}
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {t('bookings.upcoming')}
          </h2>
        </div>
        <div className="divide-y divide-border-light/30 dark:divide-border-dark/30">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {booking.guestName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {t(`bookings.status.${booking.status}`)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{booking.guests} {t('bookings.guests')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{booking.source}</span>
                    </div>
                  </div>
                  
                  {booking.specialRequests && (
                    <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                      {t('bookings.note')}: {booking.specialRequests}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {booking.nights} {t('bookings.nights')} × {formatCurrency(booking.pricePerNight)}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-white text-sm rounded hover:opacity-90">
                      {t('bookings.contact')}
                    </button>
                    <button className="px-3 py-1 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm rounded border border-border-light dark:border-border-dark hover:bg-card-light dark:hover:bg-card-dark">
                      {t('bookings.viewDetails')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
