import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Note } from '@/types';
import { signOut } from 'next-auth/react';
import NotesList from '@/components/NotesList';
import NoteForm from '@/components/NoteForm';

type ViewMode = 'kanban' | 'list';
type SortField = 'created_at' | 'updated_at' | 'title';
type SortDirection = 'asc' | 'desc';

export default function NotesPage() {
  const router = useRouter();
  const { session, isLoading: isLoadingAuth } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Note editing state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('orderBy', sortField);
      params.append('orderDirection', sortDirection);

      const response = await fetch(`/api/notes?${params.toString()}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortField, sortDirection]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    fetchNotes();
  }, [
    isLoadingAuth,
    session,
    searchQuery,
    sortField,
    sortDirection,
    fetchNotes,
    router,
  ]);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  const handleNoteClick = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setTitle(note.title);
    setContent(note.content);
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const handleNewNote = useCallback(() => {
    setSelectedNote(null);
    setIsEditing(true);
    setTitle('');
    setContent('');
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const saveNote = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    setError(undefined);

    try {
      const method = selectedNote ? 'PUT' : 'POST';
      const url = selectedNote ? `/api/notes/${selectedNote.id}` : '/api/notes';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Untitled Note',
          content: content.trim() || '',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error ? JSON.stringify(data.error) : 'Failed to save note'
        );
        return;
      }

      const savedNote: Note = await res.json();
      setSelectedNote(savedNote);
      setSuccess('Note saved');

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(undefined), 2000);

      // Refresh notes list
      fetchNotes();
    } catch {
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, selectedNote, fetchNotes]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleTitleSave = useCallback(() => {
    saveNote();
  }, [saveNote]);

  const handleContentSave = useCallback(() => {
    saveNote();
  }, [saveNote]);

  if (isLoadingAuth || isLoading)
    return (
      <div className="min-h-screen relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-app-gradient" />
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-text-primary">Loading...</div>
        </div>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      {/* Background with CSS custom properties */}
      <div className="absolute inset-0 bg-app-gradient" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-decoration bg-decoration-primary"></div>
        <div className="bg-decoration bg-decoration-secondary"></div>
      </div>

      <div className="relative text-text-primary">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Notes</h1>
              <p className="text-text-secondary text-sm">
                {notes.length} notes
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex h-[calc(100vh-80px)]">
          <NotesList
            notes={notes}
            selectedNote={selectedNote}
            viewMode={viewMode}
            searchQuery={searchQuery}
            showSearch={showSearch}
            showSortOptions={showSortOptions}
            sortField={sortField}
            sortDirection={sortDirection}
            isLoading={isLoading}
            onNoteClick={handleNoteClick}
            onNewNote={handleNewNote}
            onSearchChange={setSearchQuery}
            onSearchToggle={() => setShowSearch(!showSearch)}
            onSortToggle={() => setShowSortOptions(!showSortOptions)}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
            onViewModeToggle={() =>
              setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')
            }
          />

          <NoteForm
            selectedNote={selectedNote}
            isEditing={isEditing}
            title={title}
            content={content}
            error={error}
            success={success}
            isSaving={isSaving}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onTitleSave={handleTitleSave}
            onContentSave={handleContentSave}
            onNewNote={handleNewNote}
          />
        </div>
      </div>
    </div>
  );
}
