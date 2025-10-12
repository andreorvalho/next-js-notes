import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Form from '@/components/Form';
import { useAuth } from '@/hooks/useAuth';
import { HTTP_POST } from '@/types';

export default function NewNotePage() {
  const router = useRouter();
  const { session, isLoading: isLoadingAuth } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
    }
  }, [isLoadingAuth, session, router]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    try {
      const res = await fetch('/api/notes', {
        method: HTTP_POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error ? JSON.stringify(data.error) : 'Failed to create note'
        );
        return;
      }
      setSuccess('Note created');
      setTitle('');
      setContent('');
      router.push('/');
    } catch {
      setError('Network error');
    }
  };

  if (isLoadingAuth) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="flex justify-center p-6">
      <Form
        title="New Note"
        subtitle="Create a new note"
        onSubmit={handleSubmit}
        inputs={[
          {
            type: 'text',
            name: 'title',
            placeholder: 'Title',
            required: true,
            value: title,
            onChange: (e) => setTitle(e.currentTarget.value),
          },
        ]}
        textareas={[
          {
            name: 'content',
            placeholder: 'Content',
            required: true,
            value: content,
            onChange: (e) =>
              setContent((e.currentTarget as HTMLTextAreaElement).value),
            rows: 8,
          },
        ]}
        submitButton={{
          label: 'Create Note',
          type: 'submit',
        }}
        error={error}
        success={success}
      />
    </div>
  );
}
