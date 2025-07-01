import { useState } from 'react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    deadlines: true,
    expenses: false,
    bookings: true
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleLanguageChange = (newLanguage: 'it' | 'en') => {
    setLanguage(newLanguage);
    setHasChanges(true);
  };

  const handleThemeChange = (newThemeValue: boolean) => {
    if (darkMode !== newThemeValue) {
      toggleDarkMode();
      setHasChanges(true);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Qui salveresti le impostazioni nel backend
    setHasChanges(false);
    // Mostra messaggio di successo
  };

  const SettingCard = ({ icon: Icon, title, description, children }: {
    icon: any;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg">
          <Icon className="text-primary-light dark:text-primary-dark" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
        {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? 'bg-primary-light dark:bg-primary-dark' 
            : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('settings.title')}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t('settings.subtitle')}
          </p>
        </div>
        {hasChanges && (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={16} />
            {t('settings.save')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingCard
          icon={Globe}
          title={t('settings.language')}
          description={t('settings.languageDesc')}
        >
          <div className="space-y-2">
            {[{ code: 'it', name: 'Italiano', flag: '🇮🇹' }, { code: 'en', name: 'English', flag: '🇬🇧' }].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as 'it' | 'en')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  language === lang.code
                    ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                    : 'border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {lang.name}
                  </span>
                </div>
                {language === lang.code && (
                  <Check className="text-primary-light dark:text-primary-dark" size={20} />
                )}
              </button>
            ))}
          </div>
        </SettingCard>

        <SettingCard
          icon={Palette}
          title={t('settings.theme')}
          description={t('settings.themeDesc')}
        >
          <div className="space-y-2">
            {[
              { value: false, label: t('settings.light'), icon: Sun },
              { value: true, label: t('settings.dark'), icon: Moon }
            ].map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.label}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    darkMode === theme.value
                      ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                      : 'border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-text-secondary-light dark:text-text-secondary-dark" size={20} />
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {theme.label}
                    </span>
                  </div>
                  {darkMode === theme.value && (
                    <Check className="text-primary-light dark:text-primary-dark" size={20} />
                  )}
                </button>
              );
            })}
          </div>
        </SettingCard>

        <SettingCard
          icon={Bell}
          title={t('settings.notifications')}
          description={t('settings.notificationsDesc')}
        >
          <div className="space-y-1">
            <Toggle
              checked={notifications.email}
              onChange={(checked) => handleNotificationChange('email', checked)}
              label={t('settings.emailNotifications')}
            />
            <Toggle
              checked={notifications.push}
              onChange={(checked) => handleNotificationChange('push', checked)}
              label={t('settings.pushNotifications')}
            />
            <Toggle
              checked={notifications.deadlines}
              onChange={(checked) => handleNotificationChange('deadlines', checked)}
              label={t('settings.deadlineReminders')}
            />
            <Toggle
              checked={notifications.expenses}
              onChange={(checked) => handleNotificationChange('expenses', checked)}
              label={t('settings.expenseNotifications')}
            />
            <Toggle
              checked={notifications.bookings}
              onChange={(checked) => handleNotificationChange('bookings', checked)}
              label={t('settings.bookingNotifications')}
            />
          </div>
        </SettingCard>

        <SettingCard
          icon={Shield}
          title={t('settings.privacy')}
          description={t('settings.privacyDesc')}
        >
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {t('settings.exportData.title')}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.exportData.desc')}
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {t('settings.cookieManagement.title')}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.cookieManagement.desc')}
              </div>
            </button>
          </div>
        </SettingCard>

        <SettingCard
          icon={User}
          title={t('settings.account')}
          description={t('settings.accountDesc')}
        >
          <div className="space-y-3">
            <Link 
              to="/profile"
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors group"
            >
              <div>
                <div className="font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark">
                  {t('settings.editProfile')}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Gestisci le tue informazioni personali
                </div>
              </div>
              <ExternalLink size={16} className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" />
            </Link>
            <button className="w-full text-left p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {t('settings.changePassword')}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Modifica la tua password di accesso
              </div>
            </button>
          </div>
        </SettingCard>

        <SettingCard
          icon={Info}
          title={t('settings.about')}
          description={t('settings.aboutDesc')}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.version')}
              </span>
              <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                1.0.0
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.developer')}
              </span>
              <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                VitaApp Team
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.lastUpdate')}
              </span>
              <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                26 Giugno 2025
              </span>
            </div>
            <div className="pt-2 border-t border-border-light dark:border-border-dark">
              <button className="text-sm text-primary-light dark:text-primary-dark hover:underline">
                {t('settings.releaseNotes')}
              </button>
              <span className="mx-2 text-text-secondary-light dark:text-text-secondary-dark">•</span>
              <button className="text-sm text-primary-light dark:text-primary-dark hover:underline">
                {t('settings.support')}
              </button>
              <span className="mx-2 text-text-secondary-light dark:text-text-secondary-dark">•</span>
              <button className="text-sm text-primary-light dark:text-primary-dark hover:underline">
                {t('settings.privacyPolicy')}
              </button>
            </div>
          </div>
        </SettingCard>
      </div>

      {hasChanges && (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft border-l-4 border-primary-light dark:border-primary-dark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {t('settings.unsavedChanges.title')}
              </h4>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('settings.unsavedChanges.desc')}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setHasChanges(false)}
                className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition-colors"
              >
                {t('settings.cancel')}
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {t('settings.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
