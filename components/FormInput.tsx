import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helpClassName?: string;
};

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  helpClassName?: string;
};

export function FormInput({
  label,
  error,
  helpText,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  helpClassName = '',
  id,
  name,
  className,
  ...props
}: FormInputProps) {
  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const mergedInputClassName = `${inputClassName} ${className || ''}`.trim();

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${labelClassName}`}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        className={`form-input ${mergedInputClassName}`}
        {...props}
      />

      {helpText && (
        <p
          className={`text-sm mt-1 ${helpClassName}`}
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {helpText}
        </p>
      )}

      {error && (
        <p
          className={`text-sm mt-1 ${errorClassName}`}
          style={{ color: 'var(--color-error)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function FormTextarea({
  label,
  error,
  helpText,
  containerClassName = '',
  labelClassName = '',
  textareaClassName = '',
  errorClassName = '',
  helpClassName = '',
  id,
  name,
  className,
  ...props
}: FormTextareaProps) {
  const textareaId =
    id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const mergedTextareaClassName =
    `${textareaClassName} ${className || ''}`.trim();

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label htmlFor={textareaId} className={`form-label ${labelClassName}`}>
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        className={`form-input ${mergedTextareaClassName}`}
        {...props}
      />

      {helpText && (
        <p
          className={`text-sm mt-1 ${helpClassName}`}
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {helpText}
        </p>
      )}

      {error && (
        <p
          className={`text-sm mt-1 ${errorClassName}`}
          style={{ color: 'var(--color-error)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
