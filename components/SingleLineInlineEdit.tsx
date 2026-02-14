import { useRef, useEffect } from 'react';
import { useInlineEdit } from './useInlineEdit';

type SingleLineInlineEditProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: (value?: string) => void;
  placeholder?: string;
  className?: string;
  titleClassName?: string;
};

export function SingleLineInlineEdit({
  value,
  onChange,
  onSave,
  placeholder = '',
  className = '',
  titleClassName = '',
}: SingleLineInlineEditProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isEditing,
    editValue,
    handleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
  } = useInlineEdit({ value, onChange, onSave });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => handleKeyDown(e, { multiline: false })}
        placeholder={placeholder}
        className={`inline-edit-input ${titleClassName}`}
        autoFocus
      />
    );
  }

  const displayValue = value || placeholder;
  const isEmpty = !value;

  return (
    <div
      className={`inline-edit-display ${className} ${isEmpty ? 'inline-edit-empty' : ''}`}
      onClick={handleClick}
    >
      {isEmpty ? (
        <span className="inline-edit-placeholder">{placeholder}</span>
      ) : (
        <span className={titleClassName}>{displayValue}</span>
      )}
    </div>
  );
}
