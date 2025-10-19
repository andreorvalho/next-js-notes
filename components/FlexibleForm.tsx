import Link from 'next/link';
import type {
  ReactNode,
  FormEventHandler,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { InlineEdit } from './InlineEdit';
import { FormInput, FormTextarea } from './FormInput';

type FooterLink = {
  href: string;
  label: string;
};

type InlineField = {
  type: 'inline';
  name: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  label?: string;
  helpText?: string;
  error?: string;
};

type TraditionalInput = {
  type: 'input';
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helpClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>;

type TraditionalTextarea = {
  type: 'textarea';
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  helpClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>;

type FormField = InlineField | TraditionalInput | TraditionalTextarea;

type FlexibleFormProps = {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  footerText?: string;
  footerLink?: FooterLink;
  error?: string;
  success?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  formClassName?: string;
  fields?: FormField[];
  submitButton?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    label?: ReactNode;
    loadingLabel?: ReactNode;
    isSubmitting?: boolean;
  };
  // Layout options
  layout?: 'card' | 'document' | 'minimal';
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  // Legacy support
  inputs?: Array<InputHTMLAttributes<HTMLInputElement>>;
  textareas?: Array<TextareaHTMLAttributes<HTMLTextAreaElement>>;
};

export function FlexibleForm({
  title,
  subtitle,
  showLogo = true,
  footerText,
  footerLink,
  error,
  success,
  onSubmit,
  formClassName,
  fields = [],
  submitButton,
  layout = 'card',
  containerClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  // Legacy support
  inputs,
  textareas,
}: FlexibleFormProps) {
  const renderLogo = () => {
    if (!showLogo) {
      return null;
    }

    return (
      <div className="flex justify-center">
        <picture>
          <source srcSet="/images/logo.webp" type="image/webp" />
          <img
            src="/images/logo.png"
            alt="Notabili Logo"
            className="h-32 w-auto"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
    );
  };

  const renderTitle = () => {
    if (!title) {
      return null;
    }

    const titleClassName =
      layout === 'document' ? 'note-title' : 'mt-6 text-2xl font-semibold';

    return (
      <h1
        className={titleClassName}
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h1>
    );
  };

  const renderSubtitle = () => {
    if (!subtitle) {
      return null;
    }

    const subtitleClassName =
      layout === 'document' ? 'note-meta' : 'mt-2 text-sm';

    return (
      <p
        className={subtitleClassName}
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {subtitle}
      </p>
    );
  };

  const renderSuccessAlert = () => {
    if (!success) {
      return null;
    }

    return (
      <div className="alert alert-success">
        <svg
          className="alert-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{success}</span>
      </div>
    );
  };

  const renderErrorAlert = () => {
    if (!error) {
      return null;
    }

    return (
      <div className="alert alert-error">
        <svg
          className="alert-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  };

  const renderSubmitButton = () => {
    if (!submitButton) {
      return null;
    }

    return (
      <button
        type={submitButton.type || 'submit'}
        disabled={submitButton.isSubmitting || submitButton.disabled}
        className={`btn btn-primary w-full ${submitButton.isSubmitting ? 'btn-loading' : ''} ${submitButton.className || ''}`}
        aria-busy={submitButton.isSubmitting}
        {...submitButton}
      >
        {submitButton.isSubmitting
          ? submitButton.loadingLabel || (
              <span className="sr-only">Submitting...</span>
            )
          : submitButton.label || 'Submit'}
      </button>
    );
  };

  const renderFooter = () => {
    if (!footerText && !footerLink) {
      return null;
    }

    return (
      <footer className={`mt-8 text-center ${footerClassName}`}>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {footerText}
          {footerText && footerLink ? ' ' : null}
          {footerLink ? (
            <Link href={footerLink.href} className="font-medium link-accent">
              {footerLink.label}
            </Link>
          ) : null}
        </p>
      </footer>
    );
  };

  const renderField = (field: FormField, index: number) => {
    const key = `field-${field.name}-${index}`;

    switch (field.type) {
      case 'inline':
        return (
          <div key={key} className="field-container">
            {field.label && (
              <label
                className="form-label"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {field.label}
              </label>
            )}
            <InlineEdit
              value={field.value}
              onChange={field.onChange}
              onSave={field.onSave}
              placeholder={field.placeholder}
              multiline={field.multiline}
              className={field.className}
              titleClassName={field.titleClassName}
              contentClassName={field.contentClassName}
            />
            {field.helpText && (
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {field.helpText}
              </p>
            )}
            {field.error && (
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--color-error)' }}
              >
                {field.error}
              </p>
            )}
          </div>
        );

      case 'input':
        return <FormInput key={key} {...field} />;

      case 'textarea':
        return <FormTextarea key={key} {...field} />;

      default:
        return null;
    }
  };

  const renderFormFields = () => {
    // Use new fields array if provided, otherwise fall back to legacy inputs/textareas
    if (fields.length > 0) {
      return (
        <div className="space-y-6">
          {fields.map((field, index) => renderField(field, index))}
        </div>
      );
    }

    // Legacy support for inputs and textareas
    if (!inputs?.length && !textareas?.length) {
      return null;
    }

    return (
      <div className="space-y-6">
        {inputs &&
          inputs.map((inputProps, index) => {
            const { className, id, name, ...rest } = inputProps;
            const inputId = id || name || `input-${index}`;
            const mergedClassName = className || 'form-input';
            return (
              <div className="form-group" key={`input-${inputId}`}>
                <input
                  id={inputId}
                  name={name}
                  className={mergedClassName}
                  {...rest}
                />
              </div>
            );
          })}

        {textareas &&
          textareas.map((textareaProps, index) => {
            const { className, id, name, ...rest } = textareaProps;
            const textareaId = id || name || `textarea-${index}`;
            const mergedClassName = className || 'form-input';
            return (
              <div className="form-group" key={`textarea-${textareaId}`}>
                <textarea
                  id={textareaId}
                  name={name}
                  className={mergedClassName}
                  {...rest}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const getContainerClasses = () => {
    switch (layout) {
      case 'document':
        return `note-container ${containerClassName}`;
      case 'minimal':
        return `w-full max-w-md ${containerClassName}`;
      case 'card':
      default:
        return `card w-full max-w-md animate-slide-in ${containerClassName}`;
    }
  };

  const getContentClasses = () => {
    switch (layout) {
      case 'document':
        return `note-document ${contentClassName}`;
      case 'minimal':
        return `space-y-6 ${contentClassName}`;
      case 'card':
      default:
        return `space-y-6 ${contentClassName}`;
    }
  };

  const getHeaderClasses = () => {
    switch (layout) {
      case 'document':
        return `mb-10 ${headerClassName}`;
      case 'minimal':
        return `mb-6 ${headerClassName}`;
      case 'card':
      default:
        return `text-center mb-10 ${headerClassName}`;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <header className={getHeaderClasses()}>
        {renderLogo()}
        {renderTitle()}
        {renderSubtitle()}
      </header>

      <div className={getContentClasses()}>
        {renderSuccessAlert()}
        {renderErrorAlert()}

        {onSubmit ? (
          <form onSubmit={onSubmit} className={formClassName || 'space-y-6'}>
            {renderFormFields()}
            {renderSubmitButton()}
          </form>
        ) : (
          <div className={formClassName || 'space-y-6'}>
            {renderFormFields()}
            {renderSubmitButton()}
          </div>
        )}
      </div>

      {renderFooter()}
    </div>
  );
}

export default FlexibleForm;
