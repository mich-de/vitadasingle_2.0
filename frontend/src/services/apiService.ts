import type { 
  Deadline, 
  CreateDeadlineInput, 
  UpdateDeadlineInput, 
  Property, 
  Document, 
  Expense, 
  Event, 
  Contact, 
  Vehicle, 
  Workout, 
  Profile, 
  DashboardStats 
} from '@/types';

// Import Booking type separately to debug
import type { Booking } from '@/types/entities/booking';

// Re-export for debugging
export type { Booking };

// API Base URL
const API_BASE_URL = 'http://localhost:4000/api';

// Classe per gestire tutte le chiamate API
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper per gestire response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as any;
  }

  // Helper per chiamate GET
  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate POST
  private async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate PUT
  private async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  // Helper per chiamate DELETE
  private async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
    return this.handleResponse<T>(response);
  }

  // === SCADENZE API ===
  async getScadenze(): Promise<Deadline[]> {
    return this.get<Deadline[]>('/scadenze');
  }

  async createScadenza(scadenza: CreateDeadlineInput): Promise<Deadline> {
    return this.post<Deadline>('/scadenze', scadenza);
  }

  async updateScadenza(id: string, scadenza: UpdateDeadlineInput): Promise<Deadline> {
    return this.put<Deadline>(`/scadenze/${id}`, scadenza);
  }

  async deleteScadenza(id: string): Promise<Deadline> {
    return this.delete<Deadline>(`/scadenze/${id}`);
  }

  // === PROPRIETÀ API ===
  async getProprieta(): Promise<Property[]> {
    return this.get<Property[]>('/proprieta');
  }

  async createProprieta(proprieta: Property): Promise<Property> {
    return this.post<Property>('/proprieta', proprieta);
  }

  async updateProprieta(id: string, proprieta: Partial<Property>): Promise<Property> {
    return this.put<Property>(`/proprieta/${id}`, proprieta);
  }

  async deleteProprieta(id: string): Promise<Property> {
    return this.delete<Property>(`/proprieta/${id}`);
  }

  // === DOCUMENTI API ===
  async getDocumenti(): Promise<Document[]> {
    return this.get<Document[]>('/documenti');
  }

  async createDocumento(documento: Document): Promise<Document> {
    return this.post<Document>('/documenti', documento);
  }

  async updateDocumento(id: string, documento: Partial<Document>): Promise<Document> {
    return this.put<Document>(`/documenti/${id}`, documento);
  }

  async deleteDocumento(id: string): Promise<Document> {
    return this.delete<Document>(`/documenti/${id}`);
  }

  // === SPESE API ===
  async getSpese(): Promise<Expense[]> {
    return this.get<Expense[]>('/spese');
  }

  async createSpesa(spesa: Expense): Promise<Expense> {
    return this.post<Expense>('/spese', spesa);
  }

  async updateSpesa(id: string, spesa: Partial<Expense>): Promise<Expense> {
    return this.put<Expense>(`/spese/${id}`, spesa);
  }

  async deleteSpesa(id: string): Promise<Expense> {
    return this.delete<Expense>(`/spese/${id}`);
  }

  // === EVENTI API ===
  async getEventi(): Promise<Event[]> {
    return this.get<Event[]>('/eventi');
  }

  async createEvento(evento: Event): Promise<Event> {
    return this.post<Event>('/eventi', evento);
  }

  async updateEvento(id: string, evento: Partial<Event>): Promise<Event> {
    return this.put<Event>(`/eventi/${id}`, evento);
  }

  async deleteEvento(id: string): Promise<Event> {
    return this.delete<Event>(`/eventi/${id}`);
  }

  // === CONTATTI API ===
  async getContatti(): Promise<Contact[]> {
    return this.get<Contact[]>('/contatti');
  }

  async createContatto(contatto: Contact): Promise<Contact> {
    return this.post<Contact>('/contatti', contatto);
  }

  async updateContatto(id: string, contatto: Partial<Contact>): Promise<Contact> {
    return this.put<Contact>(`/contatti/${id}`, contatto);
  }

  async deleteContatto(id: string): Promise<Contact> {
    return this.delete<Contact>(`/contatti/${id}`);
  }

  // === VEICOLI API ===
  async getVeicoli(): Promise<Vehicle[]> {
    return this.get<Vehicle[]>('/veicoli');
  }

  async createVeicolo(veicolo: Vehicle): Promise<Vehicle> {
    return this.post<Vehicle>('/veicoli', veicolo);
  }

  async updateVeicolo(id: string, veicolo: Partial<Vehicle>): Promise<Vehicle> {
    return this.put<Vehicle>(`/veicoli/${id}`, veicolo);
  }

  async deleteVeicolo(id: string): Promise<Vehicle> {
    return this.delete<Vehicle>(`/veicoli/${id}`);
  }

  // === BOOKINGS API ===
  async getBookings(): Promise<Booking[]> {
    return this.get<Booking[]>('/bookings');
  }

  async createBooking(booking: Booking): Promise<Booking> {
    return this.post<Booking>('/bookings', booking);
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
    return this.put<Booking>(`/bookings/${id}`, booking);
  }

  async deleteBooking(id: string): Promise<Booking> {
    return this.delete<Booking>(`/bookings/${id}`);
  }

  // === WORKOUTS API ===
  async getWorkouts(): Promise<Workout[]> {
    return this.get<Workout[]>('/workouts');
  }

  async createWorkout(workout: Workout): Promise<Workout> {
    return this.post<Workout>('/workouts', workout);
  }

  async updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout> {
    return this.put<Workout>(`/workouts/${id}`, workout);
  }

  async deleteWorkout(id: string): Promise<Workout> {
    return this.delete<Workout>(`/workouts/${id}`);
  }

  // === PROFILE API ===
  async getProfile(): Promise<Profile> {
    return this.get<Profile>('/profile');
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    return this.put<Profile>('/profile', profile);
  }

  // === DASHBOARD API ===
  async getDashboard(): Promise<DashboardStats> {
    return this.get<DashboardStats>('/dashboard');
  }
}

// Istanza singleton del servizio API
export const apiService = new ApiService();

// Esporta anche la classe per eventuale uso avanzato
export default ApiService;
