import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard, // for Dashboard
  CalendarCheck,   // for Deadlines
  Building2,       // for Properties
  Car,             // for Vehicles
  CreditCard,      // for Expenses
  BedDouble,       // for B&B Bookings
  Dumbbell,        // for Workouts
  CalendarDays,    // for Events (alternative to CalendarCheck if more generic)
  FileText,        // for Documents
  Users,           // for Contacts 📞
  User,            // for Profile
  Settings,        // for Settings
  
  Search           // for Quick Search
} from 'lucide-react';

const modules = [
  { name: 'nav.dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'nav.deadlines', icon: CalendarCheck, path: '/deadlines' },
  { name: 'nav.properties', icon: Building2, path: '/properties' },
  { name: 'nav.vehicles', icon: Car, path: '/vehicles' },
  { name: 'nav.expenses', icon: CreditCard, path: '/expenses' },
  { name: 'nav.bookings', icon: BedDouble, path: '/bookings' },
  { name: 'nav.workouts', icon: Dumbbell, path: '/workouts' },
  { name: 'nav.events', icon: CalendarDays, path: '/events' },
  { name: 'nav.documents', icon: FileText, path: '/documents' },
  { name: 'nav.contacts', icon: Users, path: '/contacts' }, // 📞 NUOVO
  { name: 'nav.profile', icon: User, path: '/profile' },
  { name: 'nav.settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="w-64 min-h-screen bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-r border-border-light/30 dark:border-border-dark/30 hidden md:flex flex-col shadow-glass">
      <div className="p-5 border-b border-border-light/30 dark:border-border-dark/30">
        {/* Logo with gradient effect */}
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">VitaApp</h2>
      </div>

      <div className="p-4 mb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
          </div>
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border-light/30 dark:border-border-dark/30 bg-background-light/50 dark:bg-background-dark/50 text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3">
        <nav className="space-y-1.5">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <NavLink
                key={module.path}
                to={module.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                      : 'text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 hover:text-primary-light dark:hover:text-primary-dark'
                  }`
                }
              >
                <div className="mr-3 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-card-light dark:bg-card-dark group-hover:bg-primary-light/10 dark:group-hover:bg-primary-dark/10 transition-colors duration-300">
                  <Icon size={18} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span>{t(module.name)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-border-light/30 dark:border-border-dark/30">
        <div className="flex items-center p-3 rounded-lg bg-background-light/50 dark:bg-background-dark/50">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-neon dark:shadow-neon-accent mr-3">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">User Name</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;