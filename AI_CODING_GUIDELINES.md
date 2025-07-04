# AI Coding Guidelines for VitaApp

## Overview
This document outlines the coding standards and guidelines for VitaApp development, ensuring consistency when working with AI assistants (ChatGPT, Claude, GitHub Copilot, etc.).

## 1. Core Principles

### Language Requirements
- **ALL code must be written in English**
  - Variable names, function names, class names
  - Comments and documentation
  - Error messages and logging
  - API endpoints and database fields

### Date/Time Standards
- **ALL dates must use ISO 8601 format**
  - Storage: `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:mm:ssZ` for timestamps
  - Never use locale-specific formats in data storage
  - Display formatting happens only in the UI layer

### UI Language Priority
- **English (en-US) is the primary language**
- Italian (it-IT) is secondary
- All UI text uses translation keys: `t('key.subkey')`

## 2. Project Structure Standards

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── modals/         # Modal components
├── features/           # Feature-based organization
│   ├── expenses/       # Expense management
│   ├── properties/     # Property management
│   └── vehicles/       # Vehicle management
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── context/            # React Context providers
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Functions**: camelCase with descriptive names

## 3. TypeScript Standards

### Type Definitions
```typescript
// ✅ Good: English names, clear types
interface UserExpense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string; // ISO 8601 format
  createdAt: string; // ISO 8601 format
}

// ❌ Bad: Italian names, unclear types
interface SpesaUtente {
  id: string;
  importo: any;
  data: Date;
}
```

### API Response Types
```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string; // ISO 8601 format
}
```

## 4. Date Handling Guidelines

### Storage Format
```typescript
// ✅ Always use ISO 8601 for storage
const expense = {
  id: 'exp_123',
  date: '2025-07-03', // Date only
  createdAt: '2025-07-03T14:30:00Z', // Full timestamp
  amount: 50.00
};
```

### Display Format
```typescript
// ✅ Format for display based on locale
import { formatDateForDisplay } from '@/utils/dateHelpers';

const displayDate = formatDateForDisplay(expense.date, userLanguage);
// en: "07/03/2025", it: "03/07/2025"
```

### Date Utilities
```typescript
// ✅ Use provided date helpers
import { 
  getCurrentDate, 
  getCurrentTimestamp, 
  calculateDaysRemaining 
} from '@/utils/dateHelpers';

const newRecord = {
  date: getCurrentDate(),
  createdAt: getCurrentTimestamp()
};
```

## 5. Internationalization (i18n) Standards

### Translation Keys
```typescript
// ✅ Hierarchical key structure
t('expenses.category.food')        // "Food" / "Alimentari"
t('dashboard.welcome')             // "Welcome" / "Benvenuto"
t('common.save')                   // "Save" / "Salva"
t('errors.network.timeout')        // "Network timeout" / "Timeout di rete"
```

### Component i18n Usage
```typescript
// ✅ Proper i18n implementation
import { useLanguage } from '@/context/LanguageContext';

export const ExpenseForm: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <form>
      <h2>{t('expenses.addNew')}</h2>
      <input placeholder={t('expenses.description')} />
      <button>{t('common.save')}</button>
    </form>
  );
};
```

## 6. API Integration Standards

### Request/Response Format
```typescript
// ✅ Consistent API structure
interface CreateExpenseRequest {
  amount: number;
  description: string;
  category: string;
  date: string; // ISO 8601
}

interface CreateExpenseResponse {
  data: Expense;
  success: boolean;
  message: string;
  timestamp: string; // ISO 8601
}
```

### Error Handling
```typescript
// ✅ Structured error handling
try {
  const response = await apiService.createExpense(data);
  showSuccessToast(t('expenses.createSuccess'));
} catch (error) {
  console.error('Failed to create expense:', error);
  showErrorToast(t('expenses.createError'));
}
```

## 7. Component Standards

### Functional Components
```typescript
// ✅ Proper component structure
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      {isLoading && <div>{t('common.loading')}</div>}
    </div>
  );
};
```

### State Management
```typescript
// ✅ Proper state management
const [expenses, setExpenses] = useState<Expense[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 8. Testing Standards

### Unit Tests
```typescript
// ✅ English test descriptions
describe('ExpenseForm', () => {
  it('should submit expense with valid data', () => {
    // Test implementation
  });
  
  it('should show validation errors for invalid data', () => {
    // Test implementation
  });
});
```

## 9. Documentation Standards

### Function Documentation
```typescript
/**
 * Calculate the total amount of expenses for a given date range
 * @param expenses - Array of expense objects
 * @param startDate - Start date in ISO 8601 format (YYYY-MM-DD)
 * @param endDate - End date in ISO 8601 format (YYYY-MM-DD)
 * @returns Total amount as number
 */
export const calculateExpenseTotal = (
  expenses: Expense[],
  startDate: string,
  endDate: string
): number => {
  // Implementation
};
```

### README Updates
- All documentation in English
- Include setup instructions
- Document environment variables
- Provide deployment guide

## 10. AI Prompt Templates

### For Component Creation
```
Create a React component for [feature] that:
- Uses English for all code and comments
- Implements proper TypeScript types
- Uses translation keys for UI text
- Handles loading and error states
- Follows the project structure in src/components/
- Uses ISO 8601 dates if applicable
```

### For API Integration
```
Create an API service for [feature] that:
- Uses English for all code and comments
- Returns data with ISO 8601 timestamps
- Implements proper error handling
- Uses consistent request/response interfaces
- Follows the project structure in src/services/
```

## 11. Quality Checklist

Before submitting code, verify:
- [ ] All code is in English
- [ ] All dates use ISO 8601 format
- [ ] UI text uses translation keys
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Documentation is complete
- [ ] Tests are included (if applicable)

## 12. Common Patterns

### Form Handling
```typescript
const handleSubmit = async (formData: FormData) => {
  setLoading(true);
  try {
    const payload = {
      ...formData,
      date: getCurrentDate(),
      createdAt: getCurrentTimestamp()
    };
    await apiService.create(payload);
    showSuccessToast(t('common.saveSuccess'));
    onClose();
  } catch (error) {
    console.error('Form submission failed:', error);
    showErrorToast(t('common.saveError'));
  } finally {
    setLoading(false);
  }
};
```

### Data Fetching
```typescript
const useFetchData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get<T>(endpoint);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [endpoint]);
  
  return { data, loading, error };
};
```

---

*Last updated: 2025-07-03*
*Version: 1.0.0*
