import { useRef, useEffect } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { useInlineEdit } from './useInlineEdit';

type MultilineInlineEditProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: (value?: string) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  richText?: boolean;
};

export function MultilineInlineEdit({
  value,
  onChange,
  onSave,
  placeholder = '',
  className = '',
  contentClassName = '',
  richText = false,
}: MultilineInlineEditProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isEditing,
    editValue,
    setEditValue,
    handleClick,
    handleBlur,
    handleSave,
    handleKeyDown,
    handleChange,
    cancelEditing,
  } = useInlineEdit({ value, onChange, onSave });

  useEffect(() => {
    if (isEditing && textareaRef.current && !richText) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing, richText]);

  const handleRichTextChange = (newValue: string) => {
    setEditValue(newValue);
    onChange(newValue);
  };

  if (isEditing) {
    if (richText) {
      return (
        <div className="rich-text-edit-container">
          <RichTextEditor
            value={editValue}
            onChange={handleRichTextChange}
            placeholder={placeholder}
            className={contentClassName}
          />
          <div className="rich-text-edit-actions">
            <button
              type="button"
              onClick={handleSave}
              className="rich-text-save-button"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="rich-text-cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <textarea
        ref={textareaRef}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => handleKeyDown(e, { multiline: true })}
        placeholder={placeholder}
        className={`inline-edit-input ${contentClassName}`}
        rows={Math.max(3, editValue.split('\n').length)}
        autoFocus
      />
    );
  }

  const hasValue = !!value;
  if (richText && hasValue) {
    return (
      <div className={`inline-edit-display ${className}`} onClick={handleClick}>
        <div
          className={`rich-text-display ${contentClassName}`}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-edit-display ${className} ${hasValue ? '' : 'inline-edit-empty'}`}
      onClick={handleClick}
    >
      {hasValue ? (
        <span className={contentClassName}>{value}</span>
      ) : (
        <span className="inline-edit-placeholder">{placeholder}</span>
      )}
    </div>
  );
}
