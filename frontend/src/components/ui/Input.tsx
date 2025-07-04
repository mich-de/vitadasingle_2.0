import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  helperText?: string;
  multiline?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  multiline = false,
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors
    bg-background-light dark:bg-background-dark
    text-text-primary-light dark:text-text-primary-dark
    placeholder-text-secondary-light dark:placeholder-text-secondary-dark
    focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
    }
    ${Icon ? 'pl-10' : ''}
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
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
          </div>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClasses}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';