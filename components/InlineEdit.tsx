import { useState, useRef, useEffect } from 'react';

type InlineEditProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: (value?: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export function InlineEdit({
  value,
  onChange,
  onSave,
  placeholder = '',
  multiline = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        // For textarea, select all text
        (inputRef.current as HTMLTextAreaElement).select();
      } else {
        // For input, select all text
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    } else if (e.key === 'Enter' && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onChange(editValue);
      onSave(editValue);
    } else {
      onSave();
    }
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditValue(e.target.value);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`inline-edit-input ${contentClassName}`}
          rows={Math.max(3, editValue.split('\n').length)}
          autoFocus
        />
      );
    } else {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`inline-edit-input ${titleClassName}`}
          autoFocus
        />
      );
    }
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
        <span className={multiline ? contentClassName : titleClassName}>
          {displayValue}
        </span>
      )}
    </div>
  );
}
