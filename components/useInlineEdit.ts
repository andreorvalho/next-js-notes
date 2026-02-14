import { useState, useEffect } from 'react';

type UseInlineEditParams = {
  value: string;
  onChange: (value: string) => void;
  onSave: (value?: string) => void;
};

export function useInlineEdit({ value, onChange, onSave }: UseInlineEditParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

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

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onChange(editValue);
      onSave(editValue);
    } else {
      onSave();
    }
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    options: { multiline: boolean }
  ) => {
    if (e.key === 'Enter' && !options.multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    } else if (
      e.key === 'Enter' &&
      options.multiline &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditValue(e.target.value);
  };

  const cancelEditing = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return {
    isEditing,
    editValue,
    setEditValue,
    setIsEditing,
    handleClick,
    handleBlur,
    handleSave,
    handleKeyDown,
    handleChange,
    cancelEditing,
  };
}
