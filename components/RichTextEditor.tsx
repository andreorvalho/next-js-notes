'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
// CSS is imported globally in _app.tsx
const ReactQuill = dynamic(() => import('react-quill-ver2'), { ssr: false });

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // Configure Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
    clipboard: {
      // Preserve formatting when pasting from Evernote
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
  ];

  // Handle ref callback to configure Quill (guard: getEditor may be undefined before mount or in tests)
  const handleRef = useCallback((ref: any) => {
    quillRef.current = ref;
    if (ref && typeof ref.getEditor === 'function') {
      const quill = ref.getEditor();
      if (
        quill &&
        quill.clipboard &&
        typeof quill.clipboard.addMatcher === 'function'
      ) {
        quill.clipboard.addMatcher(
          Node.ELEMENT_NODE,
          (node: any, delta: any) => {
            if (node && node.tagName === 'EN-NOTE') return delta;
            return delta;
          }
        );
      }
    }
  }, []);

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={handleRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
