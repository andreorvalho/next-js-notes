import Link from 'next/link';
import type {
  ReactNode,
  FormEventHandler,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type FooterLink = {
  href: string;
  label: string;
};

type FormProps = {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  footerText?: string;
  footerLink?: FooterLink;
  error?: string;
  success?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  formClassName?: string;
  inputs?: Array<InputHTMLAttributes<HTMLInputElement>>;
  textareas?: Array<TextareaHTMLAttributes<HTMLTextAreaElement>>;
  submitButton?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    label?: ReactNode;
    loadingLabel?: ReactNode;
    isSubmitting?: boolean;
  };
};

export function Form({
  title,
  subtitle,
  showLogo = true,
  footerText,
  footerLink,
  error,
  success,
  onSubmit,
  formClassName,
  inputs,
  textareas,
  submitButton,
}: FormProps) {
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

    return (
      <h1
        className="mt-6 text-2xl font-semibold"
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

    return (
      <p
        className="mt-2 text-sm"
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
      <footer className="mt-8 text-center">
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

  const renderFormFields = () => {
    // Early return if no form fields exist
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
  return (
    <div className="card w-full max-w-md animate-slide-in">
      <header className="text-center mb-10">
        {renderLogo()}
        {renderTitle()}
        {renderSubtitle()}
      </header>

      <div>
        {renderSuccessAlert()}
        {renderErrorAlert()}

        <form onSubmit={onSubmit} className={formClassName || 'space-y-6'}>
          {renderFormFields()}
          {renderSubmitButton()}
        </form>
      </div>

      {renderFooter()}
    </div>
  );
}

export default Form;
