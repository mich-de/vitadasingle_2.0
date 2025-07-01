import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import './App.css';

// Import actual implemented pages
import Dashboard from './pages/Dashboard';
import Deadlines from './pages/Deadlines';
import Properties from './pages/Properties';
import Vehicles from './pages/Vehicles';
import Expenses from './pages/Expenses';
import Bookings from './pages/Bookings';
import Workouts from './pages/Workouts';
import Events from './pages/Events';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts'; // 📞 NUOVA PAGINA
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/deadlines" element={<Deadlines />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/events" element={<Events />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;