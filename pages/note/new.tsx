import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { HTTP_POST } from '@/types';
import { FlexibleForm } from '@/components/FlexibleForm';

export default function NewNotePage() {
  const router = useRouter();
  const { session, isLoading: isLoadingAuth } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
    }
  }, [isLoadingAuth, session, router]);

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    setError(undefined);

    try {
      const res = await fetch('/api/notes', {
        method: HTTP_POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Untitled Note',
          content: content.trim() || ''
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ? JSON.stringify(data.error) : 'Failed to create note');
        return;
      }

      setLastSaved(new Date());
      setSuccess('Note saved');

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(undefined), 2000);

      // If both title and content are filled, redirect to home
      if (title.trim() && content.trim()) {
        setTimeout(() => router.push('/'), 1000);
      }
    } catch {
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleTitleSave = () => {
    saveNote();
  };

  const handleContentSave = () => {
    saveNote();
  };

  if (isLoadingAuth) return <p>Loading...</p>;
  if (!session) return null;

  const fields = [
    {
      type: 'inline' as const,
      name: 'title',
      value: title,
      onChange: handleTitleChange,
      onSave: handleTitleSave,
      placeholder: 'Note title',
      className: 'note-title',
      titleClassName: 'note-title',
    },
    {
      type: 'inline' as const,
      name: 'content',
      value: content,
      onChange: handleContentChange,
      onSave: handleContentSave,
      placeholder: 'Start writing your note content here...',
      multiline: true,
      className: 'note-content',
      contentClassName: 'note-content',
    },
  ];

  return (
    <>
      <FlexibleForm
        layout="document"
        fields={fields}
        error={error}
        success={success}
        subtitle={
          lastSaved
            ? `Last saved on ${lastSaved.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}`
            : 'Start typing to create your note...'
        }
        showLogo={false}
      />

      {/* Save indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-surface text-text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="loading-spinner"></div>
          <span>Saving...</span>
        </div>
      )}
    </>
  );
}
