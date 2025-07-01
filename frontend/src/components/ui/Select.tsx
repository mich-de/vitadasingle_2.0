import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  placeholder = 'Seleziona...',
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg appearance-none transition-colors
    bg-background-light dark:bg-background-dark
    text-text-primary-light dark:text-text-primary-dark
    focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';