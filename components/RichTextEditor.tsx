'use client';

import { useRef, useCallback, useEffect } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  // react-quill-ver2 doesn't destroy Quill on unmount; Quill inserts the toolbar as a
  // sibling of the editor container, so when React removes only the editor div the
  // toolbar is left in the DOM. On remount we get a second toolbar. Remove any
  // .ql-toolbar nodes from our wrapper on unmount so we don't accumulate toolbars.
  useEffect(() => {
    return () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      wrapper.querySelectorAll('.ql-toolbar').forEach((el) => el.remove());
    };
  }, []);

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
    'list', // handles both ordered and bullet list values
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
    <div ref={wrapperRef} className={`rich-text-editor ${className}`}>
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
