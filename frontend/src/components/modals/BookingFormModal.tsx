import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

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

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  booking?: Booking;
  isEditing?: boolean;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({ isOpen, onClose, onSave, booking, isEditing = false }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Booking>>({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    pricePerNight: 0,
    status: 'pending',
    source: 'direct',
    specialRequests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (booking && isOpen) {
      setFormData({ ...booking });
    } else if (!isEditing && isOpen) {
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        pricePerNight: 0,
        status: 'pending',
        source: 'direct',
        specialRequests: ''
      });
    }
    setErrors({});
  }, [booking, isOpen, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['guests', 'pricePerNight'].includes(name) ? parseInt(value) || 0 : value
    }));

    // Calculate nights and total amount when check-in or check-out dates change
    if (name === 'checkIn' || name === 'checkOut') {
      const checkIn = name === 'checkIn' ? value : formData.checkIn;
      const checkOut = name === 'checkOut' ? value : formData.checkOut;

      if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

        if (nights > 0) {
          const pricePerNight = formData.pricePerNight || 0;
          setFormData(prev => ({
            ...prev,
            nights,
            totalAmount: nights * pricePerNight
          }));
        }
      }
    }

    // Recalculate total amount when price per night changes
    if (name === 'pricePerNight') {
      const nights = formData.nights || 0;
      const pricePerNight = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        totalAmount: nights * pricePerNight
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.guestName?.trim()) {
      newErrors.guestName = t('bookings.errors.guestNameRequired');
    }
    if (!formData.checkIn) {
      newErrors.checkIn = t('bookings.errors.checkInRequired');
    }
    if (!formData.checkOut) {
      newErrors.checkOut = t('bookings.errors.checkOutRequired');
    }
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = t('bookings.errors.checkOutAfterCheckIn');
      }
    }
    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = t('bookings.errors.guestsPositive');
    }
    if (!formData.pricePerNight || formData.pricePerNight < 0) {
      newErrors.pricePerNight = t('bookings.errors.pricePositive');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as Booking);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('bookings.editBooking') : t('bookings.addBooking')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('bookings.guestName')} *
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.guestName ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
          />
          {errors.guestName && <p className="mt-1 text-sm text-red-500">{errors.guestName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('bookings.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default BookingFormModal;